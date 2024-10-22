FROM python:3.12.7-slim

WORKDIR /

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9680

CMD ["python", "main.py"]

HEALTHCHECK --interval=99999s --timeout=10s --start-period=10s --retries=1 \
CMD curl -s http://localhost:9680/
