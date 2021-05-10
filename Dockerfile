FROM node:14

WORKDIR /app

ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json

RUN apt-get update && apt-get install -y git && npm install

ADD ./ /app

RUN npm run build

EXPOSE 80

ENV PORT 80

CMD npm start