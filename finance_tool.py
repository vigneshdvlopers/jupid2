import httpx
from config import config

class FinanceTool:
    def __init__(self):
        self.api_key = config.ALPHA_VANTAGE_API_KEY
        self.base_url = config.ALPHA_VANTAGE_BASE_URL

    async def get_stock_price(self, symbol: str):
        """Fetches live stock price data."""
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": self.api_key
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            data = response.json()
            return data.get("Global Quote", {})

    async def get_stock_trend(self, symbol: str):
        """Fetches daily trend data."""
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": self.api_key
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            data = response.json()
            return data.get("Time Series (Daily)", {})

    async def get_technical_indicators(self, symbol: str):
        """Fetches RSI and MACD data."""
        indicators = {}
        
        # RSI
        rsi_params = {
            "function": "RSI",
            "symbol": symbol,
            "interval": "daily",
            "time_period": "14",
            "series_type": "close",
            "apikey": self.api_key
        }
        
        # MACD
        macd_params = {
            "function": "MACD",
            "symbol": symbol,
            "interval": "daily",
            "series_type": "close",
            "apikey": self.api_key
        }

        async with httpx.AsyncClient() as client:
            rsi_resp = await client.get(self.base_url, params=rsi_params)
            macd_resp = await client.get(self.base_url, params=macd_params)
            
            indicators['RSI'] = rsi_resp.json().get("Technical Analysis: RSI", {})
            indicators['MACD'] = macd_resp.json().get("Technical Analysis: MACD", {})
            
        return indicators
