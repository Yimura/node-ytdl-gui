const
    Helpers = require('./helpers.js'),

    fs = require('fs'),
    http = require('http'),
    ytdl = require('ytdl-core');

module.exports = class WebServer extends Helpers {
    constructor() {
        super();

        this.port = 4545;

        this.options = [
            {
                mime: 'video/mp4',
                type: 'highest',
                ext: '.mp4'
            },
            {
                mime: 'video/mp4',
                type: 'lowest',
                ext: '.mp4'
            },
            {
                mime: 'audio/mpeg',
                type: 'highestaudio',
                ext: '.mp3'
            }
        ];
    }

    async inComingRequest(req, res) {
        if (req.method == 'GET') {
            if (!req.url.includes('/dl')) {
                res.writeHead(200, {
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                    'Access-Control-Allow-Origin': 'https://ytdl.pieceof.art',
                    'Content-Type': 'text/html'
                });
                res.end(fs.readFileSync(`${__dirname}/../doc_root/index.html`));

                return;
            }

            const get = this.parseGet(req, res);

            if (!get.v || !get.dltype) {
                res.writeHead(406, {
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                    'Access-Control-Allow-Origin': 'https://ytdl.pieceof.art',
                    'Content-Type': 'plain/html'
                });
                res.end('<pre>406 - Not enough data given to fullfill the request.</pre>');

                return;
            }

            if (ytdl.validateID(get.v)) {
                const
                    dltype = this.options[get.dltype],
                    songData = await ytdl.getInfo(`htts://youtu.be/${get.v}`, { quality: dltype.type});

                const stream = ytdl(`htts://youtu.be/${get.v}`);

                stream.on('response', (response) => {
                    const content_length = response.headers['content-length'];

                    res.writeHead(200, {
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                        'Access-Control-Allow-Origin': 'https://ytdl.pieceof.art',
                        'Content-Type': dltype.mime,
                        'Content-Disposition': `attachment; filename=${songData.title}${dltype.ext};`,
                        'Content-Length': content_length
                    });

                    stream.on('data', (data) => res.write(data));
                    stream.on('end', (data) => res.end());
                });
            }
            else {
                res.writeHead(200, {
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                    'Access-Control-Allow-Origin': 'https://ytdl.pieceof.art',
                    'Content-Type': 'application/json'
                });
                res.end('{"error": "invalid url"}');
            }
        }
        else {
            res.writeHead(405, {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, access_token, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                'Access-Control-Allow-Origin': 'https://ytdl.pieceof.art',
                'Content-Type': 'plain/html'
            });
            res.end('<pre>405 - Method Not Allowed<br><br>The given URL exists but an invalid request method was used.</pre>');

            return;
        }
    }

    startServer() {
        this.server = http.createServer((req, res) => {
            this.inComingRequest(req, res);
        }).listen(this.port, () => {
            console.log('[SERVER] Listening on port ' + this.port);
        });
    }
}
