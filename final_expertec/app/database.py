from app.models import Item, Offer, Order

# In-memory database
db = {
    "items": [
        Item(id=1, name="Laptop", price=999.99, stock=10, description="High performance laptop"),
        Item(id=2, name="Phone", price=699.99, stock=15, description="Latest smartphone"),
        Item(id=3, name="Headphones", price=149.99, stock=20, description="Noise cancelling headphones"),
    ],
    "offers": [
        Offer(
            id=1,
            name="Tech Bundle Discount",
            description="10% off when buying a laptop and headphones together",
            discount_percentage=10,
            applicable_items=[1, 3],  # Laptop and headphones
            minimum_order_amount=None
        ),
        Offer(
            id=2,
            name="Big Spender Discount",
            description="15% off on orders over $1000",
            discount_percentage=15,
            applicable_items=[],  # Applies to all items
            minimum_order_amount=1000
        )
    ],
    "orders": [],
    "next_order_id": 1
}

def get_db():
    return db