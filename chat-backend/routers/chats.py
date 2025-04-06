# chats.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import createChat, createMessage, getChat, getMessage
from database import get_db
from models import User, Chat, Message
from datetime import datetime


router = APIRouter(prefix="/chat")

@router.post("/new_chat")
def create_chat(chat: createChat, db: Session = Depends(get_db)):
    """Create a new chat with the logged-in user"""
    sender = db.query(User).filter(User.id == chat.sender_id).first()
    
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
    
    receiver = db.query(User).filter_by(id=chat.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    new_chat = Chat(receiver_id=chat.receiver_id, sender_id=chat.sender_id)
    db.add(new_chat)
    db.commit()
    
    return {"message": "New chat created successfully"}

@router.post("/new_message")
def create_message(message: createMessage, db: Session = Depends(get_db)):
    """Create a new message in a chat"""
    chat = db.query(Chat).filter_by(chat_id=message.chat_id).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    new_message = Message(chat_id=message.chat_id, message_content=message.content, message_sender_id=message.sender_id, message_receiver_id=message.receiver_id)
    db.add(new_message)
    db.commit()

    return {"message": "New message created successfully"}

@router.get("/chats")
def get_chats(sender_id: int, db: Session = Depends(get_db)):
    """Fetch all chats for the logged-in user"""

    user = db.query(User).filter(User.id == sender_id).first()

    chat = db.query(Chat).filter(Chat.receiver_id == user.id or sender_id == user.id).first()
    
    if not user:
        print("User not found")
        raise HTTPException(status_code=404, detail="User not found")
    
    chats = []
    if chat:
        for chat in user.sent_chats + user.received_chats:
            if chat:
                last_message = chat.messages[-1].message_content if chat.messages else None
                chats.append(getChat(
                    user_id=user.id,
                    chat_id=chat.chat_id,
                    user_name=user.name,
                    message=last_message
                ))
    
    if not chats:
        print("Chat not found")
        raise HTTPException(status_code=404, detail="No chats found for this user")

    return chats

@router.get("/messages")
def get_messages(chat_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.chat_id == chat_id).all()

    return messages

