import os
from datetime import datetime, timedelta
from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.params import Query

from clients.mongo_client import client
from models.note.note import Note
from models.note.note_create_request import NoteCreateRequest
from models.note.note_update_request import NoteUpdateRequest

router = APIRouter()

FULL_TEXT_INDEX_NAME = os.getenv("FULL_TEXT_INDEX_NAME")


def oid_str(oid):
    return str(oid) if oid else None


def serialize_note(note_doc) -> dict:
    return {
        "_id": oid_str(note_doc.get("_id")),
        "title": note_doc.get("title"),
        "body": note_doc.get("body"),
        "update_time": note_doc.get("update_time"),
        "created_by": note_doc.get("created_by"),
        "tag": note_doc.get("tag")
    }


def get_current_user(request: Request):
    user_email = request.session.get("user_email")
    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_email


@router.get("/notes", response_model=List[Note])
async def find_all_notes(request: Request, user_email: str = Depends(get_current_user)):
    note_db = client.note
    notes_collection = note_db.get_collection("note")
    notes_cursor = notes_collection.find({'created_by': user_email})
    notes_list = await notes_cursor.to_list(length=100)
    return [serialize_note(note) for note in notes_list]


@router.get("/note/{note_id}", response_model=Note)
async def find_note(note_id: str, user_email: str = Depends(get_current_user)):
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    note_db = client.note
    notes_collection = note_db.get_collection("note")

    note_doc = await notes_collection.find_one({"_id": oid, "created_by": user_email})
    if not note_doc:
        raise HTTPException(status_code=404, detail="Note not found")

    return serialize_note(note_doc)


@router.post("/note", response_model=Note, status_code=201)
async def create_note(note_req: NoteCreateRequest, request: Request, user_email: str = Depends(get_current_user)):
    # print(request.session)

    note_db = client.note
    notes_collection = note_db.get_collection("note")

    now = datetime.utcnow()
    note_dict = note_req.dict()
    note_dict.update({"update_time": now})
    note_dict.update({"created_by": request.session.get('user_email')})
    result = await notes_collection.insert_one(note_dict)
    created_note = await notes_collection.find_one({"_id": result.inserted_id})

    return serialize_note(created_note)


@router.put("/note/{note_id}", response_model=Note)
async def update_note(
        note_id: str,
        note_req: NoteUpdateRequest,
):
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    note_db = client.note
    notes_collection = note_db.get_collection("note")

    does_note_exist = await notes_collection.find_one({"_id": oid})
    if not does_note_exist:
        raise HTTPException(status_code=404, detail="Note not found")

    update_data = note_req.model_dump(exclude_unset=True)
    update_data["update_time"] = datetime.now()

    await notes_collection.update_one({"_id": oid}, {"$set": update_data})
    updated_note = await notes_collection.find_one({"_id": oid})

    return serialize_note(updated_note)


@router.delete("/note/{note_id}", status_code=204)
async def delete_note(note_id: str, user_email: str = Depends(get_current_user)):
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    note_db = client.note
    notes_collection = note_db.get_collection("note")

    result = await notes_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return None


@router.get('/notes/search')
async def search_notes(request: Request, q: str = Query(..., description="Search query string")):
    user_email = request.session.get('user_email')
    if not user_email:
        raise HTTPException(status_code=403, detail="Access forbidden")

    note_db = client.note
    notes_collection = note_db.get_collection("note")

    pipeline = [
        {
            "$search": {
                "index": FULL_TEXT_INDEX_NAME,
                "text": {
                    "query": q,
                    "path": ["title", "body"]
                }
            }
        },
        {"$match": {
            'created_by': user_email
        }},
        {"$limit": 20}
    ]

    notes = await notes_collection.aggregate(pipeline).to_list(length=20)
    return [serialize_note(note) for note in notes]


@router.get("/notes/recent", response_model=List[Note])
async def recent_notes(
        request: Request,
        hours: int = Query(24, description="Number of past hours to fetch notes"),
        user_email: str = Depends(get_current_user)
):
    note_db = client.note
    notes_collection = note_db.get_collection("note")

    time_threshold = datetime.utcnow() - timedelta(hours=hours)

    notes_cursor = notes_collection.find({
        "created_by": user_email,
        "update_time": {"$gte": time_threshold}
    }).sort("update_time", -1).limit(50)

    notes = await notes_cursor.to_list(length=50)
    return [serialize_note(note) for note in notes]
