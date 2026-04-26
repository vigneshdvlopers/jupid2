from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import ChatSession
from app.schemas import ChatRequest, ChatResponse
from app.services import gemini_service
import uuid

router = APIRouter(prefix="/chat", tags=["AI Chat"])


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Chat with Jupid AI's Gemini-powered intelligence core.
    Maintains conversation history per session_id.
    """
    try:
        # Fetch or create session
        result = await db.execute(
            select(ChatSession).where(ChatSession.session_id == request.session_id)
        )
        session = result.scalar_one_or_none()

        if not session:
            session = ChatSession(
                session_id=request.session_id,
                messages=[],
                context_domain=request.context_domain,
            )
            db.add(session)

        # Append new user message
        messages = list(session.messages or [])
        messages.append({"role": "user", "content": request.message})

        # Get Gemini reply
        reply = await gemini_service.chat_with_gemini(
            messages=messages,
            context=request.context_domain or "",
        )

        # Append assistant reply
        messages.append({"role": "model", "content": reply})
        session.messages = messages

        await db.commit()
        await db.refresh(session)

        return ChatResponse(
            session_id=request.session_id,
            reply=reply,
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{session_id}")
async def clear_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(ChatSession.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if session:
        await db.delete(session)
        await db.commit()
    return {"message": "Session cleared", "session_id": session_id}


@router.get("/health")
async def chat_health():
    return {"status": "ok", "module": "chat"}
