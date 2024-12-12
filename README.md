# Модуль обратной связи для обучающей платформы

## Стек технологий

- **Фронтенд:**
  - Astro
  - React
  - Tailwind CSS
  - TypeScript
  - sonner (для уведомлений)
  - react-hook-form (для управления формами)
  - zod (для валидации данных)

- **Бэкенд:**
  - FastAPI
  - psycopg (для работы с PostgreSQL)
  - dotenv (для загрузки переменных окружения из файла)
  - shutil (для работы с файловой системой)
    
## Запуск (локально)

### Фронтенд
```bash
cd frontend
npm install
npm run dev
```

Фронтенд доступен по адресу [127.0.0.1:4321](http://127.0.0.1:4321)

### Бэкенд
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Бэкенд доступен по адресу [127.0.0.1:8000](http://127.0.0.1:8000)

### Поднятие базы данных локально

Создайте файл .env.development с переменными окружения в корне приложения
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=postgres
PUBLIC_API=http://localhost:8000
```

```bash
docker run --name db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

## Запуска через docker-compose

Создайте файл .env с переменными окружения в корне приложения для деплоя в прод
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=postgres
```

```bash
cd odoo
docker-compose up -d
```

Приложение доступно по адресу [http://localhost/](http://127.0.0.1/)

- Форма на Astro [http://localhost/astro](http://127.0.0.1/astro)
- Форма на React [http://localhost/react](http://127.0.0.1/react)
- API [http://localhost/api/docs](http://127.0.0.1/api/docs)


