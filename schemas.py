from datetime import date
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints


NonEmptyString = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]


class StudentCreate(BaseModel):
    name: NonEmptyString
    date_of_birth: date
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    course: str | None = Field(default=None, max_length=100)
    address: str | None = Field(default=None, max_length=250)
    enrollment_date: date | None = None


class StudentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: NonEmptyString | None = None
    date_of_birth: date | None = None
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=20)
    course: str | None = Field(default=None, max_length=100)
    address: str | None = Field(default=None, max_length=250)
    enrollment_date: date | None = None
