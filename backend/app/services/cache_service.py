from sqlalchemy import select
from app.core.db import AsyncSessionLocal
from app.models.database import AnalysisRecord
from typing import Any, Optional

class CacheService:
    @staticmethod
    async def get(key: str) -> Optional[Any]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(AnalysisRecord).where(AnalysisRecord.company_name == key.lower())
            )
            record = result.scalar_one_or_none()
            return record.result_data if record else None

    @staticmethod
    async def set(key: str, value: Any):
        async with AsyncSessionLocal() as session:
            # Check if exists to potentially update instead of insert
            result = await session.execute(
                select(AnalysisRecord).where(AnalysisRecord.company_name == key.lower())
            )
            record = result.scalar_one_or_none()
            
            if record:
                record.result_data = value
            else:
                new_record = AnalysisRecord(
                    company_name=key.lower(),
                    result_data=value
                )
                session.add(new_record)
            
            await session.commit()
