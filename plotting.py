import numpy as np
import matplotlib.pyplot as plt

class Plotter:
	def __init__(self):
		pass

	def format_name(self, first, last):
		return "{}, {}".format(last, first)


	def get_age(self, date, dob):
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

	"""
	Plot the ranking histories for 4 players max
	"""
	def plot(self, player_ranking_histories):

		def ranking_date_to_age(rank_date, dob):
			age = self.get_age(rank_date, dob)
			return age[0] + (age[1] / 12) + ((1/12) * (age[2] / 30))

		colors = ['bo-', 'ro-', 'go-', 'yo-']
		for i in range(len(player_ranking_histories)):
			first_name, last_name = player_ranking_histories[i]['name']
			dob = player_ranking_histories[i]['dob']
			country = player_ranking_histories[i]['country']
			# the list of day, ranking pairs (days always in ascending order)
			date_ranking = player_ranking_histories[i]['ranking_history']
			ranks = [x['rank'] for x in date_ranking]
			dates = [x['date'] for x in date_ranking]
			ages = list(map(lambda x: ranking_date_to_age(x, dob), dates))
			print(ages)
			print(">>>>>")
			print(dates)
			
			plt.plot(ages, ranks, colors[i], label=self.format_name(first_name, last_name), markersize=4)
		plt.legend()
		plt.show()








if __name__ == "__main__":
	h = Plotter()

