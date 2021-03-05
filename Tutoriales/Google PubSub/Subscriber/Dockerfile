FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
ENV TIMEOUT=3600
ENV API_URL=http://slave:4000
CMD [ "node", "index.js" ]
