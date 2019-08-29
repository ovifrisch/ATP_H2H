import psycopg2
conn = psycopg2.connect(dbname="atp")
cur = conn.cursor()

# q = """
# 	ALTER TABLE matches
# 	ADD COLUMN video_url varchar(100)
# """

# q = """
# 	ALTER TABLE matches
# 	ADD COLUMN video_thumbnail varchar(200)
# """

# q = """
# ALTER TABLE matches
# ADD COLUMN match_id int
# """

# q ="""
# ALTER TABLE matches
# DROP COLUMN match_id
# """

# q="""
# ALTER TABLE matches ADD COLUMN match_id SERIAL PRIMARY KEY
# """

# q = """
# 	DROP TABLE matches;
# """

q = """
	CREATE TABLE matches(
		match_id int,
		winner_id int,
		loser_id int,
		match_date date,
		tournament varchar(50),
		score varchar(50),
		round varchar(10),
		video_url varchar(100),
		video_thumbnail varchar(200)
	);
"""

cur.execute(q)
conn.commit()