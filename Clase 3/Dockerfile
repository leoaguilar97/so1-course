
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

RUN mkdir -p /elements/procs

CMD [ "node", "server.js" ]
