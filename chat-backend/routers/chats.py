# chats.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import CreateChat, CreateMessage, GetChat, GetMessage, AddMember
from database import get_db
from models import User, Chat, Message, ChatMember
from datetime import datetime


router = APIRouter(prefix="/chat")

@router.post("/new_chat")
def create_chat(chat: CreateChat, db: Session = Depends(get_db)):
    new_chat = Chat(name=chat.name, is_group=chat.is_group)

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    return {"message": "New chat created successfully", "chat_id": new_chat.id}

@router.post("/new_member")
def add_member(member: AddMember, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter_by(id=member.chat_id)

    if not chat:
        HTTPException(status_code=404, detail="Chat not found")

    existing_member = db.query(ChatMember).filter_by(
        chat_id=member.chat_id, user_id=member.user_id).first()


    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this chat")

    new_member = ChatMember(chat_id=member.chat_id, user_id=member.user_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {"message": "Member added successfully", "member_id": new_member.id}

@router.post("/new_message")
def create_message(message: CreateMessage, db: Session = Depends(get_db)):
    """Create a new message in a chat"""
    chat = db.query(Chat).filter_by(id=message.chat_id).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    new_message = Message(chat_id=message.chat_id, content=message.content, sender_id=message.sender_id,
                          message_type=message.message_type, reply_to_id=message.reply_to_id)
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {"message": "New message created successfully", "message_id": new_message.id}

@router.get("/chats")
def get_chats(user_id: int, db: Session = Depends(get_db)):
    chat_list = []

    chats = (
        db.query(Chat).join(ChatMember, Chat.id == ChatMember.chat_id).filter(ChatMember.user_id == user_id).all()
    )

    for chat in chats:
        user = None
        if not chat.is_group:
            user = (
                db.query(User)
                .join(ChatMember, User.id == ChatMember.user_id)
                .filter(ChatMember.chat_id == chat.id, ChatMember.user_id != user_id)
                .first()
            )

        last_msg = (
            db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.sent_at.desc()).first()
        )

        formatted = GetChat(
            user_id=user.id if user else user_id,
            chat_id=chat.id,
            name=user.name if user else chat.name,
            created_at=chat.created_at,
            last_message=last_msg.content if last_msg else None
        )

        chat_list.append(formatted)

    return chat_list

@router.get("/messages")
def get_messages(chat_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.chat_id == chat_id).all()

    return messages

