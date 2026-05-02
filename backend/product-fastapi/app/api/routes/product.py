from app.api.deps import SessionDep
from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.models.category import Category
from app.models.product import (
    Product,
    ProductCreate,
    ProductPublic,
    ProductUpdate,
    ProductsPublic,
)

router = APIRouter(tags=["product"])


@router.post("/products", response_model=ProductPublic)
async def create_product(session: SessionDep, product_in: ProductCreate):
    category = session.get(Category, product_in.category_id)
    if not category:
        raise HTTPException(
            status_code=404,
            detail=f"Category with id {product_in.category_id} not found",
        )
    product = Product.model_validate(product_in)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.get("/products", response_model=ProductsPublic)
async def read_products(session: SessionDep, skip: int = 0, limit: int = 100):
    count = session.exec(select(func.count()).select_from(Product)).one()
    statement = (
        select(Product)
        .order_by(col(Product.created_at).desc())
        .offset(skip)
        .limit(limit)
    )
    products = session.exec(statement).all()
    products_public = [ProductPublic.model_validate(product) for product in products]
    return ProductsPublic(data=products_public, count=count)


@router.get("/categories/{category_id}/products", response_model=ProductsPublic)
async def read_products_by_category_id(
    session: SessionDep, category_id: int, skip: int = 0, limit: int = 100
):
    count_statement = (
        select(func.count())
        .select_from(Product)
        .where(Product.category_id == category_id)
    )
    count = session.exec(count_statement).one()
    statement = (
        select(Product)
        .order_by(col(Product.created_at).desc())
        .where(Product.category_id == category_id)
        .offset(skip)
        .limit(limit)
    )
    products = session.exec(statement).all()
    products_public = [ProductPublic.model_validate(product) for product in products]
    return ProductsPublic(data=products_public, count=count)


@router.get("/products/{product_id}", response_model=ProductPublic)
async def read_product(session: SessionDep, product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=404, detail=f"Product with id: {product_id} not found"
        )
    return product


@router.put("/products/{product_id}", response_model=ProductPublic)
async def update_product(
    session: SessionDep, product_id: int, product_in: ProductUpdate
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=404, detail=f"Product with id: {product_id} not found"
        )
    update_dict = product_in.model_dump(exclude_unset=True)
    product.sqlmodel_update(update_dict)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.delete("/products/{product_id}")
async def delete_product(session: SessionDep, product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=404, detail=f"Product with id: {product_id} not found"
        )
    session.delete(product)
    session.commit()
    return {"message": "Delete product successfully"}
