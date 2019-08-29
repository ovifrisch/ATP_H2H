from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import keys

class Youtube:
	def __init__(self):
		self.youtube = build('youtube', 'v3', developerKey=keys.get_youtube_key())

	def search(self, query_string):
		"""
		get the top result, return its thumbnail link, video link, and title
		"""
		response = self.youtube.search().list(
			q = query_string,
			part = 'snippet',
			maxResults=1
		).execute()

		res = response['items'][0]
		title = res['snippet']['title']
		url = "youtube.com/watch?v=" + res['id']['videoId']
		thumb = res['snippet']['thumbnails']['default']['url']
		return {'title':title, 'url':url, 'thumbnail':thumb}


if __name__ == "__main__":
	api = Youtube()
	res = api.search("US Open 2019")
	print(res)


