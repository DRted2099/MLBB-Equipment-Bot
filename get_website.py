import requests

url = "https://music.youtube.com/playlist?list=PL7AhVua53cIqPJYMIkLQflUB9XnhbV99Y&si=yY5UHzsnH4_eiI2w"


response = requests.get(url)

with open('website.html', 'w', encoding='utf-8') as file:

    file.write(response.text)