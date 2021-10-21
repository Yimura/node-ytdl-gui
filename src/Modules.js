import ImportDir from '@yimura/import-dir'
import log from './util/Log.js'

/**
* @param {Object} target The Object/Class/Function to be proxied
* @param {string} prop The property being accessed
* @param {Object} receiver Either the proxy or an object that inherits from the proxy
*/
const get = (target, prop, receiver) => {
   if (typeof target[prop] !== 'undefined') return target[prop];
   return target.get(prop);
}

class ModuleProxy {
    constructor() {
        return new Proxy(this, {
            get
        });
    }
}

class PrivateModuleManager extends ModuleProxy {
    _cache = new Map();
    _scope = new Map();

    constructor() {
        super();
    }

    /**
     * Register a module that has a scope defined
     * @param {Object} instance The instance to register
     */
    addScoped(instance) {
        const { group, name } = instance.scope;

        const scope = this.getScope(group, true);
        if (scope.has(name)) {
            log.error('MODULES', `Duplicate scoped module name error, module "${instance.name}" with scope name "${name}"`);

            return;
        }

        scope.set(name, instance);
    }

    /**
     * Notifies the modules that contain a cleanup method to remove
     */
    async cleanup() {
        for (const module of this._cache.values())
            if (typeof module.cleanup == 'function') await module.cleanup();
    }

    /**
     * Get a module by its name/identifier
     * @param {string} moduleName Name/Identifier of the module
     * @returns The module instance
     */
    get(moduleName) {
        return this._cache.get(moduleName);
    }

    /**
     * Get the group holding modules
     * @param {string} scopeName The scope name that holds those Modules
     * @param {boolean} create If the group should be create if it doesn't exist
     * @returns {Map} The map holding the modules
     */
    getScope(scopeName, create = false) {
        if (!this._scope.has(scopeName) && create)
            this._scope.set(scopeName, new Map());
        return this._scope.get(scopeName);
    }

    /**
     * Get a module from a group
     * @param {string} scopeName The scope name that holds the requested module
     * @param {string} moduleName The name/identifier of the module
     * @returns The module instance from that scope
     */
    getFromScope(scopeName, moduleName) {
        return this.getGroup(scopeName)?.get(moduleName);
    }

    /**
     * Returns if the module name is registered
     * @param {string} moduleName The name/identifier of the module
     * @returns {boolean} True if it exists, false if not
     */
    has(moduleName) {
        return this._cache.has(moduleName);
    }

    /**
     * Loads the modules from a given path
     * @param {Object} main General data to pass to all modules
     * @param {string} path The path from which the modules should be loaded
     */
    async load(main, path) {
        const modules = ImportDir(path, { recurse: true, recurseDepth: 1 });
        
        await this.registerModules(main, modules);
        await this.initModules(main);
    }

    async initModules(main) {
        for (const [ name, instance ] of this._cache) {
            if (instance.requires) {
                for (const requirement of instance.requires) {
                    if (!this.has(requirement)) {
                        log.error('MODULES', `Module "${name}" has an unmet requirement "${requirement}"`);
                    }
                }
            }

            if (instance.events) {
                for (const _event of instance.events) {
                    if (_event.mod) {
                        const mod = this._cache.get(_event.mod);
                        if (mod) {
                            mod.on(_event.name, instance[_event.call].bind(instance));

                            continue;
                        }
                    }

                    if (typeof main.on === 'function') main.on(_event.name, instance[_event.call].bind(instance));
                }
            }
        }

        for (const instance of this._cache.values()) {
            if (typeof instance.init === 'function' && !await instance.init())
                log.error('MODULES', `Module "${instance.name}" failed to initialise.`);
        }
    }

    async registerModules(main, modules, parentName = 'root') {
        for (const bit in modules) {
            if (modules[bit] instanceof Promise) {
                try {
                    modules[bit] = (await modules[bit]).default;
                } catch (e) {
                    log.error('MODULES', `An error occurred while importing ${parentName}`, e);

                    continue;
                }

                try {
                    const instance = new modules[bit](main);
                    if (instance.disabled) {
                        log.warn('MODULES', `Module disabled: ${instance.name}`);

                        continue;
                    }

                    if (this.has(instance.name)) {
                        log.warn('MODULES', `Duplicate module "${instance.name}", not registered...`);

                        continue;
                    }

                    this._cache.set(instance.name, instance);

                    if (instance.scope) this.addScoped(instance);
                } catch (e) {
                    log.error('MODULES', `Failed to setup module "${parentName}", error:`, e);
                }

                continue;
            }

            await this.registerModules(main, modules[bit], bit);
        }
    }
}

class ModuleManager {
    static _instance;

    constructor() {
        throw new Error("Can't initialize ModuleManager directly...");
    }

    /**
     * @returns {PrivateModuleManager}
     */
    static getInstance() {
        if (!ModuleManager._instance) ModuleManager._instance = new PrivateModuleManager();
        return ModuleManager._instance;
    }
}

export default ModuleManager.getInstance();