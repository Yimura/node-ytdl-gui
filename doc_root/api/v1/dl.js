import fs from 'fs'
import { extname } from 'path'
import ytdl from 'youtube-dl'

import BasicEndpoint from '../../../src/structures/endpoints/BasicEndpoint.js'
import log from '../../../src/util/Log.js'

export default class Download extends BasicEndpoint {
    constructor(main) {
        super(main);
    }

    get ffmpeg() {
        return this.getModule('ffmpeg');
    }

    _replaceExtension(fileName, newExt) {
        const ext = extname(fileName);
        return fileName.replace(ext, newExt);
    }

    /**
     * @param {JSON} headers
     * @param {number} type
     * @param {fs.readableStream} stream
     * @param {JSON} info
     */
    _processType(headers, type, stream, info) {
        let contentType;
        let fileName;
        let fileSize;

        switch (type) {
            case 2: {
                contentType = 'audio/ogg';
                fileName = this._replaceExtension(info._filename, '.ogg');

                stream = this.ffmpeg.toAudio(stream, 'ogg');

                break;
            }
            case 1: {
                contentType = 'audio/mpeg';
                fileName = this._replaceExtension(info._filename, '.mp3');

                stream = this.ffmpeg.toAudio(stream);

                break;
            }
            default: {
                contentType = 'video/mp4';
                fileName = info._filename;
                fileSize = info.size;

                break;
            }
        }

        Object.assign(headers, {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename=${fileName};`
        }, fileSize !== undefined ?? { 'Content-Length': fileSize });

        return [stream, headers];
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const data = request.query;

        if (!data.get('url')) {
            return request.reject(400);
        }

        const url = data.get('url');
        const type = parseInt(data.get('type')) || 0;

        let stream;
        try {
            stream = ytdl(url);
        }
        catch(err) {
            return request.reject(500, err.stack);
        }

        stream.on('info', (info) => {
            let headers;
            [stream, headers] = this._processType(
                request.webserver.getHeaders(request.req),
                type,
                stream,
                info
            );

            request.writeHead(200, headers);
            stream.on('data', (data) => request.write(data));
            stream.on('error', (err) => {
                stream.destroy();

                log.error('API_DL', 'Error occured with stream:', err);
            });
            stream.once('end', () => {
                stream.removeAllListeners();
                request.end();
            });
        });

        stream.on('error', (err) => {
            log.error('API_DL', 'Error occured with stream:', err);
        });
        stream.on('end', () => stream.removeAllListeners());

        return true;
    }
}
