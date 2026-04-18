from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True)
    plan = Column(String, default="free")
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_competitors = relationship("UserCompetitor", back_populates="user")
    api_keys = relationship("ApiKey", back_populates="user")
    reports = relationship("Report", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    notification_settings = relationship("NotificationSetting", back_populates="user", uselist=False)
    messages = relationship("Message", back_populates="user")

class MasterCompetitor(Base):
    __tablename__ = "master_competitors"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    domain = Column(String, nullable=True)
    amazon_asin = Column(String, nullable=True)
    stock_ticker = Column(String, nullable=True)
    crunchbase_id = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_competitors = relationship("UserCompetitor", back_populates="master_competitor")
    reports = relationship("Report", back_populates="competitor")

class UserCompetitor(Base):
    __tablename__ = "user_competitors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    master_competitor_id = Column(Integer, ForeignKey("master_competitors.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_competitors")
    master_competitor = relationship("MasterCompetitor", back_populates="user_competitors")

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_name = Column(String, index=True)
    encrypted_key = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="api_keys")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    competitor_id = Column(Integer, ForeignKey("master_competitors.id"))
    content = Column(Text)
    report_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")
    competitor = relationship("MasterCompetitor", back_populates="reports")

class NewsCache(Base):
    __tablename__ = "news_cache"

    id = Column(Integer, primary_key=True, index=True)
    competitor_id = Column(Integer, ForeignKey("master_competitors.id"))
    headline = Column(String)
    source = Column(String)
    fetched_at = Column(DateTime, default=datetime.utcnow)

class StockCache(Base):
    __tablename__ = "stock_cache"

    id = Column(Integer, primary_key=True, index=True)
    competitor_id = Column(Integer, ForeignKey("master_competitors.id"))
    price = Column(Float)
    volume = Column(Integer)
    fetched_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    competitor_id = Column(Integer, ForeignKey("master_competitors.id"), nullable=True)
    notification_type = Column(String)
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class NotificationSetting(Base):
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    stock_alerts = Column(Boolean, default=True)
    news_alerts = Column(Boolean, default=True)
    sales_alerts = Column(Boolean, default=True)
    company_alerts = Column(Boolean, default=True)
    stock_threshold = Column(Float, default=5.0)
    sales_threshold = Column(Float, default=20.0)

    user = relationship("User", back_populates="notification_settings")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="messages")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)        # e.g. "Friday, 18 April 2025"
    created_at = Column(DateTime, default=datetime.utcnow)
    date_key = Column(String, index=True)         # e.g. "2025-04-18" for daily dedup

    user = relationship("User", backref="chat_sessions")
    messages = relationship("ChatHistory", back_populates="session", cascade="all, delete-orphan")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=True)
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="chat_history")
    session = relationship("ChatSession", back_populates="messages")
