from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from security.jwt_handler import decode_access_token
from schemas import UserProfile  # Import the schema
import logging

router = APIRouter(prefix="/users", tags=["Users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserProfile:
    """Decodes JWT and extracts only the username"""
    payload = decode_access_token(token)
    
    if not payload:
        logging.warning("Invalid or expired token detected.")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")  # Extract only username

    if not username:
        logging.error(f"Token payload missing required fields: {payload}")
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return UserProfile(username=username)  # Return only username

@router.get("/profile", response_model=UserProfile)
def get_profile(user: UserProfile = Depends(get_current_user)):
    return user
