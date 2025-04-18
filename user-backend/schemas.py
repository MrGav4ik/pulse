from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    name: str