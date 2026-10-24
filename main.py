import sqlite3
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, HTTPException, Query, Response, status

from database import create_table, get_connection
from schemas import StudentCreate, StudentUpdate

app = FastAPI(
    title="Student Record Management API",
    description="A student CRUD application using FastAPI and SQLite",
    version="1.0.0",
)

BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

create_table()


def find_student(student_id: int):
    with get_connection() as connection:
        student = connection.execute(
            "SELECT * FROM students WHERE id = ?",
            (student_id,),
        ).fetchone()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found",
        )

    return dict(student)

#routes:-
@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / "index.html")


# READ: List students and optionally filter them
@app.get("/students")
def list_students(
    name: str | None = None,
    course: str | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    query = "SELECT * FROM students WHERE 1=1"
    parameters = []

    if name:
        query += " AND name LIKE ?"
        parameters.append(f"%{name}%")

    if course:
        query += " AND course LIKE ?"
        parameters.append(f"%{course}%")

    query += " ORDER BY id LIMIT ? OFFSET ?"
    parameters.extend([limit, offset])

    with get_connection() as connection:
        rows = connection.execute(
            query, parameters
        ).fetchall()

    return [dict(row) for row in rows]


# CREATE: Add a new student
@app.post("/students", status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate):
    data = student.model_dump(mode="json")

    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO students
                (name, date_of_birth, email, phone,
                 course, address, enrollment_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    data["name"],
                    data["date_of_birth"],
                    data["email"],
                    data["phone"],
                    data["course"],
                    data["address"],
                    data["enrollment_date"],
                ),
            )
            student_id = cursor.lastrowid

    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="A student with this email already exists",
        ) from exc

    return find_student(student_id)


# READ: Get one student
@app.get("/students/{student_id}")
def get_student(student_id: int):
    return find_student(student_id)


# UPDATE: Replace the editable student details
@app.put("/students/{student_id}")
def replace_student(student_id: int, student: StudentCreate):
    find_student(student_id)
    data = student.model_dump(mode="json")

    try:
        with get_connection() as connection:
            connection.execute(
                """
                UPDATE students
                SET name = ?, date_of_birth = ?, email = ?,
                    phone = ?, course = ?, address = ?,
                    enrollment_date = ?
                WHERE id = ?
                """,
                (
                    data["name"],
                    data["date_of_birth"],
                    data["email"],
                    data["phone"],
                    data["course"],
                    data["address"],
                    data["enrollment_date"],
                    student_id,
                ),
            )
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="A student with this email already exists",
        ) from exc

    return find_student(student_id)


# UPDATE: Change only the fields supplied
@app.patch("/students/{student_id}")
def update_student(student_id: int, student: StudentUpdate):
    find_student(student_id)
    changes = student.model_dump(
        exclude_unset=True,
        mode="json",
    )

    if not changes:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update",
        )

    if any(value is None for value in changes.values()):
        raise HTTPException(
            status_code=422,
            detail="Updated fields cannot be null",
        )

    columns = {
        "name", "date_of_birth", "email", "phone",
        "course", "address", "enrollment_date",
    }

    if not set(changes).issubset(columns):
        raise HTTPException(
            status_code=400,
            detail="Invalid update fields",
        )

    assignments = ", ".join(
        f"{column} = ?" for column in changes
    )
    values = list(changes.values()) + [student_id]

    try:
        with get_connection() as connection:
            connection.execute(
                f"UPDATE students SET {assignments} WHERE id = ?",
                values,
            )
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="A student with this email already exists",
        ) from exc

    return find_student(student_id)


# DELETE: Remove a student
@app.delete(
    "/students/{student_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_student(student_id: int):
    find_student(student_id)

    with get_connection() as connection:
        connection.execute(
            "DELETE FROM students WHERE id = ?",
            (student_id,),
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
