FROM node:14

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y default-jdk

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8083

CMD ["node", "server.js"]
