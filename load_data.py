import psycopg2
import csv

conn = psycopg2.connect(dbname="atp")
cur = conn.cursor()

base = "./data/"

players_file_name = base + "atp_players.csv"
rankings_file_names = []

# start = 7
# while (1):
# 	if (start == 2):
# 		break
# 	rankings_file_names.append(base + "atp_rankings_{}0s.csv".format(str(start)))
# 	start += 1
# 	if (start == 10):
# 		start = 0


matches_file_names = []
year = 2000
while (1):
	if (year == 2020):
		break
	matches_file_names.append(base + "atp_matches_{}.csv".format(str(year)))
	year += 1




def insert_command(values, table_name):
	return "INSERT INTO " + table_name + " VALUES " + values

"""
load all the players
"""
# commands = []
# longest_first_name = ""
# longest_last_name = ""
# longest_bd = ""
# longest_country = ""
# longest_hand = ""
# with open(players_file_name) as player_file:
# 	print("Reading " + players_file_name + " ...")
# 	csv_reader = csv.reader(player_file, delimiter=',')
# 	line = 0
# 	for row in csv_reader:
# 		if (line == 0):
# 			line += 1
# 			continue
# 		player_id = row[0]
# 		first_name = row[1]
# 		last_name = row[2]
# 		hand = row[3]
# 		bd = row[4]
# 		bd = bd[:4] + "-" + bd[4:6] + "-" + bd[6:8]
# 		country = row[5]
# 		if (bd == "--"):
# 			values = "({}, '{}', '{}', '{}', NULL, '{}')".format(player_id, first_name, last_name, hand, country)
# 		else:
# 			values = "({}, '{}', '{}', '{}', '{}', '{}')".format(player_id, first_name, last_name, hand, bd, country)
# 		cmd = insert_command(values, "players")
# 		commands.append(cmd)

# for command in commands:
# 	cur.execute(command)

# conn.commit()

"""
load all the rankings
"""
# commands = []
# for rankings_file_name in rankings_file_names:
# 	print("Reading " + rankings_file_name + " ...")
# 	with open(rankings_file_name) as ranking_file:
# 		csv_reader = csv.reader(ranking_file, delimiter=',')
# 		line = 0
# 		for row in csv_reader:
# 			if (line == 0):
# 				line += 1
# 				continue
# 			date = row[0]
# 			date = date[:4] + "-" + date[4:6] + "-" + date[6:8]
# 			rank = row[1]
# 			player_id = row[2]
# 			points = row[3]
# 			if (points == ""):
# 				points = "NULL"
# 			values = "('{}', '{}', {}, {})".format(rank, date, points, player_id)
# 			cmd = insert_command(values, "rankings")
# 			commands.append(cmd)



commands = []
for matches_file_name in matches_file_names:
	print("Reading " + matches_file_name + " ...")
	with open(matches_file_name) as matches_file:
		commands = []
		csv_reader = csv.reader(matches_file, delimiter=',')
		line = 0
		for row in csv_reader:
			if (line == 0):
				line += 1
				continue
			winner_id = row[7]
			loser_id = row[15]
			date = row[5]
			date = date[:4] + "-" + date[4:6] + "-" + date[6:8]
			tournament = row[1]
			tournament = tournament.replace("'","")
			score = row[23]
			round_ = row[25]
			values = "({}, {}, '{}', '{}', '{}', '{}')".format(winner_id, loser_id, date, tournament, score, round_)
			cmd = insert_command(values, "matches")
			commands.append(cmd)

	print(len(commands))
	for command in commands:
		cur.execute(command)

	conn.commit()
	print("Committed " + matches_file_name + " ...")


















