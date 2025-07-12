from fastapi import APIRouter, Request, HTTPException
import bcrypt
from datetime import datetime
from models.account.account_creation_request import AccountCreationRequest
from models.account.account_login_request import AccountLoginRequest
from clients.mongo_client import client

router = APIRouter()

account_db = client.account



@router.post("/account/create", status_code=201)
async def create_account(account_data: AccountCreationRequest):
    hashed_pw = bcrypt.hashpw(account_data.password.encode(), bcrypt.gensalt()).decode('utf-8')
    doc = {
        "email": account_data.email,
        "password": hashed_pw,
        "updated_at": datetime.utcnow(),
    }
    collection = account_db.get_collection("account")
    await collection.insert_one(doc)
    return {"message": "Account created", "email": account_data.email}


@router.post(path="/login")
async def login(request: Request, login_data: AccountLoginRequest):
    account_collection = account_db.get_collection("account")
    user = await account_collection.find_one({"email": login_data.email})
    if not user or not bcrypt.checkpw(login_data.password.encode(), user['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    request.session['user_email'] = login_data.email
    return {"message": f"Welcome back, {login_data.email}!"}


@router.post("/logout")
async def logout(request: Request):
    request.session.pop("user_email", None)
    return {"message": "Logged out"}


@router.get("/me")
async def me(request: Request):
    print(request.session)
    user_email = request.session.get('user_email')
    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return {"email": user_email}
