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
                if (this.router.activeClass instanceof Download) break;

                this.router.loading();

                const url = this.router.query.get('url');

                const res = await API.info(url);

                if (res.ok) {
                    const data = await res.json();

                    const download = new Download(this, url, data);
                    this.router.activeClass = download;

                    await this.router.navigate('/#/download?url='+encodeURIComponent(url), 'Download your poison.');

                    download.domLookup();

                    break;
                }

                if (res.status === 403) {
                    this.error(CommonError['BLOCKED_HOST']);

                    break;
                }

                this.error('Unknown Error Occured!');

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
