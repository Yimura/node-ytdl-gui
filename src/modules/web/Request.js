import { HttpResponseCodes } from '../../util/Constants.js'

export default class Request {
    /**
     * @param {WebServer} webserver
     * @param {https.IncomingMessage} req
     * @param {https.ServerResponse} res
     */
    constructor(webserver, req, res) {
        this.webserver = webserver;
        this.req = req;
        this.res = res;
    }

    end(...args) {
        return this.res.end(...args);
    }

    writeHead(...args) {
        return this.res.writeHead(...args);
    }

    write(...args) {
        return this.res.write(...args);
    }

    get json() {
        if (this._json) {
            return this._json;
        }
        return new Promise((resolve, reject) => {
            let body = '';

            this.req.on('data', (data) => {
                body += data;
            });

            this.req.on('end', () => {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    body = null;
                }

                resolve(body);

                this._json = body;
            });
        });
    }

    get method() {
        return this.req.method;
    }

    get originalUrl() {
        return this.req.url;
    }

    get query() {
        if (!this._query) {
            const q = new URLSearchParams(this.originalUrl.split('?')[1]);

            this._query = q;
        }
        return this._query;
    }

    get urlData() {
        if (!this._urlData) {
            const split_url = this.req.url.split('/');
            let urlData = {};

            for (let i = 2; i < split_url.length; i+2) {
                if (IsNan(split_url[i+1])) {
                    i--;

                    continue;
                }

                urlData[split_url[i]] = split_url[i+1];
            }

            this._urlData = urlData;
        }
        return this._urlData
    }

    get url() {
        if (!this._url) {
            this._url = this.req.url.replace(/[0-9]{3,64}/g, '').split('?')[0];
        }
        return this._url;
    }

    mergeHeaders(...args) {
        return Object.assign({}, ...args);
    }

    /**
     * @param {string} name
     */
    getHeader(name) {
        return this.req.headers[name];
    }

    /**
     * @param {JSON|string} [data=''] The data to send
     * @param {number} [httpCode=200] The httpCode to send
     */
    accept(data = '', httpCode = 200) {
        if (httpCode < 200 || httpCode > 299) {
            throw new Error('Request#accept only uses http codes in the 200 range.');

            return false;
        }

        const headers = this.webserver.getHeaders(this.req);

        if (data instanceof Object) {
            headers['Content-Type'] = 'application/json';
            data = JSON.stringify(data);
        }

        this.res.writeHead(httpCode, headers);
        this.res.end(data);

        return true;
    }

    /**
     * @param {number} httpCode The response code to return with the rejected request
     * @param {JSON|string} [message=null]
     */
    reject(httpCode, message = null) {
        if (httpCode === 500) {
            if (!message) {
                throw new Error('A message needs to be passed with an error 500.');

                return ths.reject(500, 'The error body did not contain any data.');
            }

            const headers = this.webserver.getHeaders(this.req);

            if (message instanceof Object) {
                headers['Content-Type'] = 'application/json';
                message = JSON.stringify(message);
            }

            this.res.writeHead(500, headers);
            this.res.end(message);

            return true;
        }

        if (!HttpResponseCodes[httpCode]) {
            throw new Error('Unknown httpCode, you will need to define it first before using it.');

            return this.reject(500, 'While processing a client side error code another exception occured server side.');
        }

        const headers = this.mergeHeaders(
            this.webserver.getHeaders(this.req),
            {'Content-Type': 'application/json'}
        );

        this.res.writeHead(httpCode, headers);
        this.res.end(JSON.stringify(HttpResponseCodes[httpCode]));
    }
}
