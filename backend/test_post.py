import requests
import json
headers = {'Content-Type': 'application/json'}
data = {'message': 'Hello'}
response = requests.post('https://jupid2.onrender.com/chat/', headers=headers, json=data)
print(response.status_code)
print(response.text)
