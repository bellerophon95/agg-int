from pydantic import BaseModel


class AccountCreationRequest(BaseModel):
    email: str
    password: str
