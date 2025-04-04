from fastapi import FastAPI
import psycopg2
import json


app = FastAPI()

@app.on_event("startup")
async def startup():
    """Initialize PostgreSQL connection"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="admin",
        )
        print("✅ PostgreSQL connected successfully")
        app.state.conn = conn
    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")


@app.on_event("shutdown")
async def shutdown():
    """Close PostgreSQL connection"""
    if app.state.conn:
        app.state.conn.close()



@app.get("/chat")
def get_chats():
    dummy_data = [
        {
            "id": 1,
            "name": "John Doe",
            "message": "Hello, how are you?",
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "message": "Hi, I'm doing well. How about you?",
        },
    ]
    return dummy_data