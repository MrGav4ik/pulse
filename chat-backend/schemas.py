from pydantic import BaseModel

class Chat(BaseModel):
    id: int
    name: str
    message: str