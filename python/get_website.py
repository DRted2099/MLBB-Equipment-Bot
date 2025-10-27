import requests

url = "https://mlbbmeta.com/items/"


response = requests.get(url)

with open('website.html', 'w', encoding='utf-8') as file:

    file.write(response.text)