from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import SalesAnalysisRequest, SalesAnalysisResponse, SalesMetricSchema
from app.services import gemini_service

router = APIRouter(prefix="/sales", tags=["Sales Analysis"])


@router.post("/analyze", response_model=SalesAnalysisResponse)
async def analyze_sales(
    request: SalesAnalysisRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze sales performance for a given domain using Gemini AI.
    Provide product data including revenue, units sold, churn rate, and growth rate.
    """
    try:
        data = {
            "domain": request.domain,
            "products": request.products or [],
        }

        insight = await gemini_service.analyze_sales(request.domain, data)

        metrics = [
            SalesMetricSchema(**product)
            for product in (request.products or [])
        ]

        return SalesAnalysisResponse(
            domain=request.domain,
            metrics=metrics,
            insight=insight,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def sales_health():
    return {"status": "ok", "module": "sales"}
