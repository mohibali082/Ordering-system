from fastapi import APIRouter
from app.database import get_db
from app.models import Offer

router = APIRouter()

@router.get("/", response_model=list[Offer])
def get_offers():
    db = get_db()
    return db["offers"]