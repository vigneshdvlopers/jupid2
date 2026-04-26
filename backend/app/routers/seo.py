from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import SEOAnalysisRequest, SEOAnalysisResponse, SEOMetricSchema
from app.services import gemini_service

router = APIRouter(prefix="/seo", tags=["SEO Analysis"])


@router.post("/analyze", response_model=SEOAnalysisResponse)
async def analyze_seo(
    request: SEOAnalysisRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze SEO metrics for a given domain using Gemini AI.
    Provide keywords and optional competitor domains for deeper analysis.
    """
    try:
        data = {
            "domain": request.domain,
            "keywords": request.keywords or [],
            "competitor_domains": request.competitor_domains or [],
        }

        insight = await gemini_service.analyze_seo(request.domain, data)

        # Build placeholder metrics from keywords
        metrics = [
            SEOMetricSchema(keyword=kw)
            for kw in (request.keywords or [])
        ]

        return SEOAnalysisResponse(
            domain=request.domain,
            metrics=metrics,
            insight=insight,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def seo_health():
    return {"status": "ok", "module": "seo"}
