export default class Data {
    constructor() {

    }

    static _getUrl(string) {
        let request = null;
        try {
            request = new URL(string);
        } catch (e) {
            request = new URL(`${window.location.origin}${string}`)
        }

        return request;
    }

    /**
     * @param {String} url A valid url
     * @param {Object} data Json object to POST
     * @param {Object} headers Custom object of headers
     */
    static async delete(url, data = {}, headers = { 'Content-Type': 'application/json' }) {
        url = Data._getUrl(url);

        return fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: headers,
            redirect: 'follow',
            body: JSON.stringify(data)
        });
    }

    /**
     * @param {String} url A valid url
     * @param {Object} params Object of GET params
     * @param {Object} headers Custom object of headers
     */
    static async get(url, params = null, headers = { 'Content-Type': 'application/json' }) {
        url = Data._getUrl(url);

        const settings = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: headers,
            redirect: 'follow'
        };

        if (params) {
            url.search = new URLSearchParams(params);
        }

        return fetch(url, settings);
    }

    /**
     * @param {String} url A valid url
     * @param {Object} data Json object to POST
     * @param {Object} headers Custom object of headers
     */
    static async post(url, data = {}, headers = { 'Content-Type': 'application/json' }) {
        url = Data._getUrl(url);

        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: headers,
            redirect: 'follow',
            body: JSON.stringify(data)
        });
    }

    static async put(url, data = {}, headers = { 'Content-Type': 'application/json' }) {
        url = Data._getUrl(url);

        return fetch(url, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: headers,
            redirect: 'follow',
            body: JSON.stringify(data)
        });
    }

}
