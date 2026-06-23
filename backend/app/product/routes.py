from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

product_router = APIRouter(prefix="/products", tags=["Products"])

class ProductBase(BaseModel):
    name: str
    brand: str
    unit_price: float
    stock_quantity: int
    description: str
    image: Optional[str] = None      
    category: Optional[str] = None 
    
class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    unit_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    description: Optional[str] = None


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

    def __iter__(self):
        # Itera diretamente sobre _data sem copiar, preservando referências
        return iter(self._data)

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


products = Array()

initial_products = [
    {
        "id": 1,
        "name": "Tênis Runner Pro",
        "brand": "Nike",
        "description": "Tênis esportivo com amortecimento avançado para corridas de longa distância.",
        "unit_price": 299.9,
        "stock_quantity": 7,
        "image": "https://picsum.photos/seed/tenis-runner/600/450",
        "category": "Calçados",
    },
    {
        "id": 2,
        "name": "Mochila Urbana 30L",
        "brand": "Nike",
        "description": "Mochila resistente à água com compartimento para notebook até 15\".",
        "unit_price": 189.9,
        "stock_quantity": 6,
        "image": "https://picsum.photos/seed/mochila-urbana/600/450",
        "category": "Acessórios",
    },
    {
        "id": 3,
        "name": "Camiseta Dry-Fit",
        "brand": "Nike",
        "description": "Camiseta leve com tecido que afasta a umidade, ideal para treinos.",
        "unit_price": 59.9,
        "stock_quantity": 5,
        "image": "https://picsum.photos/seed/camiseta-dryfit/600/450",
        "category": "Vestuário",
    },
    {
        "id": 4,
        "name": "Fone Bluetooth Over-Ear",
        "brand": "JBL",
        "description": "Fone com cancelamento de ruído ativo e até 30h de bateria.",
        "unit_price": 459.9,
        "stock_quantity": 8,
        "image": "https://picsum.photos/seed/fone-bluetooth/600/450",
        "category": "Eletrônicos",
    },
    {
        "id": 5,
        "name": "Garrafa Térmica 500ml",
        "brand": "Stanley",
        "description": "Mantém líquidos quentes por 12h e frios por 24h. Aço inox.",
        "unit_price": 89.9,
        "stock_quantity": 9,
        "image": "https://picsum.photos/seed/garrafa-termica/600/450",
        "category": "Casa",
    },
    {
        "id": 6,
        "name": "Smartwatch Fit 3",
        "brand": "Xiaomi",
        "description": "Monitor cardíaco, GPS integrado e resistência à água até 50m.",
        "unit_price": 799.9,
        "stock_quantity": 10,
        "image": "https://picsum.photos/seed/smartwatch-fit/600/450",
        "category": "Eletrônicos",
    },
    {
        "id": 7,
        "name": "Livro: Clean Code",
        "brand": "Editora Abril",
        "description": "Guia definitivo para escrever código limpo e manutenível.",
        "unit_price": 74.9,
        "stock_quantity": 11,
        "image": "https://picsum.photos/seed/livro-cleancode/600/450",
        "category": "Livros",
    },
    {
        "id": 8,
        "name": "Cadeira Ergonômica",
        "brand": "Móveis",
        "description": "Suporte lombar ajustável, apoio de braços 4D e assento em espuma.",
        "unit_price": 1299.9,
        "stock_quantity": 12,
        "image": "https://picsum.photos/seed/cadeira-ergonomica/600/450",
        "category": "Escritório",
    },
]


for p in initial_products:
    products.append(p)

product_id_counter = len(initial_products) + 1



@product_router.post("/", status_code=201, response_model=Product)
def create_product(product: ProductCreate):
    global product_id_counter

    new_product = product.dict()
    new_product["id"] = product_id_counter

    for existing in products:
        if (
            existing["name"] == new_product["name"]
            and existing["brand"] == new_product["brand"]
            and existing["description"] == new_product["description"]
        ):
            raise HTTPException(status_code=400, detail="Produto existente.")

    products.append(new_product)
    product_id_counter += 1

    return new_product


@product_router.get("/")
def get_products():
    # Converte para lista para o FastAPI serializar corretamente
    return [products[i] for i in range(len(products))]

@product_router.get("/search")
def search_products(name: str):
    """Retorna produtos cujo nome contém o termo buscado (case-insensitive)."""
    termo = name.strip().lower()
    resultado = [
        products[i] for i in range(len(products))
        if termo in products[i]["name"].lower()
    ]
    return resultado

@product_router.get("/sort")
def sort_products(by: str = "name", order: str = "asc"):
    """Ordena os produtos por 'name' ou 'price' (unit_price)."""
    if by not in ("name", "price"):
        raise HTTPException(status_code=400, detail="Parâmetro 'by' deve ser 'name' ou 'price'")
    if order not in ("asc", "desc"):
        raise HTTPException(status_code=400, detail="Parâmetro 'order' deve ser 'asc' ou 'desc'")

    chave = "name" if by == "name" else "unit_price"
    lista = [products[i] for i in range(len(products))]
    lista.sort(
        key=lambda p: p[chave].lower() if chave == "name" else p[chave],
        reverse=(order == "desc"),
    )
    return lista

@product_router.get("/{id}")
def get_product(id: int):
    for i in range(len(products)):
        if products[i]["id"] == id:
            return products[i]

    raise HTTPException(status_code=404, detail="Produto não encontrado")


@product_router.put("/{id}")
def update_product(id: int, product: ProductUpdate):
    for i in range(len(products)):
        if products[i]["id"] == id:
            update_data = product.dict(exclude_unset=True)
            for key, value in update_data.items():
                products[i][key] = value
            return products[i]

    raise HTTPException(status_code=404, detail="Produto não encontrado")


@product_router.delete("/{id}")
def delete_product(id: int):
    for i in range(len(products)):
        if products[i]["id"] == id:
            products.remove(i) 
            return {"message": "Produto deletado com sucesso"}

    raise HTTPException(status_code=404, detail="Produto não encontrado")

