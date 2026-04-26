from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routers import seo, marketing, sales, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize DB tables
    await init_db()
    yield
    # Shutdown: nothing special needed


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Jupid AI — Business Intelligence Platform powered by Gemini",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(seo.router,        prefix="/api/v1")
app.include_router(marketing.router,  prefix="/api/v1")
app.include_router(sales.router,      prefix="/api/v1")
app.include_router(chat.router,       prefix="/api/v1")


# ─── Root ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
