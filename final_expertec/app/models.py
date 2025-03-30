from typing import List, Optional
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    description: Optional[str] = None

class Offer(BaseModel):
    id: int
    name: str
    description: str
    discount_percentage: float
    applicable_items: List[int]  # List of item IDs this offer applies to
    minimum_order_amount: Optional[float] = None

class OrderItem(BaseModel):
    item_id: int
    quantity: int

class Order(BaseModel):
    id: int
    user_id: int  # In a real system, this would be from authentication
    items: List[OrderItem]
    total_amount: float
    discount_applied: Optional[float] = None
    final_amount: float
    status: str = "pending"