from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.auth.auth_utils import hash_password, verify_password, create_access_token
from backend.app.services.audit_service import log_action
from fastapi import Request

router = APIRouter()


class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    hashed = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed,
        role="admin"  # make yourself admin for testing
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print("---- LOGIN ATTEMPT ----")
    print("Username received:", form_data.username)
    print("Password received:", form_data.password)

    db_user = db.query(User).filter(User.username == form_data.username).first()

    print("DB user found:", db_user)

    if db_user:
        print("Stored hash:", db_user.hashed_password)
        print("Password match:", verify_password(form_data.password, db_user.hashed_password))

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🟢 LOGIN SUCCESS
    log_action(
        db=db,
        user_id=db_user.id,
        action="LOGIN_SUCCESS",
        ip=request.client.host,
        status="SUCCESS"
    )

    token = create_access_token({
        "sub": str(db_user.id),
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }