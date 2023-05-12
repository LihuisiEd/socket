FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.6.6

COPY . .

CMD [ "node", "server.js" ]
