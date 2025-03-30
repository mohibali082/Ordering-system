from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Order, OrderItem
from app.services.offers import apply_offers
from app.services.items import validate_items_availability

router = APIRouter()

@router.post("/", response_model=Order)
def create_order(order_items: list[OrderItem]):
    db = get_db()
    
    # Validate items and calculate total
    items, total_amount = validate_items_availability(order_items, db["items"])
    
    # Create order
    order = {
        "id": db["next_order_id"],
        "user_id": 1,  # Hardcoded for now
        "items": order_items,
        "total_amount": total_amount,
        "final_amount": total_amount,
        "status": "pending"
    }
    
    # Apply offers
    order = apply_offers(order, db["offers"], items)
    
    # Save order
    db["orders"].append(order)
    db["next_order_id"] += 1
    
    # Update stock
    for order_item in order_items:
        item = next(item for item in db["items"] if item.id == order_item.item_id)
        item.stock -= order_item.quantity
    
    return order