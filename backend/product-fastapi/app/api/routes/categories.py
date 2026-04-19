from fastapi import APIRouter


router = APIRouter(prefix="/v1/categories")


@router.post("/")
async def create_category():
    return {"createCategory": "ok"}
