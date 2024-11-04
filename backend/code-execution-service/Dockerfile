FROM node:14

RUN apt-get update && apt-get install -y default-jdk docker.io

RUN mkdir -p /root/.java && chmod -R 777 /root/.java

ENV JAVA_OPTS="-Djava.util.prefs.systemRoot=/root/.java -Djava.util.prefs.userRoot=/root/.java"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8083

CMD ["node", "server.js"]
