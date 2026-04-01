from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.account import Account
from backend.app.models.transaction import Transaction
from backend.app.models import transaction

router = APIRouter(prefix="/banking", tags=["Banking"])

@router.get("/balance/{account_number}")
def get_balance(account_number: str, db: Session = Depends(get_db)):

    account = db.query(Account).filter(
        Account.account_number == account_number
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return {
        "account_number": account.account_number,
        "balance": account.balance
    }

@router.post("/transfer")
def transfer_money(data: dict, request: Request, db: Session = Depends(get_db)):

    sender = db.query(Account).filter(
        Account.account_number == data["from_account"]
    ).first()

    receiver = db.query(Account).filter(
        Account.account_number == data["to_account"]
    ).first()

    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="Account not found")

    if sender.balance < data["amount"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    sender.balance -= data["amount"]
    receiver.balance += data["amount"]

    new_tx = transaction.Transaction(

    from_account=sender.account_number,
    to_account=receiver.account_number,
    amount=data["amount"],
    status="SUCCESS",
    ip_address="127.0.0.1"

)
    

    db.add(new_tx)
    db.commit()

    return {"message": "Transfer successful"}