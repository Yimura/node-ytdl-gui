import fs from 'fs'
import importDir from '@yimura/import-dir'
import { resolve } from 'path'

import BaseModule from '../structures/modules/BaseModule.js'
import { HttpResponseCodes } from '../util/Constants.js'
import log from '../util/Log.js'

export default class RESTRegistrar extends BaseModule {
    /**
     * @param {Main} main
     */
    constructor(main) {
        super(main);

        this.register(RESTRegistrar, {
            name: 'rest',
            requires: [
                'web'
            ],
            events: [
                {
                    mod: 'web',
                    name: 'request',
                    call: '_onRequest'
                }
            ]
        });
    }

    get(apiPath) {
        this._api.get(apiPath);
    }

    /**
     * @private
     * @param {Request} request A request class instance
     */
    async _onRequest(request) {
        const instance = this._api.get(request.url);
        if (!instance) {
            request.res.writeHead(404, { 'Content-Type': 'text/html' });
            request.res.end('<pre>404 - Not Found<br><br>The requested URL was not found on this server.</pre>');

            return;
        }

        const method = request.method.toLowerCase();
        if (typeof instance[method] !== 'function') {
            request.res.writeHead(405, { 'Content-Type': 'text/html' });
            request.res.end('<pre>405 - Method Not Allowed<br><br>The given URL exists but an invalid request method was used.</pre>');

            return;
        }

        try {
            await instance[method](request);
        } catch (e) {
            request.res.writeHead(500, {'Content-Type': 'text/plain'});
            request.res.end(e.stack);
        }
    }

    /**
     * @private
     * @param {string} [parentBit=null] Defaults to an empty string
     */
    async _recursiveRegister(bits, parentBit = '/') {
        for (const bit in bits) {
            if (bits.hasOwnProperty(bit)) {
                if (bits[bit] instanceof Promise) {
                    try {
                        bits[bit] = (await bits[bit]).default;

                        const instance = new bits[bit](this.main);
                        if (instance.disabled) {
                            log.warn('API', `Path disabled: '${parentBit}${bit}/'`);

                            continue;
                        }

                        this._api.set(`${parentBit}${bit == 'index' ? '' : bit + '/'}`, instance);

                        continue;
                    } catch (e) {
                        e.ignore = true;

                        log.warn('API', `The following path: ${parentBit}${bit == 'index' ? '' : bit + '/'}\nGenerated the following error:\n${e.stack}`);
                    }
                }

                await this._recursiveRegister(bits[bit], `${parentBit}${bit}/`);
            }
        }
    }

    async setup() {
        // This will require all commands within this directory
        const rawApi = importDir(resolve('./doc_root/'), { recurse: true, noCache: true });

        /**
         * @type {Map}
         * @private
         */
        this._api = new Map();

        await this._recursiveRegister(rawApi);

        log.info('API', `Mapping of endpoints done with ${this._api.size} endpoints registered.`);
    }
}
