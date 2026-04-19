import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Column, DateTime, func


class Category(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    parent_id: Optional[uuid.UUID] = Field(
        default=None,
        foreign_key="category.id",
    )
    name: str = Field(max_length=255)
    slug: str = Field(unique=True, index=True)
    description: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
