from sqlmodel import SQLModel


class CartBase(SQLModel):

class Cart(CartBase, table=True):

