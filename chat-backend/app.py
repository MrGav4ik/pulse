from fastapi import FastAPI
from database import Base, engine

app = FastAPI()

exclude_tables = ["users"]

tables_to_create = [table for table in Base.metadata.tables.values() if table.name not in exclude_tables]

try:
    for table in tables_to_create:
        table.create(bind=engine)
    print("✅ PostgreSQL connected successfully.")
except Exception as e:
    print(f"❌ PostgreSQL connection failed: {e}")
    


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