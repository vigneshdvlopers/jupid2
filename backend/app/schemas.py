from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime


# ─── Base ────────────────────────────────────────────────────────────────────

class AnalysisRequest(BaseModel):
    domain: str
    report_type: str  # seo | marketing | sales
    data: Optional[Dict[str, Any]] = None


class GeminiInsight(BaseModel):
    executive_summary: str
    key_insights: List[str]
    critical_issues: List[str]
    opportunities: List[str]
    recommended_actions: List[str]
    confidence_level: str  # High | Medium | Low


# ─── SEO ─────────────────────────────────────────────────────────────────────

class SEOAnalysisRequest(BaseModel):
    domain: str
    keywords: Optional[List[str]] = None
    competitor_domains: Optional[List[str]] = None


class SEOMetricSchema(BaseModel):
    keyword: str
    ranking_position: Optional[int] = None
    search_volume: Optional[int] = None
    ctr: Optional[float] = None
    impressions: Optional[int] = None
    clicks: Optional[int] = None


class SEOAnalysisResponse(BaseModel):
    domain: str
    metrics: List[SEOMetricSchema]
    insight: GeminiInsight


# ─── Marketing ───────────────────────────────────────────────────────────────

class MarketingAnalysisRequest(BaseModel):
    domain: str
    campaigns: Optional[List[Dict[str, Any]]] = None


class MarketingMetricSchema(BaseModel):
    campaign_name: Optional[str] = None
    channel: Optional[str] = None
    spend: Optional[float] = None
    roas: Optional[float] = None
    cac: Optional[float] = None
    conversions: Optional[int] = None
    conversion_rate: Optional[float] = None


class MarketingAnalysisResponse(BaseModel):
    domain: str
    metrics: List[MarketingMetricSchema]
    insight: GeminiInsight


# ─── Sales ───────────────────────────────────────────────────────────────────

class SalesAnalysisRequest(BaseModel):
    domain: str
    products: Optional[List[Dict[str, Any]]] = None


class SalesMetricSchema(BaseModel):
    product_name: Optional[str] = None
    revenue: Optional[float] = None
    units_sold: Optional[int] = None
    churn_rate: Optional[float] = None
    growth_rate: Optional[float] = None
    avg_order_value: Optional[float] = None


class SalesAnalysisResponse(BaseModel):
    domain: str
    metrics: List[SalesMetricSchema]
    insight: GeminiInsight


# ─── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # user | assistant
    content: str


class ChatRequest(BaseModel):
    session_id: str
    message: str
    context_domain: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    structured_insight: Optional[GeminiInsight] = None
