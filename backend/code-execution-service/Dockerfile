FROM node:14

RUN apt-get update && apt-get install -y default-jdk docker.io

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8083

CMD ["node", "server.js"]
