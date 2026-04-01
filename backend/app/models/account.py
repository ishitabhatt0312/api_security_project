from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.app.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    account_number = Column(String, unique=True, index=True)

    balance = Column(Float, default=10000)

    created_at = Column(DateTime(timezone=True), server_default=func.now())