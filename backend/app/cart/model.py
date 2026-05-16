from pydantic import model_validator
from enum import Enum
from typing import List
from pydantic import BaseModel
from bson import ObjectId

class UserInformation(BaseModel):
    session_id: str
    email : str | None
    cellphone : str | None

    @model_validator(mode="after")
    def require_email_or_cellphone(self) -> "UserInformation":
        if self.email is None and self.cellphone is None:
            raise ValueError("email or cellphone is required")
        return self
    
class CartItem(BaseModel):
    id: ObjectId | None = None
    product_id: str | ObjectId
    quantity: int
    unit_price: float
    total_amount: float

    @property
    def total_amount(self):
        return self.quantity * self.unit_price

class CartStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"  

class Cart(BaseModel):
    id: ObjectId | None = None
    user_information: UserInformation
    items: List[CartItem]
    total_amount : float
    status : CartStatus
    metadata: dict[str, any] | None
    created_at : str
    updated_at : str
    expire_in : str


    
