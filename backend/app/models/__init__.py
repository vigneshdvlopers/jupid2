import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Float, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AnalysisReport(Base, TimestampMixin):
    __tablename__ = "analysis_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    domain = Column(String(255), nullable=False, index=True)
    report_type = Column(String(50), nullable=False)  # seo | marketing | sales
    status = Column(String(20), default="pending")    # pending | processing | done | failed
    raw_data = Column(JSON, nullable=True)
    insights = Column(JSON, nullable=True)
    executive_summary = Column(Text, nullable=True)
    confidence_level = Column(String(10), nullable=True)  # High | Medium | Low


class SEOMetric(Base, TimestampMixin):
    __tablename__ = "seo_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("analysis_reports.id"), nullable=False)
    keyword = Column(String(500), nullable=False)
    ranking_position = Column(Integer, nullable=True)
    search_volume = Column(Integer, nullable=True)
    ctr = Column(Float, nullable=True)
    impressions = Column(Integer, nullable=True)
    clicks = Column(Integer, nullable=True)


class MarketingMetric(Base, TimestampMixin):
    __tablename__ = "marketing_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("analysis_reports.id"), nullable=False)
    campaign_name = Column(String(255), nullable=True)
    channel = Column(String(100), nullable=True)
    spend = Column(Float, nullable=True)
    roas = Column(Float, nullable=True)
    cac = Column(Float, nullable=True)
    conversions = Column(Integer, nullable=True)
    conversion_rate = Column(Float, nullable=True)


class SalesMetric(Base, TimestampMixin):
    __tablename__ = "sales_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("analysis_reports.id"), nullable=False)
    product_name = Column(String(255), nullable=True)
    revenue = Column(Float, nullable=True)
    units_sold = Column(Integer, nullable=True)
    churn_rate = Column(Float, nullable=True)
    growth_rate = Column(Float, nullable=True)
    avg_order_value = Column(Float, nullable=True)


class ChatSession(Base, TimestampMixin):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), unique=True, nullable=False)
    messages = Column(JSON, default=list)
    context_domain = Column(String(255), nullable=True)
