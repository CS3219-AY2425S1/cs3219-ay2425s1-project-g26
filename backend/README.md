### Steps to run dockers 

1. Navigate to each service directory (../backend/question-service) and (../backend/user-service)  

2. Install all required packages in both service directories using
<br> `npm i`

3. In each service directory, clone .env.example into .env with
<br> `cp .env.example .env`
<br> More details to do this can be found in the Readme.md files in each of these directories.

4. Start your Docker Daemon (opening the Docker Desktop app should suffice).

5. Navigate to the backend directory (../backend), there should be docker-compose.yml, user-service and question-service. You need
<br> `docker-compose up --build`

6. To stop the services, use CTRL + C.