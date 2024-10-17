### Steps to run the server

1. Ensure that rabbitMQ is running
<br> MacOS: `brew services start rabbitmq`
<br> Linux: `systemctl start rabbitmq-server`

2. Navigate to the right folder (../backend/matching-service).

3. Install all required packages using
<br> `npm i`

4. Clone .env.example into .env with
<br> `cp .env.example .env`
<br> If there is no `.env.example` file, first create a file named `.env.example` with the following contents:
    ```
    MONGODB_USERNAME=admin
    MONGODB_PASSWORD=g26password
    MONGODB_ENDPOINT=peerprep.xvavl.mongodb.net
    MONGODB_DB=peerprepMatchingServiceDB  

    RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672
    RABBITMQ_REQ_CH=request
    RABBITMQ_RES_CH=response  
    ```

5. Fire up the backend service
<br> `npm run dev`

<br>

## API Gateways

| Endpoint               | Request Type | Body Fields | Description                                                    |
|------------------------| ------------ |  -- |----------------------------------------------------------------|
| /matches               | `GET` | \* | Get all matches <br>                                           |
| /matches               | `POST` | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Create a new match <br>                                        |
| /matches/{question_id} | `DELETE`     | _id: `str` | Delete match based on ID <br>       |
| /matches/{question_id} | `GET`       | * | Get one match based on ID <br> |