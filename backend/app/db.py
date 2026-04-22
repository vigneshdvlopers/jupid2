import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://jupid_user:Fj2T0aYUq3Jh3L8s1RxoW8ayLS0SbTSt@dpg-d7iu2oflk1mc73a55o60-a/jupid")

# Robust fix for SQLAlchemy 2.0+ async dialects
if DATABASE_URL:
    original_url = DATABASE_URL
    if DATABASE_URL.startswith("postgresq+asyncpg://"):
        DATABASE_URL = DATABASE_URL.replace("postgresq+asyncpg://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgres+asyncpg://"):
        DATABASE_URL = DATABASE_URL.replace("postgres+asyncpg://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Mask password for logging
    try:
        masked_url = DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL
        print(f"DB DEBUG: Using URL host: {masked_url}")
    except:
        pass

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
