import BasicEndpoint from '../../../src/structures/endpoints/BasicEndpoint.js'
import ytdl from 'youtube-dl'

export default class Info extends BasicEndpoint {
    constructor(main) {
        super(main);
    }

    /**
     * @param {string} url
     */
    getInfo(url) {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(url, (err, info) => {
                if (err) resolve(err);

                resolve(info);
            });
        });
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const url = request.query.get('url');
        if (!url) return request.reject(400);

        const host = new URL(url).hostname;
        if (!this.getModule('settings').isDomainOk(host)) return request.reject(403);

        return request.accept(await this.getInfo(url));
    }
}
