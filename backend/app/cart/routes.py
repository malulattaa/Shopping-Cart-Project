from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.product.routes import products
from app.cart.stack import Stack
from app.cart.linked_list import LinkList

cart_router = APIRouter(prefix="/cart", tags=["Cart"])


class AddItemRequest(BaseModel):
    product_id: int
    quantity: int = 1


class UpdateItemRequest(BaseModel):
    quantity: int


# Single global in-memory cart: product_id -> quantity.
# The app has no auth/session yet, so one shared cart serves the demo.
_cart: dict[int, int] = {}

# Undo history: each mutation pushes a snapshot of the cart *before* the change.
# Undo pops the most recent snapshot and restores it (LIFO).
_history = Stack()

# Purchase history: each completed checkout is appended to the linked list.
_purchase_history = LinkList()
_purchase_id_counter = 1


def _snapshot():
    """Record the current cart state so the next mutation can be undone."""
    _history.push(dict(_cart))


def _find_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product
    return None


def _serialize_cart():
    """Return the cart shaped to match the frontend CartItem type."""
    items = []
    total_items = 0
    total_amount = 0.0

    for product_id, quantity in _cart.items():
        product = _find_product(product_id)
        if product is None:
            continue  # product was deleted; skip the stale line

        items.append({"product": product, "quantity": quantity})
        total_items += quantity
        total_amount += product["unit_price"] * quantity

    return {
        "items": items,
        "total_items": total_items,
        "total_amount": round(total_amount, 2),
        "can_undo": len(_history) > 0,
    }


@cart_router.get("/")
def get_cart():
    return _serialize_cart()


@cart_router.post("/items")
def add_item(payload: AddItemRequest):
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantidade deve ser ao menos 1")

    product = _find_product(payload.product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    new_quantity = _cart.get(payload.product_id, 0) + payload.quantity
    if new_quantity > product["stock_quantity"]:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")

    _snapshot()
    _cart[payload.product_id] = new_quantity
    return _serialize_cart()


@cart_router.patch("/items/{product_id}")
def update_item(product_id: int, payload: UpdateItemRequest):
    if product_id not in _cart:
        raise HTTPException(status_code=404, detail="Item não está no carrinho")

    product = _find_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantidade deve ser ao menos 1")
    if payload.quantity > product["stock_quantity"]:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")

    _snapshot()
    _cart[product_id] = payload.quantity
    return _serialize_cart()


@cart_router.delete("/items/{product_id}")
def remove_item(product_id: int):
    if product_id not in _cart:
        raise HTTPException(status_code=404, detail="Item não está no carrinho")

    _snapshot()
    del _cart[product_id]
    return _serialize_cart()


@cart_router.delete("/")
def clear_cart():
    if _cart:
        _snapshot()
        _cart.clear()
    return _serialize_cart()


@cart_router.post("/undo")
def undo():
    if len(_history) == 0:
        raise HTTPException(status_code=400, detail="Nenhuma ação para desfazer")

    previous = _history.pop()
    _cart.clear()
    _cart.update(previous)
    return _serialize_cart()


@cart_router.post("/checkout")
def checkout():
    global _purchase_id_counter, _history

    if not _cart:
        raise HTTPException(status_code=400, detail="Carrinho vazio")

    # Valida o estoque de todas as linhas antes de efetivar a compra
    lines = []
    for product_id, quantity in _cart.items():
        product = _find_product(product_id)
        if product is None:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        if quantity > product["stock_quantity"]:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente para {product['name']}",
            )
        lines.append((product, quantity))

    # Efetiva: baixa o estoque e monta o registro da compra
    items = []
    total_amount = 0.0
    for product, quantity in lines:
        product["stock_quantity"] -= quantity
        subtotal = product["unit_price"] * quantity
        total_amount += subtotal
        items.append({
            "product_id": product["id"],
            "name": product["name"],
            "quantity": quantity,
            "unit_price": product["unit_price"],
            "subtotal": round(subtotal, 2),
        })

    purchase = {
        "id": _purchase_id_counter,
        "items": items,
        "total_amount": round(total_amount, 2),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _purchase_history.append(purchase)
    _purchase_id_counter += 1

    # Compra efetivada: esvazia o carrinho e zera o histórico de undo
    _cart.clear()
    _history = Stack()

    return purchase


@cart_router.get("/history")
def get_history():
    # Lista encadeada guarda em ordem de inserção; exibe as mais recentes primeiro
    return list(reversed(_purchase_history.to_list()))
