import Data from './Data.js'

export default class Router {
    _cache = new Map();
    _ready = false;

    constructor(entry) {
        this._m = entry;
    }

    /**
     * @param {string} path
     */
    _getBasePath(path) {
        if (path != null) {
            history.replaceState(null, '', path);

            path = this._getHash(path.substr(1));
        }
        else path = this._getHash();

        if (!path || path === '') {
            path = '/main';
        }
        return path;
    }

    /**
     * @param {string} path
     */
    _getFilePath(path) {
        return `/assets/content${path}.html`;
    }

    /**
     * @param {string} [path=null]
     */
    _getHash(path = null) {
        const url = (path ? path : window.location.hash).split('?');

        this.route = url[0].substr(1);
        this.query = new URLSearchParams(url[1]);

        return this.route;
    }

    loading() {
        // Loading Icon
        if (this._ready) this._m.main.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
    }

    async prepare(path) {
        this.loading();

        path = this._getBasePath(path);

        const filePath = this._getFilePath(path);
        if (!this._cache.has(filePath)) {
            const res = await Data.get(filePath);

            this._cache.set(filePath, await res.text());
        }
        return [path, filePath];
    }

    async navigate(path = null, title = document.title) {
        let filePath;
        [path, filePath] = await this.prepare(path);

        let content = this._cache.get(filePath);

        if (!this._ready) return this._readyPath = { path, title };

        this._m.main.innerHTML = content;
        document.title = title;

        this._m.main.scrollTo(0,0, 'smooth');

        if (typeof this.onChange === 'function') this.onChange(path);
    }

    routeClick(e) {
        const el = e.target;

        this.navigate(`${el.pathname}${el.hash}`, el.dataset.title);
    }

    setReady() {
        this._ready = true;

        if (this._readyPath) {
            const { path, title } = this._readyPath;
            delete this._readyPath;

            this.navigate(path, title);
        }
    }
}
