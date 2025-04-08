from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CreateChat(BaseModel):
    name: Optional[str] = None
    is_group: bool = False

class CreateMessage(BaseModel):
    chat_id: int
    sender_id: int
    content: str
    message_type: str = "text"
    reply_to_id: Optional[int] = None

class AddMember(BaseModel):
    chat_id: int
    user_id: int

class GetChat(BaseModel):
    user_id: int
    chat_id: int
    name: Optional[str] = None
    last_message: Optional[str] = None
    created_at: datetime

class GetMessage(BaseModel):
    message_id: int
    chat_id: int
    sender_id: int
    content: str
    reply_to_id: Optional[int] = None
    sent_at: datetime