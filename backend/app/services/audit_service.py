from backend.app.models.audit_log import AuditLog

def log_action(db, user_id, action, ip=None, status="SUCCESS"):
    audit = AuditLog(
        user_id=user_id,
        action=action,
        ip_address=ip,
        status=status
    )
    db.add(audit)
    db.commit()