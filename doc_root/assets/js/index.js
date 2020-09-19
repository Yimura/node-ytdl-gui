import Downloader from './Downloader.js'
import Error from './Error.js'
import Helpers from './Helpers.js';

class EntryPoint {
    _downloader = new Downloader(this);
    _error = new Error(this);

    constructor() {

    }

    domLookup() {
        this._form = document.querySelector('form');
        this._form.addEventListener('submit', (e) => this._onEntry(e));
    }

    /**
     * @param {string} message
     */
    error(message) {
        this._error.addError(message);
    }

    /**
     * @param {Event} e
     */
    _onEntry(e) {
        e.preventDefault();

        const data = new FormData(this._form);

        try {
            const url = new URL(data.get('url'));
        }
        catch (e) {
            this.error('Invalid URL given, check if what you copied is correct and try again.');
        }

        this._form.reset();
    }
}

const entryPoint = new EntryPoint();
document.addEventListener('DOMContentLoaded', () => entryPoint.domLookup());
