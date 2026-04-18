from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db
from app.models import User, ApiKey
from app.routers.auth import get_current_user
from pydantic import BaseModel
from cryptography.fernet import Fernet
import os

router = APIRouter(prefix="/clients", tags=["clients"])

SECRET_KEY = os.getenv("SECRET_KEY", "s3cr3tk3y").ljust(32, 'a')[:32]
import base64
fernet_key = base64.urlsafe_b64encode(SECRET_KEY.encode())
f = Fernet(fernet_key)

class ApiKeyCreate(BaseModel):
    service_name: str
    key_value: str

@router.post("/api-keys")
async def save_api_key(key: ApiKeyCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    encrypted = f.encrypt(key.key_value.encode()).decode()
    stmt = select(ApiKey).where(ApiKey.user_id == current_user.id, ApiKey.service_name == key.service_name)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()
    
    if existing:
        existing.encrypted_key = encrypted
    else:
        new_key = ApiKey(user_id=current_user.id, service_name=key.service_name, encrypted_key=encrypted)
        db.add(new_key)
    
    await db.commit()
    return {"message": "API key saved"}

@router.get("/api-keys")
async def get_api_keys(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(ApiKey).where(ApiKey.user_id == current_user.id)
    result = await db.execute(stmt)
    keys = result.scalars().all()
    return [{"id": k.id, "service_name": k.service_name} for k in keys]
