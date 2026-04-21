import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
logger.info(f"MAIN DEBUG: GOOGLE_CLIENT_ID length: {len(os.getenv('GOOGLE_CLIENT_ID', ''))}")

from app.routers import auth, competitors, messages, clients, notifications, reports, chat
from app.services.scheduler import setup_scheduler
from starlette.middleware.sessions import SessionMiddleware

from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app = FastAPI(title="Jupid AI Backend")

# Add ProxyHeadersMiddleware to handle HTTPS correctly behind Render proxy
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jupid2-mk5oty9m2-shelkevignesh1234-2587s-projects.vercel.app",
        "https://jupid2-mk5oty9m2-shelkevignesh1234-2587s-projects.vercel.app/",
        "http://localhost:3000",
        "http://localhost:3000/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware, 
    secret_key=os.getenv("SECRET_KEY", "s3cr3tk3y"),
    session_cookie="jupid_session",
    same_site="lax",
    https_only=False if "localhost" in os.getenv("GOOGLE_REDIRECT_URI", "") else True
)

app.include_router(auth.router)
app.include_router(competitors.router)
app.include_router(messages.router)
app.include_router(clients.router)
app.include_router(notifications.router)
app.include_router(reports.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"status": "success", "message": "Jupid AI Backend is working successfully 🚀"}

@app.on_event("startup")
async def startup_event():
    setup_scheduler()
