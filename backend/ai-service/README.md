### Steps to build and run the ai-service code

1. Navigate to the main folder (/cs3219-ay2425s1-project-g26).

2. Run the following command to build the services: <br>
 `docker compose up --build`

3. Once the docker container is running, open a new terminal and run the following command: <br>
  `docker exec -it cs3219-ay2425s1-project-g26-ollama-1 ollama pull llama3.2`

4. Wait for the download to complete and the AI service will be ready for use.

<br>

The endpoints could be access from http://localhost:9680.

## API Gateways

| Endpoint               | Request Type | Body Fields | Description |
|-------------------------| ------------ |  ---------- |-------------|
| /               | `GET` | * | Health check. |
| /stream/{query} | `GET` | * | Returns the language model response in a stream.   |
