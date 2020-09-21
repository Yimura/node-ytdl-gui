import Data from './Data.js'

export default class API {
    constructor() {

    }

    /**
     * @param {string} url
     * @param {number} type
     * @returns {string} The download url for the requested URL
     */
    static dl(url, type) {
        const search = new URLSearchParams({ url, type });

        url = new URL(window.location.origin);

        url.pathname = '/api/v1/dl/';
        url.search = search;

        return url.toString();
    }

    /**
     * @returns {Promise<Response>} An object containing the download rules set by the server
     */
    static download_rule() {
        return Data.get('/api/v1/download_rule/');
    }

    /**
     * @param {string} url
     * @returns {Promise<Response>} An info object returned by the YouTube-DL binary
     */
    static info(url) {
        return Data.get('/api/v1/info/', { url });
    }

    /**
     * @param {string} id
     * @returns {Promise<Response>} A YouTube playlist
     */
    static playlist(id) {
        return Data.get('/api/v1/playlist/', { id });
    }
}
