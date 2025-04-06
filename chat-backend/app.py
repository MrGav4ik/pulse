from fastapi import FastAPI
from database import Base, engine
from routers import chats

app = FastAPI()

try:
    Base.metadata.create_all(bind=engine)
    print("✅ PostgreSQL connected successfully.")
except Exception as e:
    print(f"❌ PostgreSQL connection failed: {e}")
    

app.include_router(chats.router)