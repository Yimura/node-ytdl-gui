# YouTube Downloader
Project to download YouTube videos in Audio or Video formats

## Requirements

 * NodeJS v14 or higher
 * ffmpeg in path

## Setup

```sh
npm install
```

## Docker

Alternatively there are also docker images available.

To set these up just do the following steps:
```sh
docker pull yimura/ytdl
docker run --init --name ytdl -p 8080:8080 yimura/ytdl
```
That's all, afterwards just visit localhost:8080 and you can start downloading.
