import BasicEndpoint from '../../../src/structures/endpoints/BasicEndpoint.js'
import ytpl from 'ytpl'

export default class Playlist extends BasicEndpoint {
    constructor(main) {
        super(main);
    }

    /**
     * @private
     * @param {string} host
     * @param {string} url
     */
    async _getPlaylistData(host, url) {
        switch (host) {
            case 'www.youtube.com': {
                const id = new URLSearchParams(new URL(url).search).get('list');
                if (!id) return null;

                let data;

                try {
                    data = await ytpl(url);
                } catch (e) {
                    return {};
                }

                return data;
            }
            default: {
                return {};
            }
        }
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const url = request.query.get('url');
        if (!url) return request.reject(400);

        const host = new URL(url).hostname;
        if (!this.getModule('settings').isDomainOk(host)) return request.reject(403);

        const data = await this._getPlaylistData(host, url);

        return request.accept(data);
    }
}
