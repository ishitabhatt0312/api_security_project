from sqlalchemy import func
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.security_log import SecurityLog

router = APIRouter(
    prefix="/security",
    tags=["Security"]
)

# =========================
# 🔴 ALERTS (ONLY FINTECH + RISKY)
# =========================
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    logs = (
        db.query(SecurityLog)
        .filter(SecurityLog.endpoint.like("/api/%"))
        .order_by(SecurityLog.timestamp.desc())
        .limit(100)
        .all()
    )

    return logs


# =========================
# 📊 STATS (ONLY FINTECH DATA)
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

    # 🟣 THROUGHPUT DATA
    last_minute = datetime.utcnow() - timedelta(minutes=1)

    throughput_data = db.query(
        func.to_char(SecurityLog.timestamp, 'HH24:MI:SS'),
        func.count().label("count")
    ).filter(
        SecurityLog.endpoint.like("/api/%"),
        SecurityLog.timestamp >= last_minute
    ).group_by(func.to_char(SecurityLog.timestamp, 'HH24:MI:SS')).all()

    return {
        "total_requests": total,
        "failed_requests": failed,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "throughput": [
            {"time": t, "count": c} for t, c in throughput_data
        ]
    }

@router.post("/log")
def log_event(data: dict, db: Session = Depends(get_db)):
    log = SecurityLog(
        endpoint=data.get("endpoint"),
        method=data.get("method"),
        status_code=data.get("status_code"),
        ip_address=data.get("ip_address"),
        response_time=data.get("response_time"),
        risk_score=data.get("risk_score", 30),
        alert_level=data.get("alert_level", "LOW"),

        # 🚨 ADD THESE TWO (CRITICAL)
        attack_flag=data.get("attack_flag", False),
        threat_type=data.get("threat_type", "NONE")
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return {"message": "Logged"}