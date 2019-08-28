import math

def context_filter(history):

	if (len(history) <= 2):
		return history
	

	def threshold(rank):
		return math.floor(rank / 10)

	collapsed = [history[0]] 
	# always add the first element
	curr_threshold = threshold(history[0]['rank'])
	curr_rank = history[0]['rank']
	for i in range(1, len(history) - 1):
		if (abs(history[i]['rank'] - curr_rank) <= curr_threshold and abs(history[i+1]['rank'] - curr_rank) <= curr_threshold):
			continue
		else:
			if (collapsed[-1] != history[i]):
				collapsed.append(history[i])
			if (abs(history[i]['rank'] - curr_rank) > curr_threshold):
				curr_threshold = threshold(history[i]['rank'])
				curr_rank = history[i]['rank']
			else:
				curr_threshold = threshold(history[i+1]['rank'])
				curr_rank = history[i+1]['rank']
				collapsed.append(history[i+1])
	if (collapsed[-1] != history[-1]):
		collapsed.append(history[-1])
	return collapsed




x1 = [8, 9, 40, 41, 42, 43]
xs = [8, 7, 6, 7, 8, 6, 20, 21, 22, 23, 24, 25, 26, 1, 2, 1, 2, 80, 81, 82]
# should map to: [8, 7, 6, 7, 8, 6, 20, 22, 23, 25, 26, 1, 2, 1, 2]
ranks = list(map(lambda x: {'rank':x}, xs))
ranks1 = list(map(lambda x: {'rank':x}, x1))
print(context_filter(ranks))