import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel('gemini-2.5-flash', tools='google_search_retrieval')
    response = model.generate_content('When was the latest ceasefire between Israel and Hezbollah?')
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
