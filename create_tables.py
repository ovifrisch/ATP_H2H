import psycopg2
conn = psycopg2.connect(dbname="atp")
cur = conn.cursor()

commands = [
	"""
	CREATE TABLE IF NOT EXISTS players(
		player_id int,
		first_name varchar(50),
		last_name varchar(50),
		hand char(1),
		dob date,
		country char(3),
		PRIMARY KEY(player_id)
	);
	""",

	"""
	CREATE TABLE IF NOT EXISTS rankings(
		rank int,
		ranking_date date,
		points int,
		player_id int,
		PRIMARY KEY(rank, ranking_date, player_id),
		FOREIGN KEY(player_id) REFERENCES players(player_id)
	);
	""",
]

for command in commands:
	cur.execute(command)

conn.commit()