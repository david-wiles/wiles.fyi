FROM node:14-alpine

WORKDIR /usr/src/app

RUN npm install -g http-server

COPY ./www ./www

EXPOSE 8080

CMD ["npm", "run", "serve", "www"]

