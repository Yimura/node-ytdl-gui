import Data from './Data.js'

export default class Router {
    _cache = new Map();
    _ready = false;

    constructor(entry) {
        this._m = entry;
    }

    _getHash(path = null) {
        const url = (path ? path : window.location.hash).split('?');

        this.route = url[0].substr(1);
        this.query = new URLSearchParams(url[1]);

        return this.route;
    }

    async navigate(path = null, title = document.title) {
        if (path != null) {
            history.replaceState(null, '', path);

            path = this._getHash(path.substr(1));
        }
        else path = this._getHash();

        if (!path || path === '') {
            path = '/main';
            title = 'Download Video/Audio from websites.';
        }

        const filePath = `/assets/content${path}.html`;

        let content;
        if (this._cache.has(filePath)) {
            console.log('[ROUTER] Loaded content from cache.');

            content = this._cache.get(filePath);
        }
        else {
            console.log('[ROUTER] Loading content from server.');

            const res = await Data.get(filePath);

            content = await res.text();
            this._cache.set(filePath, content);
        }

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
