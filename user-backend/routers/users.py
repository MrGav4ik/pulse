from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from security.jwt_handler import decode_access_token
from schemas import UserProfile
from sqlalchemy.orm import Session
from models import User
from database import get_db
import logging

router = APIRouter(prefix="/users", tags=["Users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserProfile:
    """Decodes JWT and extracts only the username"""
    payload = decode_access_token(token)
    
    if not payload:
        logging.warning("Invalid or expired token detected.")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()

    if not username:
        logging.error(f"Token payload missing required fields: {payload}")
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return UserProfile(username=username, id=user.id, name=user.name, email=user.email)

@router.get("/profile", response_model=UserProfile)
def get_profile(user: UserProfile = Depends(get_current_user)):
    return user
