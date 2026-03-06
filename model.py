from pydantic import BaseModel


class Todo(BaseModel):
    id: int
    title: str
    desc: str


class TodoRequest(BaseModel):
    title: str
    desc: str
