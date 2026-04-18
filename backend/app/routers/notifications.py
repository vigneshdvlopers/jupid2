from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db
from app.models import User, Notification, NotificationSetting
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["notifications"])

class NotifSettingsUpdate(BaseModel):
    stock_alerts: bool
    news_alerts: bool
    sales_alerts: bool
    company_alerts: bool
    stock_threshold: float
    sales_threshold: float

@router.get("")
async def get_notifications(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/unread")
async def get_unread_notifications(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False).order_by(Notification.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/{id}/read")
async def mark_read(id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.id == id, Notification.user_id == current_user.id)
    result = await db.execute(stmt)
    n = result.scalar_one_or_none()
    if n:
        n.is_read = True
        await db.commit()
    return {"message": "Marked read"}

@router.post("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False)
    result = await db.execute(stmt)
    for n in result.scalars().all():
        n.is_read = True
    await db.commit()
    return {"message": "All marked read"}

@router.get("/settings")
async def get_settings(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(NotificationSetting).where(NotificationSetting.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

@router.put("/settings")
async def update_settings(settings: NotifSettingsUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(NotificationSetting).where(NotificationSetting.user_id == current_user.id)
    result = await db.execute(stmt)
    s = result.scalar_one_or_none()
    if s:
        for k, v in settings.dict().items():
            setattr(s, k, v)
        await db.commit()
    return s
