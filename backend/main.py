import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
logger.info(f"MAIN DEBUG: GOOGLE_CLIENT_ID length: {len(os.getenv('GOOGLE_CLIENT_ID', ''))}")
logger.info(f"MAIN DEBUG: DATABASE_URL length: {len(os.getenv('DATABASE_URL', ''))}")
logger.info(f"MAIN DEBUG: All Env Keys: {list(os.environ.keys())}")

from app.routers import auth, competitors, messages, clients, notifications, reports, chat
from app.services.scheduler import setup_scheduler
from starlette.middleware.sessions import SessionMiddleware

from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app = FastAPI(title="Jupid AI Backend")

# Add ProxyHeadersMiddleware to handle HTTPS correctly behind Render proxy
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

from fastapi.responses import Response

@app.middleware("http")
async def custom_cors_middleware(request: Request, call_next):
    origin = request.headers.get("Origin")
    
    # Handle preflight OPTIONS requests
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = origin or "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Middleware caught error: {str(e)}")
        # If it crashes completely, return a basic response with CORS headers
        response = Response(content=f"Internal Server Error: {str(e)}", status_code=500)

    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

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
