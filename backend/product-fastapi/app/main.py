from typing import Annotated

from fastapi import Cookie, Depends, FastAPI
from pydantic import BaseModel, EmailStr, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = Field(default=None)
    price: float
    tax: float | None = None
    tags: list[str] = []


class BaseUser(BaseModel):
    username: str
    email: EmailStr
    fullname: str | None = None


class UserIn(BaseUser):
    password: str


@app.post("/user/", response_model=BaseUser)
async def create_user(user: UserIn) -> BaseUser:
    return user


@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    return item


@app.get("/items/", response_model=list[Item])
async def read_items():
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]


def query_extractor(q: str | None = None):
    return q


def query_or_cookie_extractor(
    q: Annotated[str, Depends(query_extractor)],
    last_query: Annotated[str | None, Cookie()] = None,
):
    if not q:
        return last_query
    return q


@app.get("/items/")
async def read_query(
    query_or_default: Annotated[str, Depends(query_or_cookie_extractor)],
):
    return {"q_or_cookie": query_or_default}
