from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db
from app.models import User, Report, UserCompetitor
from app.routers.auth import get_current_user
from app.services.reporter import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("")
async def list_reports(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Report).where(Report.user_id == current_user.id).order_by(Report.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{id}")
async def get_report(id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Report).where(Report.id == id, Report.user_id == current_user.id)
    result = await db.execute(stmt)
    r = result.scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Report not found")
    return r

@router.post("/generate/{competitor_id}")
async def trigger_report(competitor_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(UserCompetitor).where(UserCompetitor.user_id == current_user.id, UserCompetitor.master_competitor_id == competitor_id)
    result = await db.execute(stmt)
    uc = result.scalar_one_or_none()
    if not uc:
        raise HTTPException(403, "Competitor not assigned to user")
    
    report = await generate_report(current_user.id, competitor_id, db)
    return report
