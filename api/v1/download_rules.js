import Modules from '@/src/Modules.js'

export default class Info extends Modules.REST.Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/download_rule';
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const sites = this.config.api.sites;

        return request.accept(sites);
    }
}
