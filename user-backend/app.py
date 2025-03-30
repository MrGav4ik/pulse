from fastapi import FastAPI
from routers import auth, users
from database import engine, Base

app = FastAPI()

try:
    Base.metadata.create_all(bind=engine)
    print("✅ PostgreSQL connected successfully")
except Exception as e:
    print(f"❌ PostgreSQL connection failed: {e}")


app.include_router(auth.router)
app.include_router(users.router)