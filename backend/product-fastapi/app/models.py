import uuid
from datetime import datetime

from sqlmodel import Column, DateTime, Field, SQLModel, func


class Category(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    parent_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="category.id",
    )
    name: str = Field(max_length=255)
    slug: str = Field(unique=True, index=True)
    description: str | None = Field(default=None)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
