import Download from './Download.js'
import Downloader from './Downloader.js'
import Error from './Error.js'
import Helpers from './Helpers.js'
import Router from './Router.js'

class EntryPoint {
    _error = new Error(this);
    downloader = new Downloader(this);
    router = new Router(this);

    constructor() {
        this.router.navigate();

        this.router.onChange = (path) => this._pathChange(path);
    }

    domLookup() {
        this.main = document.querySelector('.main');

        this.routes = document.querySelectorAll('.routing a');
        this.routes.forEach((route) => route.addEventListener('click', (e) => {
            e.preventDefault();

            this.router.routeClick(e);
        }));

        this.router.setReady();
    }

    /**
     * @param {string} message
     */
    error(message) {
        this._error.addError(message);
    }

    /**
     * @private
     * @param {string} path
     */
    _pathChange(path) {
        switch (path) {
            case '/main': {
                this._form = document.querySelector('form');
                this._form.addEventListener('submit', (e) => this._onEntry(e));

                break;
            }
            case '/download': {


                break;
            }
            case '/advanced': {

                break;
            }
        }
    }

    /**
     * @private
     * @param {Event} e
     */
    _onEntry(e) {
        e.preventDefault();

        const data = new FormData(this._form);

        try {
            const url = new URL(data.get('url'));

            this._downloader.prepare(url);
        }
        catch (e) {
            this.error('Invalid URL given, check if what you copied is correct and try again.');
        }

        this._form.reset();
    }
}

const entryPoint = new EntryPoint();
document.addEventListener('DOMContentLoaded', () => entryPoint.domLookup());
