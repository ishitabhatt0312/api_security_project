from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from backend.app.database import Base
from sqlalchemy import Boolean

class SecurityLog(Base):
    __tablename__ = "security_logs"

    id = Column(Integer, primary_key=True, index=True)
    endpoint = Column(String)
    method = Column(String)
    ip_address = Column(String)
    status_code = Column(Integer)
    response_time = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    risk_score = Column(Float, default=0)
    is_anomaly = Column(Boolean, default=False)
    alert_level = Column(String, default="LOW")

    threat_type = Column(String, default="NONE")
    attack_flag = Column(Boolean, default=False)