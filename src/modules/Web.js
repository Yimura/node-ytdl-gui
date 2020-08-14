import EventModule from '../structures/modules/EventModule.js'
import WebServer from './web/Server.js'

export default class Web extends EventModule {
    /**
     * @param {Main} main
     */
    constructor(main) {
        super(main);

        this.register(WebServer, {
            name: 'web'
        });
    }

    setup() {
        this._s = new WebServer(this);
    }
}
