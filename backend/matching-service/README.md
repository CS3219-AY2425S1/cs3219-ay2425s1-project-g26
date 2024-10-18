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

    RABBITMQ_URI=amqp://guest:guest@localhost:5672
    RABBITMQ_REQ_CH=request
    RABBITMQ_RES_CH=response  
    ```

5. Fire up the backend service
<br> `npm run dev`

<br>

## API Gateways

| Endpoint               | Request Type | Body Fields | Description                                                    |
|------------------------| ------------ |  -- |----------------------------------------------------------------|
| /matches               | `GET` | * | Get all matches <br>                                           |
| /matches               | `POST` | id: `str`<br>category: `Array`<br>complexity: `str` | Start the matching process. <br>                                        |
| /matches/{user_id} | `DELETE`     | * | Cancel the matching process based on ID. <br>       |
| /matches/{user_id} | `GET`       | * | Get all matched records from a user. <br> |