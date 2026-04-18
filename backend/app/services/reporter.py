import os
import google.generativeai as genai
from app.models import Report
from datetime import datetime

# Configure GenAI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_report(user_id: int, competitor_id: int, db):
    print(f"Generating report for user_id={user_id}, competitor_id={competitor_id}")
    
    # Simple prompt for the report
    prompt = f"Generate a detailed competitor intelligence report for competitor ID {competitor_id}. Focus on market position, SWOT analysis, and recent news."
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await model.generate_content_async(prompt)
        content = response.text
    except Exception as e:
        print(f"Report Generation Error: {e}")
        content = f"Failed to generate report using AI. Error: {str(e)}"

    report = Report(
        user_id=user_id, 
        master_competitor_id=competitor_id, 
        title=f"AI Intelligence Report - {datetime.now().strftime('%Y-%m-%d')}", 
        content=content,
        report_type="Deep Dive"
    )
    
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report
