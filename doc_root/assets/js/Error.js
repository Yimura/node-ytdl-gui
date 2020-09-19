const timeout = 5e3;

export default class Error {
    _queue = [];

    constructor(entry) {
        this._m = entry;
    }

    /**
     * @param {string} message
     */
    addError(message) {
        this._queue.push(message);

        if (this._queue.length > 1) return;

        this._run();
    }

    _createLogElement() {
        this._logElement = document.createElement('pre');
        this._logElement.setAttribute('class', 'logging');

        const codeElement = document.createElement('code');
        this._logElement.appendChild(codeElement);
        this._logElement.inner = this._logElement.firstChild.innerHTML;

        document.body.appendChild(this._logElement);
    }

    /**
     * @private
     */
    _run() {
        if (this._queue.length === 0) return;

        if (this._logElement) {
            this._logElement.remove()

            this._logElement = null;
        }
        this._createLogElement();

        this._logElement.firstChild.innerHTML = this._queue[0];

        setTimeout(() => {
            this._queue.shift();

            this._run();
        }, timeout);
    }
}
