import Modules from '@/src/Modules.js'
import ytdl from 'youtube-dl'

export default class Info extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/info';
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
        const searchParams = new URLSearchParams(request.searchParams);
        const url = searchParams.get('url');
        if (!url) return request.reject(400);

        const host = new URL(url).hostname;
        if (!this.modules.settings.isDomainOk(host)) return request.reject(403);

        return request.accept(await this.getInfo(url));
    }
}
