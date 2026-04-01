from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.models import APILog, Alert


THRESHOLD = 10
WINDOW_SECONDS = 30


def calculate_severity(request_count: int) -> str:
    if request_count >= 50:
        return "Critical"
    elif request_count >= 20:
        return "High"
    else:
        return "Medium"


def check_rate_abuse(db: Session, ip_address: str):

    time_window = datetime.utcnow() - timedelta(seconds=WINDOW_SECONDS)

    request_count = (
        db.query(APILog)
        .filter(
            APILog.ip_address == ip_address,
            APILog.timestamp >= time_window
        )
        .count()
    )

    if request_count >= THRESHOLD:

        # Check if open alert already exists
        existing_alert = (
            db.query(Alert)
            .filter(
                Alert.ip_address == ip_address,
                Alert.alert_type == "Rate Abuse",
                Alert.status == "Open"
            )
            .first()
        )

        if existing_alert:
            return  # Do not create duplicate

        severity = calculate_severity(request_count)

        new_alert = Alert(
            ip_address=ip_address,
            alert_type="Rate Abuse",
            severity=severity,
            message=f"{request_count} requests in {WINDOW_SECONDS} seconds",
            status="Open"
        )

        db.add(new_alert)
        db.commit()

        print(f"🚨 ALERT TRIGGERED: {ip_address} - {severity}")