from typing import Optional

from pydantic import BaseModel


class NoteUpdateRequest(BaseModel):
    title: Optional[str]
    body: Optional[str]
