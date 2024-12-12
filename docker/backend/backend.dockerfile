FROM python:3.13

WORKDIR /app

COPY ./backend/requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./backend /app

EXPOSE 8000
