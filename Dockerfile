FROM node:14-alpine

WORKDIR /usr/web

COPY package.json  ./

RUN yarn


COPY . . 

EXPOSE 3000

CMD [ "yarn", "start" ]
