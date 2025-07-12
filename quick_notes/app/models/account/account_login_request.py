from datetime import datetime

from pydantic import BaseModel


class AccountLoginRequest(BaseModel):
    email: str
    password: str
    updated_at: datetime = None