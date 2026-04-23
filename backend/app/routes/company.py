import asyncio
from fastapi import APIRouter, HTTPException
from app.models.schemas import CompanyRequest, AnalysisResponse, ChatRequest, ChatResponse
from app.services.cache_service import CacheService
from app.services.discovery_service import DiscoveryService
from app.services.fetch_service import FetchService
from app.services.ai_service import AIService

router = APIRouter(prefix="/company", tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_company(request: CompanyRequest):
    company_name = request.company.strip()
    
    # 1. Check Cache
    cached_result = await CacheService.get(company_name)
    if cached_result:
        return AnalysisResponse(**cached_result)

    # 2. Discover Competitors
    competitors = await DiscoveryService.find_competitors(company_name)
    
    # 3. Fetch Data
    main_news_task = FetchService.get_news(company_name)
    all_data = {
        "target_company": {
            "name": company_name,
            "news": await main_news_task
        },
        "competitors": []
    }

    async def fetch_comp_data(comp):
        web_data = await FetchService.get_website_data(comp.get("url"))
        news = await FetchService.get_news(comp.get("name"))
        return {
            "name": comp.get("name"),
            "url": comp.get("url"),
            "web_data": web_data,
            "news": news
        }

    tasks = [fetch_comp_data(c) for c in competitors]
    all_data["competitors"] = await asyncio.gather(*tasks)

    # 4. Generate Analysis
    try:
        analysis = await AIService.generate_analysis(all_data)
        await CacheService.set(company_name, analysis.dict())
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_analysis(request: ChatRequest):
    cached_result = await CacheService.get(request.company)
    if not cached_result:
        raise HTTPException(status_code=400, detail="No active analysis found. Please analyze first.")
    
    response_text = await AIService.chat(request.company, request.message, cached_result)
    return ChatResponse(response=response_text)
