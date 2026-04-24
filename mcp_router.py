import re
from finance_tool import FinanceTool
from llm_service import LLMService

class MCPRouter:
    def __init__(self):
        self.finance_tool = FinanceTool()
        self.llm_service = LLMService()

    def _extract_symbol(self, query: str):
        """Extracts stock symbol from query (simple uppercase regex)."""
        match = re.search(r'\b[A-Z]{1,5}\b', query)
        if match:
            return match.group(0)
        # Fallback: look for common names or just assume the first word if it looks like a symbol
        return None

    def _detect_intent(self, query: str):
        """Detects if user wants price, trend, or full analysis."""
        query = query.lower()
        if any(word in query for word in ["buy", "sell", "should i", "analysis", "worth"]):
            return "analysis"
        if any(word in query for word in ["price", "cost", "trading at"]):
            return "price"
        if any(word in query for word in ["trend", "history", "performance"]):
            return "trend"
        return "analysis" # Default to analysis

    async def route_request(self, query: str):
        """Main routing logic."""
        symbol = self._extract_symbol(query)
        if not symbol:
            return "Please provide a valid stock symbol (e.g., TSLA, AAPL)."

        intent = self._detect_intent(query)
        
        # Always fetch basic data for context
        price_data = await self.finance_tool.get_stock_price(symbol)
        
        if intent == "price":
            return f"The current price of {symbol} is ${price_data.get('05. price', 'N/A')}."
        
        # Fetch more data for analysis or trend
        trend_data = await self.finance_tool.get_stock_trend(symbol)
        indicators = await self.finance_tool.get_technical_indicators(symbol)
        
        if intent == "analysis":
            return await self.llm_service.analyze_stock(symbol, price_data, trend_data, indicators)
            
        if intent == "trend":
            return f"Fetched trend data for {symbol}. Last close: ${price_data.get('08. previous close', 'N/A')}."

        return "I'm not sure how to handle that request. Try 'Should I buy AAPL?'"
