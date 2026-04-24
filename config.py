import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
    GEMMA_API_KEY = os.getenv("GEMMA_API_KEY")
    GEMMA_MODEL_NAME = os.getenv("GEMMA_MODEL_NAME", "gemma-7b")
    ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

config = Config()
