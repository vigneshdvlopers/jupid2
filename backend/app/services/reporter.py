from app.models import Report

async def generate_report(user_id: int, competitor_id: int, db):
    print(f"Generating report for user_id={user_id}, competitor_id={competitor_id}")
    report = Report(user_id=user_id, master_competitor_id=competitor_id, title="Dummy Report", content="Report Content")
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report
