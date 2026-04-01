from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models.audit_log import AuditLog

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total = db.query(AuditLog).count()
    success = db.query(AuditLog).filter(AuditLog.status == "SUCCESS").count()
    failed = db.query(AuditLog).filter(AuditLog.status == "FAILED").count()

    return {
        "total_requests": total,
        "successful_logins": success,
        "failed_logins": failed
    }

@router.get("/top-ips")
def top_ips(db: Session = Depends(get_db)):
    ips = (
        db.query(AuditLog.ip_address, func.count(AuditLog.id).label("count"))
        .group_by(AuditLog.ip_address)
        .order_by(func.count(AuditLog.id).desc())
        .limit(5)
        .all()
    )

    return [{"ip": ip, "count": count} for ip, count in ips]

@router.get("/recent-events")
def recent_events(db: Session = Depends(get_db)):
    events = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(10)
        .all()
    )

    return events