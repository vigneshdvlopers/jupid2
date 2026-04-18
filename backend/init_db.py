import asyncio
import os
import sys

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import engine, Base
from app.models import User, MasterCompetitor, UserCompetitor, ApiKey, Report, NewsCache, StockCache, Notification, NotificationSetting, Message, ChatSession, ChatHistory

async def init_db():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables initialized successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
