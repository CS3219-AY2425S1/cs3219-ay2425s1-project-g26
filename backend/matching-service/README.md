### Steps to run the server

1. Navigate to the right folder (../backend/matching-service).

2. Install all required packages using
<br> `npm i`

3. Clone .env.example into .env with
<br> `cp .env.example .env`
<br> If there is no `.env.example` file, first create a file named `.env.example` with the following contents:
    ```
    MONGODB_USERNAME=admin
    MONGODB_PASSWORD=g26password
    MONGODB_ENDPOINT=peerprep.xvavl.mongodb.net
    MONGODB_DB=peerprepMatchingServiceDB

    ```

4. Fire up the backend service
<br> `npm run dev`
