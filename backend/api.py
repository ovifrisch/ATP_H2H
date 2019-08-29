from flask import Blueprint, jsonify, request
from query_atp import QueryATP
import math
import numpy as np
from youtube import Youtube

atp = QueryATP()
tube = Youtube()
main = Blueprint('main', __name__)


# find the tournament name, and matches for this player between dat1 and date2
@main.route('/get_significant_matches')
def get_significant_matches():

	def fetch_missing_videos(data):

		def get_query_str(tourney_name, tourney_date, match_entry):
			winner = " ".join([match_entry['winner']['first_name'], match_entry['winner']['last_name']])
			loser = " ".join([match_entry['loser']['first_name'], match_entry['loser']['last_name']])
			return " ".join([tourney_name, str(tourney_date.year), winner, "vs", loser])

		def is_relevant(video_title, tourney_name, match_entry):
			return True

		for i in range(len(data)):
			for j in range(len(data[i]['matches'])):
				tourney_name = data[i]['name']
				tourney_date = data[i]['date']
				match_entry = data[i]['matches'][j]
				if (match_entry['video_url'] == None or match_entry['video_thumbnail'] == None):
					query_str = get_query_str(tourney_name, tourney_date, match_entry)
					video_info = tube.search(query_str)
					title = video_info['title']
					# HERE YOU SHOULD CHECK TO SEE IF THE TITLE IS RELEVANT
					# IF IT'S NOT THEN DON'T SET THE VIDEO PARAMS, AND DON'T ADD
					# TO DB. INSTEAD ADD TO DB A SPECIAL VALUE THAT U CHECK FOR
					# AND IF IT'S SET YOU JUST IGNORE THIS ENTRY
					if (not is_relevant(title, tourney_name, match_entry)):
						continue

					# insert into db
					match_entry['video_url'] = video_info['url']
					match_entry['video_thumbnail'] = video_info['thumbnail']
		return data






	"""
	input: list of (winner_name, loser_name, match date, tournament, score, round)
	output: list of tournaments where each tournament is a dict with the following structure:
	name:
	date:
	matches: [
		winner:
		loser:
		score:
		round:
		video_url:
		video_thumbnail:
	]

	tournaments are ordered by their start dates, and matches are ordered by their rounds
	(earlier rounds first)
	"""
	def organize(data):
		res = []
		tourns = {}

		for d in data:
			tourn = d[5]
			if (tourn not in tourns):
				tourns[tourn] = {'date':d[4], 'matches':[]}

		for d in data:
			# winner/loser first/last names
			wf = d[0]
			wl = d[1]
			lf = d[2]
			ll = d[3]
			tourn = d[5]
			scr = d[6]
			rd = d[7]
			url = d[8]
			thumb = d[9]

			tourns[tourn]['matches'].append(
				{
					'winner': {
						'first_name': wf,
						'last_name': wl
					},
					'loser': {
						'first_name':lf,
						'last_name':ll
					},
					'score': scr,
					'round': rd,
					'video_url': url,
					'video_thumbnail': thumb
				}
			)

		for k, v in tourns.items():
			res.append({'name':k, 'date': v['date'], 'matches':v['matches']})

		rounds = ["R128", "R64", "R32", "R16", "QF", "SF", "F"]
		def f(x):
			try:
				return rounds.index(x['round'])
			except ValueError:
				return -1

		res.sort(key=lambda x: x['date'])

		for i in range(len(res)):
			res[i]['matches'].sort(key=lambda x: f(x))
		return res


	player_id = int(request.args.get('player_id'))
	starting_age = request.args.get('date1')
	ending_age = request.args.get('date2')
	data = atp.get_matches_between(player_id, starting_age, ending_age)
	# print(data)
	data = organize(data)
	data = fetch_missing_videos(data)
	return jsonify({'data': data})


@main.route('/get_ranking_history')
def get_ranking_history():

	def parse_dt(date_time):
			return {'yr': date_time.year, 'mo': date_time.month, 'day': date_time.day}

	player_id = int(request.args.get('player_id'))
	starting_age = int(request.args.get('starting_age'))
	ending_age = int(request.args.get('ending_age'))
	p_info = atp.player_info(player_id)
	dob = parse_dt(p_info[0][3])
	qres = atp.get_ranking_history(player_id, starting_age, ending_age)

	def ranking_date_to_age(rank_date, dob):

		def get_age(date, dob):
			years = date['yr'] - dob['yr']
			months = 0
			if (date['mo'] < dob['mo']):
				years -= 1
				months = 12 - (dob['mo']-date['mo'])
			else:
				months = date['mo']-dob['mo']

			days = 0
			if (date['day'] < dob['day']):
				months -= 1
				days = 30 - (dob['day']-date['day'])
			else:
				days = date['day']-dob['day']
			return (years, months, days)


		age = get_age(rank_date, dob)
		return age[0] + (age[1] / 12) + ((1/12) * (age[2] / 30))

	def parse(history):
		res = []
		for hist in history:
			rank = hist[0]
			date = parse_dt(hist[1])
			entry = {'date':date, 'rank':rank}
			res.append(entry)
		return res

	"""
	limit the amount of data sent so that points aren't plotted very
	closely together in the frontend. this depends on the age resolution
	as well as how much the player is contained within that resolutuon
	"""
	def filter(history):
		if (len(history) < 2):
			return history
		this_start = ranking_date_to_age(history[0]['date'], dob)
		this_end = ranking_date_to_age(history[-1]['date'], dob)
		ratio = (this_end - this_start) / (ending_age - starting_age)
		num_els = min(40*ratio, len(history))
		idxs = np.round(np.linspace(0, len(history) - 1, num_els)).astype(int)
		res = [history[i] for i in idxs]
		return res

	date_ranking = filter(parse(qres))
	ranks = [x['rank'] for x in date_ranking]
	dates = [x['date'] for x in date_ranking]
	ages = list(map(lambda x: ranking_date_to_age(x, dob), dates))

	data = []
	for i in range(len(ages)):
		data.append({'age': ages[i], 'rank': ranks[i], 'date':dates[i]})

	return jsonify({'data':data})

@main.route('/topTenFiltered')
def topTenFiltered():
	prefix = request.args.get('prefix')
	qres = atp.topTenFiltered(prefix)
	print(prefix, qres)
	def parse(xs):
		res = []
		for x in xs:
			res.append({'first_name':x[0], 'last_name':x[1], 'id':x[2]})
		return res

	parsed_data = parse(qres)
	return jsonify({'data': parsed_data})



@main.route('/topTenPlayers')
def topTenPlayers():
	qres = atp.topTenPlayers()
	def parse(xs):
		res = []
		for x in xs:
			res.append({'first_name':x[0], 'last_name':x[1], 'id':x[2]})
		return res

	parsed_data = parse(qres)
	return jsonify({'data': parsed_data})

