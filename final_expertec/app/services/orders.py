from fastapi import HTTPException
from typing import Dict, List, Tuple
from app.models import Order, OrderItem, Item

def calculate_order_total(order_items: List[OrderItem], available_items: List[Item]) -> Tuple[float, List[Item]]:
    """
    Calculate the total amount for an order and validate item availability.
    Returns (total_amount, list_of_items) or raises HTTPException for errors.
    """
    total = 0.0
    items_in_order = []
    
    for order_item in order_items:
        # Find the item in available inventory
        item = next((i for i in available_items if i.id == order_item.item_id), None)
        
        if not item:
            raise HTTPException(
                status_code=404,
                detail=f"Item with ID {order_item.item_id} not found"
            )
            
        if item.stock < order_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.name}. Available: {item.stock}, Requested: {order_item.quantity}"
            )
            
        items_in_order.append(item)
        total += item.price * order_item.quantity
    
    return total, items_in_order

def prepare_order_response(order_id: int, user_id: int, order_items: List[OrderItem], 
                         total_amount: float, discount: float = None) -> Dict:
    """
    Structure the order response with applied discounts.
    """
    return {
        "id": order_id,
        "user_id": user_id,
        "items": [{"item_id": oi.item_id, "quantity": oi.quantity} for oi in order_items],
        "total_amount": total_amount,
        "discount_applied": discount,
        "final_amount": total_amount - (discount if discount else 0),
        "status": "pending"
    }

def update_inventory(order_items: List[OrderItem], available_items: List[Item]):
    """
    Reduce stock levels for ordered items.
    """
    for order_item in order_items:
        item = next(i for i in available_items if i.id == order_item.item_id)
        item.stock -= order_item.quantity