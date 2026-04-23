import httpx
from bs4 import BeautifulSoup
from app.core.config import settings
from typing import List, Dict, Any

class FetchService:
    @staticmethod
    async def get_website_data(url: str) -> Dict[str, str]:
        """Fetch title and meta description using httpx and BeautifulSoup."""
        if not url:
            return {"title": "Unknown", "description": "No URL provided"}
            
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            try:
                response = await client.get(url)
                soup = BeautifulSoup(response.text, "html.parser")
                
                title = soup.title.string if soup.title else "No title"
                description = ""
                meta_desc = soup.find("meta", attrs={"name": "description"})
                if meta_desc:
                    description = meta_desc.get("content", "")
                
                return {
                    "title": title.strip() if title else "No title",
                    "description": description.strip()
                }
            except Exception as e:
                return {"title": "Error fetching", "description": str(e)}

    @staticmethod
    async def get_news(query: str) -> List[str]:
        """Fetch news from GNews."""
        if not settings.GNEWS_API_KEY:
            return []
            
        params = {
            "q": query,
            "token": settings.GNEWS_API_KEY,
            "lang": "en",
            "max": 5
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("https://gnews.io/api/v4/search", params=params)
                data = response.json()
                return [a.get("title") for a in data.get("articles", [])]
            except Exception:
                return []
