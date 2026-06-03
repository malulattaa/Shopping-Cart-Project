# from motor.motor_asyncio import AsyncIOMotorClient
# from .config import settings
# from pymongo import MongoClient

# client: AsyncIOMotorClient | None = None

# MONGO_URL = 'mongodb+srv://gabrielatucunduva_db_user:f7szah6ki5wS1SNd@cluster0.i7hj8gn.mongodb.net/?appName=Cluster0'

# client = MongoClient(MONGO_URL)

# db = client["store_db"] #banco

# product_collection = db["products"] #tabela

# def get_client() -> AsyncIOMotorClient:
#     if client is None:
#         raise RuntimeError("Database client not initialized")
#     return client


# def get_db():
#     return get_client()[settings.mongo_db_name]


# async def connect_db() -> None:
#     global client
#     client = AsyncIOMotorClient(settings.mongo_uri)
#     await client.admin.command("ping")


# async def close_db() -> None:
#     global client
#     if client is not None:
#         client.close()
#         client = None

