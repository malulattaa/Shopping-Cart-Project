from FastApi import FastAPI

cart_router = FastAPI()

@cart_router.post("/")
async def create_cart():
    return {"message": "Cart created successfully"}

@cart_router.get("/:id")
async def get_cart(id: int):
    return {"message": f"Cart {id} retrieved successfully"}

@cart_router.delete("/:id")
async def delete_cart(id: int):
    return {"message": f"Cart {id} deleted successfully"}

@cart_router.put("/:id")
async def update_cart(id: int):
    return {"message": f"Cart {id} updated successfully"}

@cart_router.get("/all")
async def get_all_carts():
    return {"message": "All carts retrieved successfully"}

@cart_router.put("/:id/add_item")
async def add_item_to_cart(id: int):
    return {"message": f"Item added to cart {id} successfully"}
 
@cart_router.put("/:id/remove_item")
async def remove_item_from_cart(id: int):
    return {"message": f"Item removed from cart {id} successfully"}

