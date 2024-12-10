import uvicorn
import psycopg
import os
from datetime import datetime
from fastapi import FastAPI, APIRouter, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

# Переменная для хранения соединения с БД
db_connection = None

# Папка для сохранения файлов
FILE_DIRECTORY = "usersfiles"

# Функция для подключения к базе данных
def get_db_connection():
    global db_connection
    if db_connection is None:
        db_connection = psycopg.connect("dbname=feedback user=postgres password=postgres host=localhost port=5432")
    return db_connection

# Логика подключения к базе данных и закрытия соединения через lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_connection
    # Подключение к базе данных при запуске приложения
    db_connection = get_db_connection()
    print("Database connection established.")

    # Ждем завершения работы приложения
    yield

    # Закрытие соединения при остановке приложения
    if db_connection:
        db_connection.close()
        print("Database connection closed.")

app = FastAPI(
    title="Odoo",
    openapi_url=f"/api/openapi.json",
    docs_url=f"/api/docs",
    redoc_url=f"/api/redoc",
    root_path="/",
    lifespan=lifespan
)

router = APIRouter(prefix='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@router.post("/feedback/submit_and_upload")
async def submit_and_upload_feedback(
        feedback_type: str = Form(...),
        feedback_text: str = Form(...),
        file: Optional[UploadFile] = None
):
    uid = 1234

    # Обработка отправки фидбека в БД
    file_path = None
    if file:
        # Создаем уникальное имя файла
        timestamp = str(datetime.now()).split(".")[0]
        filename = f"{str(uid)}-{timestamp}.{str(file.filename).split(".")[-1]}"
        filename = filename.replace(" ", "-")
        file_path = str(os.path.join(FILE_DIRECTORY, filename))

        # Сохраняем файл на диск
        os.makedirs(FILE_DIRECTORY, exist_ok=True)
        with open(file_path, "xb") as f:
            content = await file.read()
            f.write(content)

    # Сохраняем фидбек и путь к файлу в БД (если файл есть)
    # with get_db_connection() as conn:
    with get_db_connection().cursor() as cur:
        cur.execute(
            "INSERT INTO user_feedback (timestamp, uid, feedback_type, feedback_text, file_path) VALUES ('now', %s, %s, %s, %s)",
            (uid, feedback_type, feedback_text, file_path)
        )
        get_db_connection().commit()

    return {"status": "Your feedback has been submitted successfully."}


@router.get("/feedback")
async def feedback_page():
    return {"Message": "You are on the feedback page."}


app.include_router(router)
