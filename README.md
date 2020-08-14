# YouTube Downloader
Download YTDL supported Video's and convert them to audio if you want to.

## Requirements

 * NodeJS v14 or higher
 * ffmpeg in path

## Setup

```sh
npm install
```

## Config

By default, the webserver will be clustered in the same amount of Logical Cores available. You can overwrite the automated mode and set the amount of threads the webserver should use.

Modify the `data/config.js` file and look for cluster.threads and modify this with the number of threads you would like to use, for personal use you have more than enough with one thread.

## Docker

Alternatively there are also docker images available.

To set these up just do the following steps:
```sh
docker pull yimura/ytdl
docker run --init --name ytdl -p 8080:8080 yimura/ytdl
```
That's all, afterwards just visit localhost:8080 and you can start downloading.
