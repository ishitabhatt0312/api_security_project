from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from backend.app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    from_account = Column(String)
    to_account = Column(String)

    amount = Column(Float)

    status = Column(String)

    ip_address = Column(String)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())