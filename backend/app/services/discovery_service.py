import httpx
from app.core.config import settings
from typing import List, Dict

class DiscoveryService:
    @staticmethod
    async def find_competitors(company_name: str) -> List[Dict[str, str]]:
        """Find top 5-10 competitors using SerpAPI."""
        if not settings.SERPAPI_KEY:
            return []

        params = {
            "q": f"top competitors of {company_name} SaaS",
            "api_key": settings.SERPAPI_KEY,
            "engine": "google"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("https://serpapi.com/search", params=params)
                results = response.json()
                
                competitors = []
                # Extract names and links from organic results
                for result in results.get("organic_results", [])[:8]:
                    name = result.get("title").split(" vs ")[0].split("|")[0].strip()
                    link = result.get("link")
                    if name.lower() != company_name.lower():
                        competitors.append({"name": name, "url": link})
                
                return competitors
            except Exception as e:
                print(f"Discovery Error: {e}")
                return []
