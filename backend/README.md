### Steps to run dockers 

1. Navigate to each service directory (../backend/question-service) and (../backend/user-service)  

2. Install all required packages in both service directories using
<br> `npm i`

3. Start your Docker Daemon (for mine i just open the app and its enough)

4. Navigate to the backend directory (../backend), there should be docker-compose.yml, user-service and question-service. You need
<br> `docker-compose up --build`

5. To stop the services, use CTRL + C