from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from backend.app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String)
    ip_address = Column(String)
    status = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())