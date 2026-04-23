import json
import google.generativeai as genai
from app.core.config import settings
from app.models.schemas import AnalysisResponse
from typing import Dict, Any

class AIService:
    @staticmethod
    async def generate_analysis(data: Dict[str, Any]) -> AnalysisResponse:
        """Generate analysis using Google Gemini based on dynamic API data."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY missing.")

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        Analyze the following SaaS business data and provide a strategic competitor analysis.
        
        DATA:
        {json.dumps(data, indent=2)}
        
        STRICT OUTPUT FORMAT:
        Return ONLY a JSON object. No markdown, no extra text.
        {{
          "company": "Main Company Name",
          "competitors": ["List of competitors"],
          "positioning": "Strategic positioning summary",
          "strengths": ["List of strengths"],
          "weaknesses": ["List of weaknesses"],
          "comparison": "Market comparison",
          "opportunities": ["Growth opportunities"],
          "threats": ["Market threats"],
          "strategy": "Actionable recommendation"
        }}
        """

        try:
            response = model.generate_content(prompt)
            content = response.text.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            return AnalysisResponse(**json.loads(content))
    @staticmethod
    async def chat(company: str, message: str, context: dict) -> str:
        """Chat with the AI about the generated analysis."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY missing.")

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        You are a business assistant. You recently performed a competitor analysis for {company}.
        Here is the context of that analysis: {json.dumps(context)}
        
        The user has a follow-up question: "{message}"
        
        Provide a helpful, analytical, and concise response. No markdown.
        """

        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"
