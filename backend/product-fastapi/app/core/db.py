from fastapi import Depends
from collections.abc import Generator
from typing import Annotated, Any
from sqlmodel import create_engine, Session
from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def get_db() -> Generator[Session, Any, Any]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
