from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.audit_log import AuditLog
from backend.app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    return logs