export default class BasicEndpoint {
    constructor(main) {
        this.main = main;
    }

    get config() {
        return this.main.config;
    }

    /**
     * @param {string} moduleName
     */
    getModule(moduleName) {
        return this.main.moduleManager.get(moduleName);
    }
}
