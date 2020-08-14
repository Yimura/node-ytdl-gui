import fs from 'fs'
import http from 'http'
import log from '../../util/Log.js'
import { reduceFun } from '../../util/Constants.js'
import Request from './Request.js'

const port = 8080;

export default class WebServer {
    /**
     * @param {Web} web
     */
    constructor(web) {
        this._parent = web;
        this.config = web.config.web;

        this._start();
    }

    /**
     * @param {https.IncomingMessage} req
     */
    getHeaders(req) {
        return {
            'Access-Control-Allow-Credentials': false,
            'Access-Control-Allow-Headers': this.config.allow_headers.reduce(reduceFun, ''),
            'Access-Control-Allow-Methods': this.config.allow_methods.reduce(reduceFun, ''),
            'Access-Control-Allow-Origin': this._matchOrigin(req.headers.origin),
        };
    }

    /**
     * @private
     * @param {https.IncomingMessage} req
     * @param {https.ServerResponse} res
     */
    _handlePreflight(req, res) {
        const method = req?.method.toUpperCase();

        if (method === 'OPTIONS') {
            res.writeHead(204, this.getHeaders(req));
            res.end();

            return true;
        }
        return false;
    }

    /**
     * @private
     * @param {https.IncomingMessage} req
     * @param {https.ServerResponse} res
     */
    _handleRequest(req, res) {
        if (this._handlePreflight(req, res)) return;

        const request = new Request(this, req, res);
        this._parent.emit('request', request);
    }

    /**
     * @private
     * @param {string} origin
     */
    _matchOrigin(origin) {
        if (this.config.origins.includes(origin)) {
            return origin;
        }
        return this.config.origins[0];
    }

    /**
     * @private
     */
    _start() {
        this.server = http.createServer(
            this._options,
            async (req, res) => this._handleRequest(req, res)
        ).listen(port);

        log.info('WEB_SERVER', `Listening on internal port: ${port}`);
    }
}
