import httpx
from config import config

class LLMService:
    def __init__(self):
        self.api_key = config.GEMMA_API_KEY
        self.model = config.GEMMA_MODEL_NAME
        # Assuming an OpenAI-compatible endpoint for Gemma
        self.endpoint = "https://api.together.xyz/v1/chat/completions" # Example endpoint

    async def analyze_stock(self, symbol: str, price_data: dict, trend_data: dict, indicators: dict):
        """Sends structured data to Gemma for stock analysis."""
        
        prompt = f"""
        Analyze the following stock data for {symbol}:
        
        Live Price Data: {price_data}
        Recent Trend Summary (last 5 days): {list(trend_data.items())[:5]}
        Technical Indicators: {indicators}
        
        Task: Provide a professional stock analysis.
        Return your response EXACTLY in this format:
        
        Stock: {symbol}
        Signal: [Buy / Sell / Hold]
        Reason:
        - [Point 1]
        - [Point 2]
        Risk:
        - [Short risk note]
        Summary:
        - [1 line conclusion]
        """

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional financial analyst assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.endpoint, headers=headers, json=payload, timeout=30.0)
                result = response.json()
                return result['choices'][0]['message']['content']
        except Exception as e:
            return f"Error in LLM analysis: {str(e)}"
