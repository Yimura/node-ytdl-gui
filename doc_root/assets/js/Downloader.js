import API from './Api.js'
import Data from './Data.js'
import Download from './Download.js'
import Playlist from './Playlist.js'
import { CommonError, PlaylistHosts } from './Constants.js'

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
    async prepare(url) {
        const hostname = url.hostname;

        const promises = [];

        for (const playlistHost of PlaylistHosts) {
            if (hostname === playlistHost.host && url.href.includes(playlistHost.check)) {
                promises.push(API.playlist(url));
                promises.push(this._m.router.prepare('/#/playlist'));

                const [res] = await Promise.all(promises);

                if (res.ok) {
                    const data = await res.json();

                    const playlist = new Playlist(this._m, url, data);
                    this._m.router.activeClass = playlist;

                    await this._m.router.navigate('/#/playlist?url='+encodeURIComponent(url), 'Download a playlist.');

                    playlist.domLookup();

                    return;
                }

                if (res.status) {
                    this._m.error(CommonError['BLOCKED_HOST']);

                    return;
                }

                this._m.error(CommonError['UNKNOWN']);

                return;
            }
        }

        promises.push(API.info(url));
        promises.push(this._m.router.prepare('/#/download'));

        const [res] = await Promise.all(promises);

        if (res.ok) {
            // reset promise array
            promises.length = 0;

            const data = await res.json();

            const download = new Download(this._m, url, data);
            this._m.router.activeClass = download;

            await this._m.router.navigate('/#/download?url='+encodeURIComponent(url), 'Download your poison.');

            download.domLookup();

            return;
        }

        if (res.status === 403) {
            this._m.error(CommonError['BLOCKED_HOST']);
        }

        this._m.error(CommonError['UNKNOWN']);
    }
}
