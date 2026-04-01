from backend.app.services.rate_detector import check_rate_abuse
from backend.app.database import SessionLocal
from backend.app.models import APILog

import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time

        # Extract request details
        ip_address = request.client.host
        endpoint = request.url.path
        method = request.method
        status_code = response.status_code
        user_agent = request.headers.get("user-agent")

        # Save to database
        db: Session = SessionLocal()
        log = APILog(
            ip_address=ip_address,
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            response_time=process_time,
            user_agent=user_agent,
        )
        db.add(log)
        db.commit()

        check_rate_abuse(db, ip_address)

        db.close()

        return response