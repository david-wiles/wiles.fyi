FROM node:14-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

EXPOSE 8080

CMD ["npm", "run", "serve"]

