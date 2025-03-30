from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Item, Offer

router = APIRouter()

# Items management
@router.post("/items", response_model=Item)
def add_or_update_item(item: Item):
    db = get_db()
    
    # Check if item exists
    existing_item = next((i for i in db["items"] if i.id == item.id), None)
    
    if existing_item:
        # Update existing item
        existing_item.name = item.name
        existing_item.price = item.price
        existing_item.stock = item.stock
        existing_item.description = item.description
        return existing_item
    else:
        # Add new item
        db["items"].append(item)
        return item

@router.delete("/items/{item_id}")
def delete_item(item_id: int):
    db = get_db()
    item = next((item for item in db["items"] if item.id == item_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db["items"].remove(item)
    return {"message": "Item deleted successfully"}

# Offers management
@router.post("/offers", response_model=Offer)
def add_or_update_offer(offer: Offer):
    db = get_db()
    
    # Check if offer exists
    existing_offer = next((o for o in db["offers"] if o.id == offer.id), None)
    
    if existing_offer:
        # Update existing offer
        existing_offer.name = offer.name
        existing_offer.description = offer.description
        existing_offer.discount_percentage = offer.discount_percentage
        existing_offer.applicable_items = offer.applicable_items
        existing_offer.minimum_order_amount = offer.minimum_order_amount
        return existing_offer
    else:
        # Add new offer
        db["offers"].append(offer)
        return offer

@router.delete("/offers/{offer_id}")
def delete_offer(offer_id: int):
    db = get_db()
    offer = next((offer for offer in db["offers"] if offer.id == offer_id), None)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    db["offers"].remove(offer)
    return {"message": "Offer deleted successfully"}