from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routes import company
from app.core.config import settings
from app.core.db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Fully automated AI-powered Competitor Analysis Backend with PostgreSQL Persistence",
    lifespan=lifespan
)

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}

app.include_router(company.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
