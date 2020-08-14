FROM node:14-buster

EXPOSE 8080

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN apt update && apt install python3 ffmpeg -y

RUN npm i

COPY . .

ENTRYPOINT ["node", "."]
