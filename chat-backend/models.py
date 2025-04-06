from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)

    received_chats = relationship("Chat", back_populates="receiver", foreign_keys="[Chat.receiver_id]")
    sent_chats = relationship("Chat", back_populates="sender", foreign_keys="[Chat.sender_id]")

    sender = relationship("Message", back_populates="sender", foreign_keys="[Message.message_sender_id]")
    receiver = relationship("Message", back_populates="receiver", foreign_keys="[Message.message_sender_id]")

    __mapper_args__ = {"eager_defaults": True}


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True)
    receiver_id = Column(Integer, ForeignKey("users.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))

    receiver = relationship("User", back_populates="received_chats", foreign_keys=[receiver_id])
    sender = relationship("User", back_populates="sent_chats", foreign_keys=[sender_id])
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.chat_id"))
    message_sender_id = Column(Integer, ForeignKey("users.id"))
    message_receiver_id = Column(Integer, ForeignKey("users.id"))
    message_content = Column(String, nullable=False)
    message_timestamp = Column(DateTime, nullable=False, default=func.now())

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="sender", foreign_keys=[message_sender_id])
    receiver = relationship("User", back_populates="receiver", foreign_keys=[message_receiver_id])
