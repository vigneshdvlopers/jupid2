import os
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Competitor Analysis API"
    VERSION: str = "v1"
    
    # API Keys
    SERPAPI_KEY: str = os.getenv("SERPAPI_KEY", "")
    GNEWS_API_KEY: str = os.getenv("GNEWS_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    GOOGLE_PLACES_API_KEY: str = os.getenv("GOOGLE_PLACES_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://jupid_user:Fj2T0aYUq3Jh3L8s1RxoW8ayLS0SbTSt@dpg-d7iu2oflk1mc73a55o60-a/jupid")

settings = Settings()
