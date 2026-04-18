import os
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


class ChatbotService:
    def _get_client(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None
        return genai.Client(api_key=api_key)

    def _system_instruction(self) -> str:
        today = datetime.now().strftime("%A, %d %B %Y")
        return (
            f"You are Jupid AI, a helpful assistant specializing in competitor intelligence "
            f"and business analytics. Today's date is {today}. Always use this date when "
            f"answering questions about the current date or time. Help the user with their "
            f"queries about competitor intelligence, market analysis, and business strategy."
        )

    async def get_response(self, message: str) -> str:
        client = self._get_client()
        if not client:
            return (
                "Error: GEMINI_API_KEY is not set in the backend .env file. "
                "Please add your Gemini API key to use the chatbot."
            )

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=self._system_instruction(),
                ),
            )
            text = response.text
            if text:
                return text
            return "I'm sorry, I couldn't generate a response. This might be due to safety filters."
        except Exception as e:
            error_msg = str(e)
            print(f"Chatbot Error: {error_msg}")
            if "API_KEY" in error_msg or "401" in error_msg or "403" in error_msg:
                return "Error: Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in the backend .env file."
            if "Safety" in error_msg or "blocked" in error_msg:
                return "I'm sorry, I cannot respond to that query as it was flagged by safety filters."
            return f"I'm sorry, I encountered an error: {error_msg}"


chatbot_service = ChatbotService()
