import Modules from '@/src/Modules.js'
import mime from 'mime/lite.js'
import { extname } from 'path'
import ytdl from 'youtube-dl'

export default class Download extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/dl';
    }

    /**
     * @param {Object} headers
     * @param {number} type
     * @param {Object} info
     */
    _getHeadersAndFormat(headers, type, info) {
        let contentType, fileName, fileSize, format;

        switch (type) {
            case 3: {
                contentType = 'audio/wav';
                fileName = this._replaceExtension(info._filename, '.wav');
                format = 'wav';

                break;
            }
            case 2: {
                contentType = 'audio/ogg';
                fileName = this._replaceExtension(info._filename, '.ogg');
                format = 'ogg';

                break;
            }
            case 1: {
                contentType = 'audio/mpeg';
                fileName = this._replaceExtension(info._filename, '.mp3');
                format = 'mp3';

                break;
            }
            default: {
                contentType = mime.getType(info._filename);
                fileName = info._filename;
                fileSize = info.size;

                break;
            }
        }

        Object.assign(headers, {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename=${fileName};`
        }, fileSize !== undefined ? { 'Content-Length': fileSize } : null);

        return [headers, format];
    }

    _replaceExtension(fileName, newExt) {
        const ext = extname(fileName);
        return fileName.replace(ext, newExt);
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const searchParams = new URLSearchParams(request.searchParams);

        const url = searchParams.get('url');
        if (!url) {
            return request.reject(400);
        }

        // Check if the host is allowed to be downloaded from, if not return 403
        const host = new URL(url).hostname;
        if (!this.modules.settings.isDomainOk(host)) return request.reject(403);

        const type = parseInt(searchParams.get('type')) || 0;

        let readableStream;
        try {
            readableStream = ytdl(url);
        }
        catch(err) {
            return request.reject(500, err.stack);
        }

        readableStream.on('info', _ => {
            const [headers, format] = this._getHeadersAndFormat(request.webserver.getHeaders(request.req), type, _);

            request.writeHead(200, headers);

            if (format) {
                const ffmpeg = this.modules.ffmpeg.toAudio(readableStream, request.res, format);

                ffmpeg.on('error', (err) => {
                    if (err.message === 'Output stream closed') return this.log.info('API_DL', 'Client closed the connection, ignoring "Ouput stream closed" error.');

                    this.log.error('API_DL', 'Ffmpeg download error: ', err);
                });

                ffmpeg.run();

                return;
            }

            readableStream.on('data', request.write.bind(request));
            readableStream.on('error', (e) => {
                this.log.error('API_DL', 'Error while piping stream:', e);
                
                request.end();
            });
            readableStream.on('end', request.end.bind(request));
        });

        return true;
    }
}
