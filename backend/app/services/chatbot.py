import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

# Explicitly load .env from the root of the backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatbotService:
    def _system_instruction(self) -> str:
        today = datetime.now().strftime("%A, %d %B %Y")
        return (
            f"You are Jupid AI, a helpful assistant specializing in competitor intelligence "
            f"and business analytics. Today's date is {today}. Always use this date when "
            f"answering questions about the current date or time. Help the user with their "
            f"queries about competitor intelligence, market analysis, and business strategy."
        )

    async def get_response(self, message: str) -> str:
        if not os.getenv("GEMINI_API_KEY"):
            return (
                "Error: GEMINI_API_KEY is not set in the backend .env file. "
                "Please add your Gemini API key to use the chatbot."
            )

        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                system_instruction=self._system_instruction()
            )
            # Use the async version of generate_content
            response = await model.generate_content_async(message)
            
            # Check if the response was blocked
            if response.candidates and response.candidates[0].finish_reason == 3: # SAFETY
                return "I'm sorry, I cannot respond to that query as it was flagged by safety filters."

            try:
                text = response.text
                if text:
                    return text
            except Exception:
                # If .text fails, try to get parts manually
                try:
                    return response.candidates[0].content.parts[0].text
                except Exception:
                    pass

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
