from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import MarketingAnalysisRequest, MarketingAnalysisResponse, MarketingMetricSchema
from app.services import gemini_service

router = APIRouter(prefix="/marketing", tags=["Marketing Analysis"])


@router.post("/analyze", response_model=MarketingAnalysisResponse)
async def analyze_marketing(
    request: MarketingAnalysisRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze marketing campaign effectiveness for a given domain using Gemini AI.
    Provide campaign data including spend, ROAS, CAC, and conversion metrics.
    """
    try:
        data = {
            "domain": request.domain,
            "campaigns": request.campaigns or [],
        }

        insight = await gemini_service.analyze_marketing(request.domain, data)

        metrics = [
            MarketingMetricSchema(**campaign)
            for campaign in (request.campaigns or [])
        ]

        return MarketingAnalysisResponse(
            domain=request.domain,
            metrics=metrics,
            insight=insight,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def marketing_health():
    return {"status": "ok", "module": "marketing"}
