

"""
	only send a maximum of ~20 data points
	"""
	def context_filter(history):
		if (len(history) <= 2):
			return history

		def lifetime_threshold(lifetime):
			age_diff = ending_age - starting_age
			# bigger age_diff, bigger threshold
			return lifetime > ((48 * age_diff) / 40)

		collapsed = [history[0]] 
		# always add the first element
		lifetime = 0
		for i in range(1, len(history)):
			if (lifetime_threshold(lifetime)):
				collapsed.append(history[i])
				lifetime = 0
			else:
				lifetime += 1
		if (collapsed[-1] != history[-1]):
			collapsed.append(history[-1])
		return collapsed
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

"""
takes a complete ranking history and reduces
it to a more compact version by collapsing consecutive rankings
that are the same or that are within some threshold, where this
threshold is low if the player's rank is numerically low, and high
if numerically high. The idea is that if a player has a good ranking,
like top 10 for example, a change of 1 ranking spot is more significant
than a change of 1 ranking spot for someone ranked in the top 100.

so the threshold is a function of a player's current ranking. i think a good
function is floor(rank/10), so if anyones rank in the top 10 changes just by 1
it gets plotted. if somone ranked 100 changes rank by 10, it won't get noticed

also, if the lifetime of a ranking within a threshold is very large, then we
would want to plot both points so that we don't interpolate a diagonal line. but
if the ranking is very short lived, we only want to plot one point. the purpose
of this is so that the user can click on a clearly defined point on the graph
rather than try to pick one point from two points that are very close together.

so the threshold lifetime must be a function of the graph's resolution, which we
have from ending_age - starting_age


ok, but if the age diff is very big, we also don't care about tiny changes in
ranking (unless the ranking resolution is small, which depends on which
players are currently being plotted, which we don't have any information about here,
unless we send the data in the request. what we want is the minimum and maximum
rankings across all players currently visible in the graph).
i think which rankings we choose to display should only be based on the
resolution.
"""

def context_filter(history):

	if (len(history) <= 2):
		return history
	

	def threshold(rank):
		return math.floor(rank / 10)

	def lifetime_threshold(lifetime):
		age_diff = ending_age - starting_age
		# bigger age_diff, bigger threshold
		return lifetime > ((48 * age_diff) / 40)

	collapsed = [history[0]] 
	# always add the first element
	curr_threshold = threshold(history[0]['rank'])
	curr_rank = history[0]['rank']
	curr_lifetime = 0
	for i in range(1, len(history) - 1):
		if (abs(history[i]['rank'] - curr_rank) <= curr_threshold and abs(history[i+1]['rank'] - curr_rank) <= curr_threshold):
			curr_lifetime += 1
			continue
		else:
			if (collapsed[-1] != history[i] and not(abs(history[i]['rank'] - curr_rank) > curr_threshold) and lifetime_threshold(curr_lifetime)):
				collapsed.append(history[i])
			if (abs(history[i]['rank'] - curr_rank) > curr_threshold):
				curr_threshold = threshold(history[i]['rank'])
				curr_rank = history[i]['rank']
			else:
				curr_threshold = threshold(history[i+1]['rank'])
				curr_rank = history[i+1]['rank']
				collapsed.append(history[i+1])
			curr_lifetime = 0
	if (collapsed[-1] != history[-1]):
		collapsed.append(history[-1])
	return collapsed