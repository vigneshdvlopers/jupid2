from sqlalchemy import String, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    result_data: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
