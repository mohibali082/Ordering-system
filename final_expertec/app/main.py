from fastapi import FastAPI
from app.routers import items, orders, offers, admin

app = FastAPI(
    title="Ordering System API",
    description="API for basic ordering system with inventory management",
    version="1.0.0"
)

# Include routers
app.include_router(items.router, prefix="/items", tags=["items"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(offers.router, prefix="/offers", tags=["offers"])
app.include_router(admin.router, prefix="/items-management", tags=["admin"])
app.include_router(admin.router, prefix="/offers-management", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Ordering System API is running"}