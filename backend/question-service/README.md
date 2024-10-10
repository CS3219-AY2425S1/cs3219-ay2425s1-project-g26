### Steps to run the server

1. Navigate to the right folder (../backend/question-service).

2. Install all required packages using
<br> `npm i`

3. Clone .env.example into .env with
<br> `cp .env.example .env`
<br> If there is no `.env.example` file, first create a file named `.env.example` with the following contents:
    ```
    MONGODB_USERNAME=admin
    MONGODB_PASSWORD=g26password
    MONGODB_ENDPOINT=peerprep.xvavl.mongodb.net
    MONGODB_DB=peerprepQuestionServiceDB    
    ```

4. Fire up the backend service
<br> `npm run dev`


<br>

## API Gateways

| Endpoint          | Request Type | Body Fields |    Description  |
| ----------------- | ------------ |  -- | -- |
| /questions | `GET` | \* | Get all questions <br> *Users need to be authenticated* |
| /questions         | `POST` | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Create a new question <br>  *Only available to admin* |
| /questions/{question_id} | `PUT` | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Update question based on ID <br> *Only available to admin* |
| /questions/{question_id} | `DELETE`     | _id: `str` | Delete question based on ID <br> *Only available to admin* |
| /questions/{question_id} | `GET`       | * | Get one question based on ID <br> *Users need to be authenticated* |


All the API calls requires a JWT Bearer token in the header:
- Required Header Field: `Authorization: Bearer <JWT_ACCESS_TOKEN>`