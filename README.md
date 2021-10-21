# YouTube Downloader
Download YTDL supported Video's and convert them to audio if you want to.

## Requirements

 * NodeJS v14 or higher
 * ffmpeg and python in path

### Minimum Hardware

 * 1 CPU core (application will scale automatically)
 * 40MB RAM (idle)
 * 400MB RAM (when streaming a download)

## Setup

```sh
npm install
```

## Config

For personal use one thread is what you're best off setting, as it is nearly impossible to use more than one.
ffmpeg is optimised to take advantage of multiple threads, so changing this setting will not affect ffmpeg.

```js
export default {
    api: {
        // If the frontend should be enabled, disable this when using your own frontend
        frontend: true,
        sites: {
            // You can restrict from which domains people can download
            // There are two modes available "allow" and "deny".
            // When using allow, by default all domains are allowed and exceptions are blocked.
            // With deny, all domains are blocked and only exceptions can be downloaded from.
            rule: 'allow', // allow or deny
            exception: ['vimeo.com']
        }
    },
    cluster: {
        // By default, the webserver will be clustered in the same amount of Logical Cores available.
        // You can overwrite the automated mode and set the amount of threads the webserver should use.
        threads: 'auto' // a number is expected or "auto"
    },
    webserver: {
        // Change the port of the web server, don't change this for the docker container as you'll have to adapt it there as well.
        port: 8080,

        // All of the below are advanced options and should only be modified if you know what you are doing.
        allow_headers: [
            'Authorization',
            'Access-Control-Allow-Headers',
            'Origin',
            'Accept',
            'Content-Type',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ],
        allow_methods: [
            'GET',
            'HEAD',
            'PUT',
            'PATCH',
            'POST',
            'DELETE'
        ],
        origins: [
            'http://localhost:8080',
            'http://127.0.0.1:8080'
        ]
    }
}
```

## Docker

Alternatively there are also docker images available.

To set these up just do the following steps:
```sh
docker pull yimura/ytdl
docker run --init --name ytdl -p 8080:8080 yimura/ytdl
```
That's all, afterwards just visit localhost:8080 and you can start downloading.
