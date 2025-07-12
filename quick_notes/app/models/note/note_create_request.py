from pydantic import BaseModel


class NoteCreateRequest(BaseModel):
    title: str
    body: str