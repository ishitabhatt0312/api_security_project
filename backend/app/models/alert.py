from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.security_log import SecurityLog

router = APIRouter(prefix="/security", tags=["Security"])


# =========================
# 🔴 ALERTS API
# =========================
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    logs = db.query(SecurityLog)\
        .filter(SecurityLog.endpoint.like("/api/%"))\
        .filter(SecurityLog.risk_score >= 40)\
        .order_by(SecurityLog.timestamp.desc())\
        .limit(50)\
        .all()
    
    return logs


# =========================
# 📊 STATS API
# =========================
@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    fintech_logs = db.query(SecurityLog)\
        .filter(SecurityLog.endpoint.like("/api/%"))

    total = fintech_logs.count()
    failed = fintech_logs.filter(SecurityLog.status_code >= 400).count()

    high = fintech_logs.filter(SecurityLog.alert_level == "HIGH").count()
    medium = fintech_logs.filter(SecurityLog.alert_level == "MEDIUM").count()
    low = fintech_logs.filter(SecurityLog.alert_level == "LOW").count()

    return {
        "total_requests": total,
        "failed_requests": failed,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }

