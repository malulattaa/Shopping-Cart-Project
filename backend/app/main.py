from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from product.routes import product_router
import uvicorn

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await connect_db()
#     yield
#     await close_db()


app = FastAPI(
   
)

app.include_router(product_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "shopping-cart-backend",
        "version": "0.1.0",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload = True)

