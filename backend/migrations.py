import psycopg2
conn = psycopg2.connect(dbname="atp")
cur = conn.cursor()

# q = """
# 	ALTER TABLE matches
# 	ADD COLUMN video_url varchar(100)
# """

q = """
	ALTER TABLE matches
	ADD COLUMN video_thumbnail varchar(200)
"""

cur.execute(q)
conn.commit()