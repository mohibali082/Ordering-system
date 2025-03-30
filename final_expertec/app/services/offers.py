def apply_offers(order: dict, all_offers: list, ordered_items: list):
    applicable_offers = []
    
    for offer in all_offers:
        # Check if offer has minimum order amount requirement
        if offer.minimum_order_amount and order["total_amount"] >= offer.minimum_order_amount:
            applicable_offers.append(offer)
            continue
        
        # Check if offer applies to specific items
        if offer.applicable_items:
            ordered_item_ids = [item.id for item in ordered_items]
            if all(item_id in ordered_item_ids for item_id in offer.applicable_items):
                applicable_offers.append(offer)
    
    # Apply the best offer (highest discount)
    if applicable_offers:
        best_offer = max(applicable_offers, key=lambda x: x.discount_percentage)
        discount = order["total_amount"] * (best_offer.discount_percentage / 100)
        order["discount_applied"] = discount
        order["final_amount"] = order["total_amount"] - discount
        order["applied_offer"] = best_offer.name
    else:
        order["final_amount"] = order["total_amount"]
    
    return order