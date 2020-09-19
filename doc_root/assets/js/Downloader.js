import Data from './Data.js'

export default class Downloader {
    constructor(entry) {
        this._m = entry;
    }

    downloadUrl(url) {
        const dlElement = document.createElement('a');

        dlElement.setAttribute('download', '');
        dlElement.setAttribute('href', url);
        dlElement.setAttribute('hidden', '');

        document.body.appendChild(dlElement);

        dlElement.click();
        dlElement.remove();
    }
}
