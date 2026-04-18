from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db
from app.models import User, UserCompetitor, MasterCompetitor
from app.routers.auth import get_current_user

router = APIRouter(prefix="/competitors", tags=["competitors"])

@router.get("/my")
async def get_my_competitors(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MasterCompetitor).join(UserCompetitor).where(UserCompetitor.user_id == current_user.id)
    result = await db.execute(stmt)
    competitors = result.scalars().all()
    return competitors
