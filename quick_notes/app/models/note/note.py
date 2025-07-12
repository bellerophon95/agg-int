from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field


class Note(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    body: str
    update_time: datetime
    created_by: str

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
        }
