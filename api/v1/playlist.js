import Modules from '@/src/Modules.js'
import ytpl from '@distube/ytpl'

export default class Playlist extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/playlist';
    }

    /**
     * @private
     * @param {string} host
     * @param {string} url
     */
    _getPlaylistData(host, url) {
        switch (host) {
            case 'www.youtube.com': {
                const id = new URLSearchParams(new URL(url).search).get('list');
                if (!id) return null;

                try {
                    return ytpl(url);
                } catch (e) {
                    return {};
                }
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
        const searchParams = new URLSearchParams(request.searchParams);
        const url = searchParams.get('url');
        if (!url) return request.reject(400);

        const host = new URL(url).hostname;
        if (!this.modules.settings.isDomainOk(host)) return request.reject(403);

        const data = await this._getPlaylistData(host, url);

        return request.accept(data);
    }
}
