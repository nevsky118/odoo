import psycopg
import os
from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import shutil
from typing import Annotated, Union

if os.getenv("ENV") != "production":
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.development'))

# Переменная для хранения соединения с БД
db_connection = None

# Папка для сохранения файлов
FILE_DIRECTORY = "usersfiles"

# Убедимся, что каталог файлов существует
def ensure_file_directory_exists():
    if not os.path.exists(FILE_DIRECTORY):
        os.makedirs(FILE_DIRECTORY)

# Функция для подключения к базе данных
def get_db_connection():
    global db_connection
    if db_connection is None:
        db_connection = psycopg.connect(
            dbname=os.getenv("POSTGRES_DATABASE"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT")
        )
    return db_connection

# Функция для создания таблицы feedback
def create_feedback_table():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id SERIAL PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            file_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()

# Логика подключения к базе данных и закрытия соединения через lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_connection
    # Подключение к базе данных при запуске приложения
    db_connection = get_db_connection()
    create_feedback_table()
    print("Соединение с базой данных установлено.")

    # Ждем завершения работы приложения
    yield

    # Закрытие соединения при остановке приложения
    if db_connection:
        db_connection.close()
        print("Соединение с базой данных закрыто.")

app = FastAPI(
    title="Odoo",
    description="API для отправки обратной связи с возможностью загрузки файлов.",
    version="1.0.0",
    openapi_url=f"/api/openapi.json",
    docs_url=f"/api/docs",
    redoc_url=f"/api/redoc",
    root_path="/",
    lifespan=lifespan
)

router = APIRouter(prefix='/api', tags=["Feedback"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.post(
    "/feedback",
    summary="Отправить обратную связь",
    description="Эндпоинт для отправки обратной связи с возможностью загрузки файла. "
                "Категория и сообщение обязательны для заполнения. Сообщение не должно превышать 280 символов.",
    responses={
        200: {
            "description": "Успешно отправлено!",
            "content": {
                "application/json": {
                    "example": {"detail": "Успешно отправлено!"}
                }
            }
        },
        400: {
            "description": "Некорректные данные",
            "content": {
                "application/json": {
                    "example": {"detail": "Категория и сообщение обязательны для заполнения."}
                }
            }
        },
        500: {
            "description": "Ошибка сервера",
            "content": {
                "application/json": {
                    "example": {"detail": "Ошибка при сохранении файла: <описание ошибки>"}
                }
            }
        }
    }
)
async def submit_and_upload_feedback(
    category: Annotated[str, Form(description="Категория обратной связи")],
    message: Annotated[str, Form(description="Сообщение обратной связи")],
    file: Annotated[Union[UploadFile, None], File(description="Файл для загрузки")] = None
):
    # Проверка на пустые поля
    if not category or not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Категория и сообщение обязательны для заполнения."
        )

    # Проверка длины сообщения
    if len(message) > 280:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Сообщение не должно превышать 280 символов."
        )

    # Убедимся, что каталог файлов существует
    ensure_file_directory_exists()

    file_path = None
    if file:
        # Сохраняем загруженный файл в FILE_DIRECTORY
        file_path = os.path.join(FILE_DIRECTORY, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка при сохранении файла: {str(e)}"
            )

    # Вставляем запись обратной связи в базу данных
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("BEGIN;")
            cur.execute("""
            INSERT INTO feedback (category, message, file_path)
            VALUES (%s, %s, %s)
            """, (category, message, file_path))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при сохранении данных в базу: {str(e)}"
        )

    return {"detail": "Успешно отправлено!"}

app.include_router(router)