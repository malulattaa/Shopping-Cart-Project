from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from product.routes import products

cart_router = APIRouter(prefix="/cart", tags=["Cart"])

class CartItem(BaseModel):
    product_id: int
    quantity: int

class Cart(BaseModel):
    id: int
    items: List[CartItem] = Field(default_factory=list)

class Array:
    def __init__(self):
        self._data = []
        self._size = 0

    def __len__(self):
        return self._size

    def __getitem__(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("índice fora do intervalo")
        return self._data[index]

    def __setitem__(self, index, value):
        if index < 0 or index >= self._size:
            raise IndexError("índice fora do intervalo")
        self._data[index] = value

    def append(self, value):
        self._data.append(value)
        self._size += 1

    def remove(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("índice fora do intervalo")
        self._data.pop(index)
        self._size -= 1
        
    def pop(self):
        if self._size == 0:
            raise IndexError("Array vazio")
        self._size -= 1
        return self._data.pop()

    def __repr__(self):
        elementos = ", ".join(str(self._data[i]) for i in range(self._size))
        return f"Array([{elementos}])"
    

carts = Array()
cart_id_counter = 1

@cart_router.post("/{cart_id}/items")
def add_item(cart_id: int, item: CartItem):

    def find_product(product_id: int):
        for product in products:
            if product["id"] == product_id:
                return product
        return None
    
    product = find_product(item.product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for i in range(len(carts)):
        cart = carts[i]

        if cart.id == cart_id:

            if item.quantity > product["stock_quantity"]:
                raise HTTPException(
                    status_code=400,
                    detail="Estoque insuficiente"
                )
                
            cart.items.append({
                "product_id": product["id"],
                "name": product["name"],
                "quantity": item.quantity
            })

            return cart

    raise HTTPException(status_code=404, detail="Carrinho não encontrado")