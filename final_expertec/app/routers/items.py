from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Item

router = APIRouter()

@router.get("/", response_model=list[Item])
def get_items():
    db = get_db()
    return db["items"]

@router.get("/{item_id}", response_model=Item)
def get_item(item_id: int):
    db = get_db()
    item = next((item for item in db["items"] if item.id == item_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item