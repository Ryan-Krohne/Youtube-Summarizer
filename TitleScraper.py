import requests
from bs4 import BeautifulSoup

VIDEO_URL = "https://www.youtube.com/watch?v=tgfAOOGr9vM"

response = requests.get(VIDEO_URL)
soup = BeautifulSoup(response.text, 'html.parser')

title = soup.find("title").text
print(f"Video Title: {title}")
