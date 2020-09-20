import Data from './Data.js'
import { PlaylistHosts } from './Constants.js'

export default class Downloader {
    constructor(entry) {
        this._m = entry;
    }

    /**
     * @param {URL} url
     */
    downloadUrl(url) {
        const dlElement = document.createElement('a');

        dlElement.setAttribute('download', '');
        dlElement.setAttribute('href', url);
        dlElement.setAttribute('hidden', '');

        document.body.appendChild(dlElement);

        dlElement.click();
        dlElement.remove();
    }

    /**
     * @param {URL} url
     */
    prepare(url) {
        const hostname = url.hostname;

        for (const playlistHost of PlaylistHosts) {
            if (hostname === playlistHost.host && url.href.includes(playlistHost.check)) {
                this._m.router.navigate('/#/playlist?url='+url, 'Download a playlist.');

                return;
            }
        }

        this._m.router.navigate('/#/download?url='+url, 'Download your poison.');
    }
}
