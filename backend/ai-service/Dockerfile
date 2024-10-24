FROM python:3.12.7-slim

WORKDIR /

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9680

CMD ["python", "-u", "main.py"]
