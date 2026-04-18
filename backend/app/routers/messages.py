from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db
from app.models import User, Message
from app.routers.auth import get_current_user
from app.services.mailer import send_admin_notification
from pydantic import BaseModel

router = APIRouter(prefix="/messages", tags=["messages"])

class MessageCreate(BaseModel):
    message: str

@router.post("")
async def send_message(msg: MessageCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    db_msg = Message(user_id=current_user.id, message=msg.message)
    db.add(db_msg)
    await db.commit()
    await send_admin_notification(f"Message from {current_user.email}", msg.message)
    return {"message": "Message sent to admin"}

@router.get("/my")
async def get_my_messages(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Message).where(Message.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()
