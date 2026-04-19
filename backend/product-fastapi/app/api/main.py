from fastapi import APIRouter
from app.api.routes import healthcheck, categories

api_router = APIRouter()

api_router.include_router(categories.router)
api_router.include_router(healthcheck.router)
