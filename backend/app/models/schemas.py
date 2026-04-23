from pydantic import BaseModel
from typing import List, Optional

class CompanyRequest(BaseModel):
    company: str

class ChatRequest(BaseModel):
    company: str
    message: str

class ChatResponse(BaseModel):
    response: str

class AnalysisResponse(BaseModel):
    company: str
    competitors: List[str]
    positioning: str
    strengths: List[str]
    weaknesses: List[str]
    comparison: str
    opportunities: List[str]
    threats: List[str]
    strategy: str
