from fastapi import APIRouter

router = APIRouter()


@router.get("/v1/healthcheck")
async def healthcheck():
    return {"status": "ok"}
