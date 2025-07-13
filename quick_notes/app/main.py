import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers import account, note
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
    "https://agg-int-1.onrender.com",
]


app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY"),
    same_site="lax",
    session_cookie="session",
# default
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(account.router)
app.include_router(note.router)


@app.get('/')
def get_home_page():
    return {'data': 'howdie'}
