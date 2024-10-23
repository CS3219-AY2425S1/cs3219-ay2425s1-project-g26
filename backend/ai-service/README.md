### Steps to build and run the ai-service code

1. Navigate to the right folder (../backend/ai-service).

2. Enable git lfs and clone the commit with: <br>
`git lfs install`<br>
`git clone https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0`

3. Ensure that the docker-compose.yml file in the directory (/cs3219-ay2425s1-project-g26) for ai-service is:
```
  ai-service:
    image: "cs3219-ay2425s1-project-g26-ai-service:1.0"
    build:
        context: ./backend/ai-service
    ports:
      - "9680:9680"`
```
4. Run the following command to build the service: <br>
 `docker compose up --build`

<br>

The endpoints could be access from http://localhost:9680.

## API Gateways

| Endpoint               | Request Type | Body Fields | Description |
|-------------------------| ------------ |  ---------- |-------------|
| /               | `GET` | * | Get all matches                                           |
| /               | `POST` | query: `str`| Send the query to the language model.  |
