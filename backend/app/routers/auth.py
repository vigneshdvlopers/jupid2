import os
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from app.db import get_db
from app.models import User, NotificationSetting
from jose import jwt
from datetime import datetime, timedelta

from dotenv import load_dotenv
import os

# Explicitly load .env from the root of the backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
SECRET_KEY = os.getenv("SECRET_KEY", "s3cr3tk3y")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

print(f"DEBUG: GOOGLE_CLIENT_ID: '{GOOGLE_CLIENT_ID}'")
print(f"DEBUG: GOOGLE_CLIENT_SECRET: '{GOOGLE_CLIENT_SECRET[:5]}...'")
print(f"STARTUP REDIRECT URI: '{os.getenv('GOOGLE_REDIRECT_URI')}'")

config = Config(environ=os.environ)
oauth = OAuth(config)
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        # BYPASS AUTH: Get the first user for demo purposes
        stmt = select(User)
        result = await db.execute(stmt)
        user = result.scalars().first()
        if user:
            return user
        raise HTTPException(status_code=401, detail="Unauthorized: No users in database")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        stmt = select(User).where(User.id == int(user_id))
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required")
    return current_user

@router.get("/google")
async def login_google(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    print(f"DEBUG: Using Client ID: {GOOGLE_CLIENT_ID[:10]}...")
    print(f"REDIRECT URI: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def auth_google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        print(f"DEBUG: Request state: {request.query_params.get('state')}")
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Missing user info")
    except Exception as e:
        print(f"OAUTH ERROR: {str(e)}")
        # If it's a state mismatch, it might be due to session issues
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

    email = user_info.get("email")
    name = user_info.get("name")
    google_id = user_info.get("sub")

    try:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(email=email, name=name, google_id=google_id, hashed_password=None)
            db.add(user)
            await db.flush()
            
            notif_settings = NotificationSetting(user_id=user.id)
            db.add(notif_settings)
            await db.commit()
        else:
            if not user.google_id:
                user.google_id = google_id
                await db.commit()

        jwt_token = create_access_token(data={"sub": str(user.id)})
        
        # Redirect to frontend with token
        frontend_url = os.getenv("FRONTEND_URL")
        return RedirectResponse(url=f"{frontend_url}/dashboard?token={jwt_token}")
    except Exception as e:
        print(f"DB ERROR DURING AUTH: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error during authentication")

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "plan": current_user.plan,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
