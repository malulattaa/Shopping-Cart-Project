from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    if client is None:
        raise RuntimeError("Database client not initialized")
    return client


def get_db():
    return get_client()[settings.mongo_db_name]


async def connect_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.mongo_uri)
    await client.admin.command("ping")


async def close_db() -> None:
    global client
    if client is not None:
        client.close()
        client = None
