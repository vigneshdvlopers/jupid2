from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, date
from app.services.chatbot import chatbot_service
from app.routers.auth import get_current_user
from app.models import User, ChatSession, ChatHistory
from app.db import get_db

router = APIRouter(prefix="/chat", tags=["chat"])


# ---------- Schemas ----------

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: int

class SessionOut(BaseModel):
    id: int
    title: str
    date_key: str
    created_at: datetime
    message_count: int

    class Config:
        from_attributes = True

class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Helpers ----------

async def get_or_create_today_session(user_id: int, db: AsyncSession) -> ChatSession:
    """Return today's session for the user, creating it if it doesn't exist."""
    today_key = date.today().isoformat()          # e.g. "2025-04-18"
    today_label = datetime.now().strftime("%A, %d %B %Y")  # e.g. "Friday, 18 April 2025"

    result = await db.execute(
        select(ChatSession).where(
            and_(ChatSession.user_id == user_id, ChatSession.date_key == today_key)
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        session = ChatSession(
            user_id=user_id,
            title=today_label,
            date_key=today_key,
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)

    return session


# ---------- Endpoints ----------

@router.get("/sessions", response_model=List[SessionOut])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all chat sessions for the current user, newest first."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()

    # Attach message counts
    out = []
    for s in sessions:
        count_result = await db.execute(
            select(ChatHistory).where(ChatHistory.session_id == s.id)
        )
        count = len(count_result.scalars().all())
        out.append(SessionOut(
            id=s.id,
            title=s.title,
            date_key=s.date_key,
            created_at=s.created_at,
            message_count=count,
        ))
    return out


@router.post("/sessions", response_model=SessionOut)
async def create_new_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Manually create a new chat session (New Chat button)."""
    now = datetime.now()
    # Allow multiple sessions on the same day — use timestamp in title
    time_label = now.strftime("%I:%M %p")
    date_label = now.strftime("%A, %d %B %Y")
    title = f"{date_label} · {time_label}"
    date_key = now.strftime("%Y-%m-%d-%H%M%S")  # unique key per manual session

    session = ChatSession(
        user_id=current_user.id,
        title=title,
        date_key=date_key,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return SessionOut(id=session.id, title=session.title, date_key=session.date_key,
                      created_at=session.created_at, message_count=0)


@router.get("/sessions/today", response_model=SessionOut)
async def get_today_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get (or auto-create) today's daily session."""
    session = await get_or_create_today_session(current_user.id, db)
    result = await db.execute(
        select(ChatHistory).where(ChatHistory.session_id == session.id)
    )
    count = len(result.scalars().all())
    return SessionOut(id=session.id, title=session.title, date_key=session.date_key,
                      created_at=session.created_at, message_count=count)


@router.get("/sessions/{session_id}/messages", response_model=List[MessageOut])
async def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all messages for a specific session."""
    # Verify ownership
    result = await db.execute(
        select(ChatSession).where(
            and_(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msg_result = await db.execute(
        select(ChatHistory)
        .where(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.created_at.asc())
    )
    return msg_result.scalars().all()


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send a message. If no session_id, auto-uses today's session."""
    # Resolve session
    if request.session_id:
        result = await db.execute(
            select(ChatSession).where(
                and_(ChatSession.id == request.session_id,
                     ChatSession.user_id == current_user.id)
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = await get_or_create_today_session(current_user.id, db)

    try:
        ai_response = await chatbot_service.get_response(request.message)
    except Exception as e:
        ai_response = f"I'm sorry, I encountered an error while communicating with the AI: {str(e)}"

    # Persist messages
    try:
        db.add(ChatHistory(user_id=current_user.id, session_id=session.id,
                           role="user", content=request.message))
        db.add(ChatHistory(user_id=current_user.id, session_id=session.id,
                           role="assistant", content=ai_response))
        await db.commit()
    except Exception as e:
        print(f"Database Error: {str(e)}")
        # We don't raise here so the user at least gets the AI response
        # even if it's not saved in history.
        pass

    return ChatResponse(response=ai_response, session_id=session.id)
