import BaseModule from '../structures/modules/BaseModule.js'

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
        const sites = this.config.downloads.sites;

        return sites.rule === 'allow' & !sites.exception.includes(domain);
    }

    setup() {

    }
}
