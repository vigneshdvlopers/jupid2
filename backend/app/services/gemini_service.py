import json
import google.generativeai as genai
from app.config import settings
from app.schemas import GeminiInsight

genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL = "gemini-1.5-pro"


SYSTEM_INSTRUCTION = """
You are Jupid AI's intelligence core — a senior business analyst and strategic advisor.
Your role is to convert structured business data into strategic clarity.
Always respond with structured, evidence-based insights.
Never fabricate metrics or make unsupported claims.
Prioritize: Revenue impact → Conversion improvement → Customer retention → Traffic growth → Operational efficiency.
"""

INSIGHT_SCHEMA_PROMPT = """
Respond ONLY with a valid JSON object matching this exact schema:
{
  "executive_summary": "string",
  "key_insights": ["string", ...],
  "critical_issues": ["string", ...],
  "opportunities": ["string", ...],
  "recommended_actions": ["string", ...],
  "confidence_level": "High" | "Medium" | "Low"
}
"""


def _build_model(system_instruction: str = SYSTEM_INSTRUCTION):
    return genai.GenerativeModel(
        model_name=MODEL,
        system_instruction=system_instruction,
    )


async def analyze_seo(domain: str, data: dict) -> GeminiInsight:
    prompt = f"""
Perform an SEO analysis for domain: {domain}

Input data:
{json.dumps(data, indent=2)}

{INSIGHT_SCHEMA_PROMPT}
"""
    return await _run_insight(prompt)


async def analyze_marketing(domain: str, data: dict) -> GeminiInsight:
    prompt = f"""
Perform a marketing campaign analysis for domain: {domain}

Input data:
{json.dumps(data, indent=2)}

{INSIGHT_SCHEMA_PROMPT}
"""
    return await _run_insight(prompt)


async def analyze_sales(domain: str, data: dict) -> GeminiInsight:
    prompt = f"""
Perform a sales performance analysis for domain: {domain}

Input data:
{json.dumps(data, indent=2)}

{INSIGHT_SCHEMA_PROMPT}
"""
    return await _run_insight(prompt)


async def chat_with_gemini(messages: list, context: str = "") -> str:
    model = _build_model()
    history = [
        {"role": m["role"], "parts": [m["content"]]}
        for m in messages[:-1]
    ]
    chat = model.start_chat(history=history)
    last_message = messages[-1]["content"]
    if context:
        last_message = f"[Context: {context}]\n\n{last_message}"
    response = chat.send_message(last_message)
    return response.text


async def _run_insight(prompt: str) -> GeminiInsight:
    model = _build_model()
    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    parsed = json.loads(raw)
    return GeminiInsight(**parsed)
