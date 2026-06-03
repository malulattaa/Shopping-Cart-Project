from pydantic import BaseModel, Field, model_validator
from enum import Enum
from typing import List, Optional, Any
from datetime import datetime


class UserInformation(BaseModel):
    session_id: str
    email: Optional[str] = None
    cellphone: Optional[str] = None

    @model_validator(mode="after")
    def require_email_or_cellphone(self):
        if not self.email and not self.cellphone:
            raise ValueError("email or cellphone is required")
        return self


class CartItem(BaseModel):
    product_id: str
    quantity: int
    unit_price: float

    @property
    def total_amount(self):
        return self.quantity * self.unit_price



class CartStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"


class Cart(BaseModel):
    id: Optional[str] = None  
    user_information: UserInformation
    items: List[CartItem]
    status: CartStatus = CartStatus.ACTIVE
    metadata: Optional[dict[str, Any]] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expire_in: Optional[datetime] = None

    @property
    def total_amount(self):
        return sum(item.total_amount for item in self.items)