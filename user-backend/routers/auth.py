from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from security.hashing import hash_password, verify_password
from security.jwt_handler import create_access_token
from schemas import UserCreate, UserLogin, Token
from database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from security.hashing import hash_password, verify_password
from security.jwt_handler import create_access_token
from schemas import UserCreate, UserLogin, Token
from database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}
