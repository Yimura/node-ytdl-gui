FROM node:bullseye-slim

EXPOSE 8080

WORKDIR /app

RUN apt update && apt install python3 ffmpeg -y
# youtube-dl requires python 2+/3+ and the binary is only present under python3
RUN ln -s $(which python3) /usr/bin/python

COPY package.json .
COPY package-lock.json .

RUN npm i --silent

COPY . .

ENTRYPOINT ["node", "--experimental-loader=./util/loader.js", "."]
