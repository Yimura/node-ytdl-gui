import ModuleManager from './manager/ModuleManager.js'
import config from '../data/config.js'

export default class Main {
    moduleManager = new ModuleManager(this);

    constructor() {
        Object.assign(this, {
            config
        });

        this.moduleManager.load();
    }

    getModule(moduleName) {
        return this.moduleManager.get(moduleName);
    }

    /**
     * Cleanup everything nicely
     */
    exit() {
        process.exit(0);
    }
}
