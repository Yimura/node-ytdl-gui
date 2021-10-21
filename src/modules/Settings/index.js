import BaseModule from './structures/BaseModule.js'

export default class Settings extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Settings, {
            name: 'settings'
        });
    }

    /**
     * @param {string} domain
     */
    isDomainOk(domain) {
        const sites = this.config.api.sites;

        return sites.exception.includes(domain) ? sites.rule !== 'allow' : sites.rule === 'allow';
    }
}