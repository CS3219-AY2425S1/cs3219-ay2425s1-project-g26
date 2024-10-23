### Steps to run dockers 

1. Navigate to the service directory (./backend/question-service), (./backend/matching-service) and (./backend/user-service)

2. In each service directory, clone .env.example into .env with
<br> `cp .env.example .env`
<br> More details to do this can be found in the Readme.md files in each of these directories.

5. Navigate to the main directory (/cs3219-ay2425s1-project-g26), there should be docker-compose.yml. You need
<br> `docker-compose up --build`

6. To stop the services, use CTRL + C.