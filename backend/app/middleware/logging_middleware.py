import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from backend.app.database import SessionLocal
from backend.app.models.security_log import SecurityLog
from backend.app.services.risk_engine import calculate_risk, get_risk_level

class LoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time

        db = SessionLocal()

        log = SecurityLog(
            endpoint=request.url.path,
            method=request.method,
            ip_address=request.client.host,
            status_code=response.status_code,
            response_time=process_time
        )

        
        risk_score = calculate_risk(log)
        log.risk_score = risk_score
        log.alert_level = get_risk_level(risk_score)

        db.add(log)
        db.commit()
        db.close()

        return response