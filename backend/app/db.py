import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "postgres+asyncpg://jupid_user:Fj2T0aYUq3Jh3L8s1RxoW8ayLS0SbTSt@dpg-d7iu2oflk1mc73a55o60-a/jupid")

# Fix common typo in connection string
if DATABASE_URL and DATABASE_URL.startswith("postgresq"):
    DATABASE_URL = DATABASE_URL.replace("postgresq", "postgresql", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
