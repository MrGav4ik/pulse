from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    chats = relationship("Chat", back_populates="user")
    messages = relationship("Message", back_populates="sender")

    __mapper_args__ = {"eager_defaults": True}


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, ForeignKey("users.name"))

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    sender_name = Column(String, ForeignKey("users.name"))
    content = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="messages")
