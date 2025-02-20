# Используем официальный образ Python
FROM python:3.12-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл requirements.txt в контейнер
COPY backend/requirements.txt /app/requirements.txt

# Устанавливаем зависимости
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# Копируем весь проект в контейнер
COPY backend/ /app/

# Открываем порт 5000
EXPOSE 5000

# Команда для запуска приложения
CMD ["python", "app.py"]
