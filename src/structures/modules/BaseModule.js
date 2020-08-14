export default class BaseModule {
    /**
     * @param {Main} main
     */
    constructor(main) {
        this.main = main;
    }

    get config() {
        return this.main.config;
    }

    /**
     * @param {JSON} object
     * @param {boolean} internal If this is the raw register object
     */
    register(instance, object, internal = true) {
        if (typeof object !== 'object') throw new Error('Invalid self assignment, expected object but got different type instead.');

        Object.assign(this, object);

        if (internal) {
            this.instance = instance;

            delete object.category;
            this.rawData = object;
        }
        else if (this.rawData) {
            Object.assign(this.rawData, object);
        }
    }

    getModule(moduleName) {
        return this.main.moduleManager.get(moduleName);
    }
}
