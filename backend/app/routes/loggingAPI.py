from collections import defaultdict
from datetime import datetime, timedelta

# 🔥 GLOBAL MEMORY (must be outside function)
login_attempts = defaultdict(list)
transaction_attempts = defaultdict(list)
request_counts = defaultdict(list)




router = APIRouter(prefix="/security", tags=["Security"])

@router.post("/log")
def log_event(data: dict, db: Session = Depends(get_db)):

    ip = data.get("ip_address") or "unknown"
    endpoint = data.get("endpoint") or ""

    now = datetime.utcnow()

    threat_type = "NONE"
    attack_flag = False

    # =========================
    # 🔴 BRUTE FORCE LOGIN
    # =========================
    if "/login" in endpoint:
        login_attempts[ip].append(now)

        recent = [t for t in login_attempts[ip] if now - t < timedelta(seconds=30)]

        if len(recent) > 5:
            threat_type = "BRUTE_FORCE"
            attack_flag = True

    # =========================
    # 🔴 TRANSACTION ABUSE
    # =========================
    if "/transfer" in endpoint:
        transaction_attempts[ip].append(now)

        recent = [t for t in transaction_attempts[ip] if now - t < timedelta(seconds=20)]

        if len(recent) > 3:
            threat_type = "TRANSACTION_ABUSE"
            attack_flag = True

    # =========================
    # 🔴 DDOS
    # =========================
    request_counts[ip].append(now)

    recent = [t for t in request_counts[ip] if now - t < timedelta(seconds=10)]

    if len(recent) > 10:
        threat_type = "DDOS"
        attack_flag = True

    # =========================
    # SAVE LOG
    # =========================
    log = SecurityLog(
        endpoint=endpoint,
        method=data.get("method"),
        status_code=data.get("status_code"),
        ip_address=ip,
        response_time=data.get("response_time"),
        timestamp=now,
        risk_score=data.get("risk_score", 30),
        alert_level=data.get("alert_level", "LOW"),
        threat_type=threat_type,
        attack_flag=attack_flag
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return {"message": "Logged"}