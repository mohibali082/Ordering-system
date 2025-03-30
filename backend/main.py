# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ShopEasy Ordering System API",
    description="API for basic ordering system with inventory and offer management",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# In-memory database
items_db = {
    "1": {"id": "1", "name": "Laptop", "price": 999.99, "stock": 10},
    "2": {"id": "2", "name": "Smartphone", "price": 699.99, "stock": 15},
    "3": {"id": "3", "name": "Headphones", "price": 149.99, "stock": 30}
}

orders_db = []
offers_db = [
    {"id": "1", "name": "10% off on orders over $50", "condition": {"min_total": 50}, "discount": {"type": "percentage", "value": 10}},
    {"id": "2", "name": "$20 off on orders over $100", "condition": {"min_total": 100}, "discount": {"type": "fixed", "value": 20}}
]

# Pydantic models
class Item(BaseModel):
    id: str
    name: str
    price: float
    stock: int

class OrderItem(BaseModel):
    item_id: str
    quantity: int

class Order(BaseModel):
    items: List[OrderItem]
    total: float
    discount_applied: Optional[str] = None

class Offer(BaseModel):
    id: str
    name: str
    condition: Dict  # e.g., {"min_total": 50}
    discount: Dict   # e.g., {"type": "percentage", "value": 10}

# API endpoints
@app.get("/items", response_model=List[Item], tags=["Customer Endpoints"])
async def get_items():
    """Get all available items"""
    logger.info("Fetching all items")
    return list(items_db.values())

@app.post("/orders", tags=["Customer Endpoints"])
async def create_order(order: Order):
    """Create a new order with automatic offer application"""
    logger.info(f"Creating order: {order}")
    
    # Validate stock
    for order_item in order.items:
        item = items_db.get(order_item.item_id)
        if not item or item["stock"] < order_item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Item {order_item.item_id} not available or insufficient stock"
            )
    
    # Calculate total and apply offers
    total = sum(items_db[item.item_id]["price"] * item.quantity for item in order.items)
    applied_offer = None
    
    for offer in offers_db:
        if offer["condition"].get("min_total") and total >= offer["condition"]["min_total"]:
            if offer["discount"]["type"] == "percentage":
                total *= (1 - offer["discount"]["value"] / 100)
            elif offer["discount"]["type"] == "fixed":
                total -= offer["discount"]["value"]
            applied_offer = offer["name"]
            break
    
    # Update stock
    for order_item in order.items:
        items_db[order_item.item_id]["stock"] -= order_item.quantity
    
    # Create and store order
    order.total = round(max(total, 0), 2)  # Ensure total doesn't go negative
    order.discount_applied = applied_offer
    orders_db.append(order.dict())
    
    return {
        "message": "Order created successfully",
        "order": order,
        "remaining_stock": {item_id: items_db[item_id]["stock"] for item_id in items_db}
    }

@app.get("/offers", response_model=List[Offer], tags=["Customer Endpoints"])
async def get_offers():
    """Get all available offers"""
    logger.info("Fetching all offers")
    return offers_db

# Staff management endpoints
@app.post("/items-management", tags=["Staff Endpoints"])
async def manage_item(item: Item, action: str = "add"):
    """Add or update an item (staff only)"""
    logger.info(f"Managing item: {action} {item}")
    
    if action == "add":
        items_db[item.id] = item.dict()
    elif action == "update":
        if item.id not in items_db:
            raise HTTPException(status_code=404, detail="Item not found")
        items_db[item.id] = item.dict()
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    return {"message": f"Item {action}ed successfully", "item": item}

@app.delete("/items-management/{item_id}", tags=["Staff Endpoints"])
async def delete_item(item_id: str):
    """Delete an item (staff only)"""
    logger.info(f"Deleting item: {item_id}")
    
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    
    del items_db[item_id]
    return {"message": "Item deleted successfully"}

@app.post("/offers-management", tags=["Staff Endpoints"])
async def manage_offer(offer: Offer, action: str = "add"):
    """Add or update an offer (staff only)"""
    logger.info(f"Managing offer: {action} {offer}")
    
    if action == "add":
        offers_db.append(offer.dict())
    elif action == "update":
        for i, o in enumerate(offers_db):
            if o["id"] == offer.id:
                offers_db[i] = offer.dict()
                break
        else:
            raise HTTPException(status_code=404, detail="Offer not found")
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    return {"message": f"Offer {action}ed successfully", "offer": offer}

@app.delete("/offers-management/{offer_id}", tags=["Staff Endpoints"])
async def delete_offer(offer_id: str):
    """Delete an offer (staff only)"""
    logger.info(f"Deleting offer: {offer_id}")
    
    for i, offer in enumerate(offers_db):
        if offer["id"] == offer_id:
            del offers_db[i]
            return {"message": "Offer deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Offer not found")

# Health check endpoint
@app.get("/health", tags=["Utility"])
async def health_check():
    """Service health check"""
    return {"status": "healthy", "service": "ShopEasy API"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )