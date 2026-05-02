from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.models.category import (
    Category,
    CategoryCreate,
    CategoryPublic,
    CategoriesPublic,
)
from app.api.deps import SessionDep

router = APIRouter(tags=["category"])


@router.post("/categories", response_model=CategoryPublic)
async def create_category(session: SessionDep, category_in: CategoryCreate):
    category = Category.model_validate(category_in)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.get("/categories", response_model=CategoriesPublic)
async def read_categories(session: SessionDep, skip: int = 0, limit: int = 100):
    count_statement = select(func.count()).select_from(Category)
    count = session.exec(count_statement).one()
    statement = (
        select(Category).order_by(col(Category.id).asc()).offset(skip).limit(limit)
    )
    categories = session.exec(statement).all()
    categories_public = [
        CategoryPublic.model_validate(category) for category in categories
    ]
    return CategoriesPublic(data=categories_public, count=count)


@router.get("/categories/{category_id}", response_model=CategoryPublic)
async def read_category(session: SessionDep, category_id: int):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/categories/{category_id}")
async def delete_category(session: SessionDep, category_id: int):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    session.delete(category)
    session.commit()
    return {"message": "Category deleted successfully"}
