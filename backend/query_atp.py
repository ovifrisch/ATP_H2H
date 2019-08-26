import psycopg2


class QueryATP:
	def __init__(self):
		self.conn = psycopg2.connect(dbname="atp")
		self.cur = self.conn.cursor()
		self.most_recent_rank_date = 20190225

	"""
	get the results of the query
	"""
	def get(self, query):
		self.cur.execute(query)
		results = self.cur.fetchall()
		return results

	"""
	Given player's first and last name,
	get their id
	"""
	def player_id(self, first_name, last_name):
		q = """
			SELECT player_id
			FROM players
			WHERE first_name = '{}' and last_name = '{}'
		""".format(first_name, last_name)
		return self.get(q)


	def get_matches(self, player_id):
		q = """
			SELECT *
			FROM matches
			WHERE winner_id = {} or loser_id = {}
		""".format(player_id, player_id)
		return self.get(q)

	def topTenPlayers(self):

		q = """
			SELECT first_name, last_name, player_id
			FROM rankings NATURAL JOIN players
			WHERE ranking_date = '{}'
			ORDER BY rank ASC
			LIMIT 10
		""".format(self.most_recent_rank_date)
		return self.get(q)


	"""
	Get the top 10 players ordered by their
	career highs and whose first or last name
	starts with prefix
	"""
	def topTenFiltered(self, prefix):
		prefix = prefix.lower()
		filtered_players = """
			SELECT first_name, last_name, player_id
			FROM players
			WHERE LOWER(first_name) LIKE {} or LOWER(last_name) LIKE {}
		""".format("'{}%'".format(prefix), "'{}%'".format(prefix))


		q = """
			SELECT first_name, last_name, player_id, MIN(rank)
			FROM rankings NATURAL JOIN ({}) AS B
			GROUP BY player_id, first_name, last_name
			ORDER BY MIN(rank) ASC
			LIMIT 10
		""".format(filtered_players)

		return self.get(q)

	"""
	Given player's id,
	get their name, country, and dob
	"""
	def player_info(self, id_):
		print(id_)
		q = """
			SELECT first_name, last_name, country, dob
			FROM players
			WHERE player_id = {}
		""".format(id_)
		return self.get(q)

	"""
	get each ranking and ranking_date pair for
	this player between the ages of age_start
	and age_end
	"""
	def get_ranking_history(self, player_id, age_start, age_end):

		def add_year(date, year):
			return str(int(date[:4]) + year) + date[4:]

		player_dob_table = """
			SELECT player_id, dob
			FROM players
		"""

		"""
		took me some time to figure out how to select only columns that have ranking dates
		between upper and lower limits of the player's dob

		source: http://www.sqlines.com/postgresql/how-to/dateadd
		"""

		q = """
			SELECT rank, ranking_date, dob
			FROM rankings
			NATURAL JOIN ({}) AS A
			WHERE player_id = {} and ranking_date >= dob + INTERVAL'{} year' and ranking_date <= dob + INTERVAL'{} year'
			ORDER BY ranking_date
		""".format(player_dob_table, player_id, age_start, age_end)
		return self.get(q)


	def get_head2head(self, player_id1, player_id2):
		q = """
			SELECT *
			FROM matches
			WHERE winner_id = {} and loser_id = {} or winner_id = {} and loser_id = {}
		""".format(player_id1, player_id2, player_id2, player_id1)
		return self.get(q)

	"""
	get all
	"""
	def get_duplicate_names(self):
		q = """
		SELECT DISTINCT A.first_name, A.last_name, A.hand, A.country
		FROM players as A, players as B
		WHERE A.first_name = B.first_name and A.last_name = B.last_name and A.player_id != B.player_id
		"""
		return self.get(q)


def parse_dt(date_time):
	return {'yr': date_time.year, 'mo': date_time.month, 'day': date_time.day}

def parse_hist(history):
	res = []
	for hist in history:
		rank = hist[0]
		date = parse_dt(hist[1])
		entry = {'date':date, 'rank':rank}
		res.append(entry)
	return res

def plot_players(atp, players, start, end):
	ids = []
	for player in players:
		p_id = atp.player_id(player.split(" ")[0], player.split(" ")[1])
		if (len(p_id) == 0):
			raise Exception("{} is not a pro tennis player".format(player))
		ids.append(p_id[0][0])

	player_infos = []
	print(ids)
	for id_ in ids:
		player_infos.append(atp.player_info(id_)[0])

	print(player_infos)

	rank_hists = []
	for id_ in ids:
		rank_hists.append(parse_hist(atp.get_ranking_history(id_, start, end)))

	player_dicts = []
	for i in range(len(ids)):
		p_info = player_infos[i]
		player_dict = {
			'name': (p_info[0], p_info[1]),
			'dob': parse_dt(p_info[3]),
			'country': p_info[2],
			'ranking_history': rank_hists[i]
		}
		player_dicts.append(player_dict)

	p = Plotter()
	p.plot(player_dicts)


if __name__ == "__main__":
	atp = QueryATP()
	print(atp.topTenFiltered(""))
	# i1 = atp.player_id("Rafael", "Nadal")[0][0]
	# i2 = atp.player_id("Novak", "Djokovic")[0][0]
	# r = atp.get_head2head(i1, i2)
	# print(r)
	# players = ["Andrey Rublev"]
	# plot_players(atp, players, 20, 40)
	# all_rafa = atp.get_ranking_history(104745, 0, 26)
	# print(len(all_rafa))
	# rafa_older_25 = atp.get_ranking_history(104745, 25, 26)
	# print(rafa_older_25)
	# pl_id = 104745
	# player_info = atp.player_info(pl_id)[0]
	# rank_hist = parse_hist(atp.get_ranking_history(pl_id, 10, 50))
	# player_dict = {
	# 	'name': (player_info[0], player_info[1]),
	# 	'dob': parse_dt(player_info[3]),
	# 	'country': player_info[2],
	# 	'ranking_history': rank_hist
	# }
	# player_dicts = [player_dict]
	# p = Plotter()
	# p.plot(player_dicts)
	# # dups = atp.get_duplicate_names()
	# prefix = atp.players_name_prefix("Djokov")
	# print(prefix)


