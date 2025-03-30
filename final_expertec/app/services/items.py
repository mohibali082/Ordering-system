from fastapi import HTTPException

def validate_items_availability(order_items: list, all_items: list):
    items = []
    total_amount = 0.0
    
    for order_item in order_items:
        item = next((i for i in all_items if i.id == order_item.item_id), None)
        if not item:
            raise HTTPException(status_code=404, detail=f"Item with ID {order_item.item_id} not found")
        if item.stock < order_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for item {item.name}. Available: {item.stock}, Requested: {order_item.quantity}"
            )
        items.append(item)
        total_amount += item.price * order_item.quantity
    
    return items, total_amount