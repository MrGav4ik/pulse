from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, func
)
from sqlalchemy.orm import relationship, backref
from database import Base
import enum

# Enum for message status
class MessageStatusEnum(enum.Enum):
    sent = "sent"
    delivered = "delivered"
    read = "read"

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    messages_sent = relationship("Message", back_populates="sender")
    chat_memberships = relationship("ChatMember", back_populates="user")
    message_statuses = relationship("MessageStatus", back_populates="user")

# Chat model
class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    name = Column(String(60), nullable=True, default=None)
    is_group = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    messages = relationship("Message", back_populates="chat")
    members = relationship("ChatMember", back_populates="chat")

# Association table for chat members
class ChatMember(Base):
    __tablename__ = "chat_members"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, nullable=False, default=func.now())

    chat = relationship("Chat", back_populates="members")
    user = relationship("User", back_populates="chat_memberships")

# Message model
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    message_type = Column(String(25), default="text")
    reply_to_id = Column(Integer, ForeignKey("messages.id"), nullable=True, default=None)
    sent_at = Column(DateTime, nullable=False, default=func.now())

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent")
    replies = relationship("Message", backref=backref("parent", remote_side=[id]))

    statuses = relationship("MessageStatus", back_populates="message")

# Message status (e.g., delivered, read)
class MessageStatus(Base):
    __tablename__ = "message_status"

    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("messages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(MessageStatusEnum), default=MessageStatusEnum.sent)
    updated_at = Column(DateTime, nullable=False, default=func.now())

    message = relationship("Message", back_populates="statuses")
    user = relationship("User", back_populates="message_statuses")
