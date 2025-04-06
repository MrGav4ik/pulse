from pydantic import BaseModel

class createChat(BaseModel):
    receiver_id: int
    sender_id: int

class createMessage(BaseModel):
    chat_id: int
    sender_id: int
    receiver_id: int
    content: str

class getChat(BaseModel):
    user_id: int
    chat_id: int
    user_name: str
    message: str

class getMessage(BaseModel):
    sender_id: int
    receiver_id: int
    message_content: str
    message_timestamp: str