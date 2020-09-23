import BaseModule from '../structures/modules/BaseModule.js'
import path from 'path'
import fs from 'fs'
import mime from 'mime/lite.js'

export default class StaticServe extends BaseModule {
    constructor(main) {
        super(main);

        this.register(StaticServe, {
            name: 'static',
            requires: [
                'rest'
            ]
        });
    }

    /**
     * @private
     * @param {Request} request
     */
    async _404Catch(request) {
        // If the frontend is disabled in the settings we return as if no files were found.
        if (!this.config.api.frontend) return false;

        // Last fallback if for some reason the request managed to slip by
        if (request.url.includes('/api/')) return false;

        const filepath = path.resolve(`./doc_root${request.url === '/' ? '/index.html' : request.originalUrl}`);

        if (!await this._isReadable(filepath)) return false;

        const mimeType = mime.getType(filepath);
        if (!mimeType) return false;

        request.writeHead(200, { 'Content-Type': mimeType });
        fs.readFile(filepath, (err, data) => {
            request.end(data);
        });

        return true;
    }

    /**
     * @param {string} path The path to check if it is readable
     */
    _isReadable(filepath) {
        return new Promise((resolve, reject) => {
            fs.access(filepath, fs.constants.F_OK, (err) => {
                if (err) return resolve(false);

                resolve(true);
            });
        });
    }

    setup() {
        this.getModule('rest')['404'] = (...args) => this._404Catch(...args);
    }
}
