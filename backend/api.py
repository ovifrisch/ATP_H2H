from flask import Blueprint, jsonify, request
from query_atp import QueryATP

atp = QueryATP()
main = Blueprint('main', __name__)

# @main.route('/get_player_name')
# def get_player_name():
# 	params = request.get_json()
# 	player_id = int(params['player_id'])


@main.route('/get_ranking_history')
def get_ranking_history():

	def parse_dt(date_time):
			return {'yr': date_time.year, 'mo': date_time.month, 'day': date_time.day}

	player_id = int(request.args.get('player_id'))
	starting_age = int(request.args.get('starting_age'))
	ending_age = int(request.args.get('ending_age'))
	p_info = atp.player_info(player_id)[0]
	dob = parse_dt(p_info[3])
	qres = atp.get_ranking_history(player_id, starting_age, ending_age)

	def parse(history):
		res = []
		for hist in history:
			rank = hist[0]
			date = parse_dt(hist[1])
			entry = {'date':date, 'rank':rank}
			res.append(entry)
		return res

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

	date_ranking = parse(qres)
	ranks = [x['rank'] for x in date_ranking]
	dates = [x['date'] for x in date_ranking]
	ages = list(map(lambda x: ranking_date_to_age(x, dob), dates))

	data = []
	for i in range(len(ages)):
		data.append({'age': ages[i], 'rank': ranks[i]})

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


@main.route('/add_movie', methods=['POST'])
def add_movie():
	movie_data = request.get_json()

	new_movie = Movie(title=movie_data['title'], rating=movie_data['rating'])

	db.session.add(new_movie)
	db.session.commit()
	return 'Done', 201


@main.route('/movies')
def movies():
	movie_list = Movie.query.all()
	movies = []

	for movie in movie_list:
		movies.append({'title': movie.title, 'rating': movie.rating})

	return jsonify({'movies':movies})
