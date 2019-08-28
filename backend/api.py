from flask import Blueprint, jsonify, request
from query_atp import QueryATP

atp = QueryATP()
main = Blueprint('main', __name__)

# find the tournament name, and matches for this player between dat1 and date2
@main.route('/get_significant_matches')
def get_significant_matches():
	player_id = int(request.args.get('player_id'))
	starting_age = request.args.get('date1')
	ending_age = request.args.get('date2')
	data = atp.get_significant_matches(player_id, starting_age, ending_age)
	return jsonify({'data': data})


@main.route('/get_ranking_history')
def get_ranking_history():

	def parse_dt(date_time):
			return {'yr': date_time.year, 'mo': date_time.month, 'day': date_time.day}

	player_id = int(request.args.get('player_id'))
	starting_age = int(request.args.get('starting_age'))
	ending_age = int(request.args.get('ending_age'))
	p_info = atp.player_info(player_id)
	print(p_info[0][3])
	dob = parse_dt(p_info[0][3])
	qres = atp.get_ranking_history(player_id, starting_age, ending_age)

	def parse(history):
		res = []
		for hist in history:
			rank = hist[0]
			date = parse_dt(hist[1])
			entry = {'date':date, 'rank':rank}
			res.append(entry)
		return res

	"""
	filter out rankings that have not changed since previous ranking date,
	keeping only the first and last instances of that ranking
	ex: [1, 1, 1, 1, 2, 2, 2, 3, 3] => [1, 1, 2, 2, 3, 3]
	"""
	def filter(history):
		if (len(history) == 0):
			return history
		filtered = [history[0]]
		for i in range(1, len(history) - 1):
			if (history[i]['rank'] == history[i-1]['rank'] and history[i]['rank'] == history[i+1]['rank']):
				continue
			else:
				filtered.append(history[i])
		if (len(history) > 1):
			filtered.append(history[-1])
		return filtered


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

