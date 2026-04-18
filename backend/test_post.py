import requests
import json
headers = {'Content-Type': 'application/json'}
data = {'message': 'Hello'}
response = requests.post('http://localhost:8000/chat/', headers=headers, json=data)
print(response.status_code)
print(response.text)
