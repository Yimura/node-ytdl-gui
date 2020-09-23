import API from './Api.js'
import { asyncDelay } from './Util.js'

export default class Playlist {
    _activeSingleDownloads = 0;
    _cache = new Map();
    _isPlaylistDownloadActive = false;

    constructor(entry, url, data) {
        this._m = entry;

        this._url = url;
        this._data = data;
    }

    domLookup() {
        this._title = document.querySelector('.playlist-info > h5');
        this._description = document.querySelector('.playlist-info > p');

        this._downloadAll = document.querySelector('.playlist-info > form');
        this._downloadAll.addEventListener('submit', (e) => this._startDownloadQueue(e));

        this._list = document.querySelector('.playlist-info > table > tbody');

        this._render();
    }

    /**
     * @private
     * @param {Event} e
     * @param {Element} form
     */
    _downloadSingle(e, form) {
        e.preventDefault();

        if (this._isPlaylistDownloadActive) return this._m.error('You can\'t download single video\'s while a playlist download is in progress.');

        if (this._activeSingleDownloads > 3) return this._m.error('There are already 3 downloads busy, please wait.');

        this._activeSingleDownloads++;

        const data = new FormData(form);
        const url = data.get('url');
        const type = data.get('type');

        if (this._cache.has(url)) {
            const check = this._cache.get(url);
            if (check === type) {
                return this._m.error('You already downloaded this video as that type.');
            }
        }

        this._cache.set(url, type);

        const dlUrl = API.dl(data.get('url'), data.get('type'));

        this._m.downloader.downloadUrl(dlUrl);

        setTimeout(() => {
            this._activeSingleDownloads--;
        }, 15e3);
    }

    _render() {
        this._title.innerHTML = this._data.title;
        this._description.innerHTML = this._data.description;

        this._data.items.forEach((item, i) => {
            const html =
            `<tr>
                <td>${i+1}</td>
                <td>
                    <img src="${item.thumbnail}" alt="">
                </td>
                <td>
                    <p>${item.title}</p>
                </td>
                <td>
                    <form id="${item.id}" class="" action="" method="post">
                        <input type="text" name="url" value="https://youtu.be/${item.id}" hidden>

                        <select class="" name="type">
                            <option value="0" selected>Source (Format Depends)</option>
                            <option value="1">Audio (MP3)</option>
                            <option value="2">Audio (OGG)</option>
                            <option value="3">Audio (WAV)</option>
                        </select>

                        <button type="submit" name="button">Download</button>
                    </form>
                </td>
            </tr>`;

            this._list.insertAdjacentHTML('beforeend', html);

            const subForm = document.getElementById(item.id);
            subForm.addEventListener('submit', (e) => this._downloadSingle(e, subForm));
        });

    }

    async _startDownloadQueue(e) {
        e.preventDefault();

        if (this._isPlaylistDownloadActive) return this._m.error('Your playlist download is already active.');

        this._isPlaylistDownloadActive = true;

        const data = new FormData(this._downloadAll);
        const type = data.get('type');

        for (const item of this._data.items) {
            const dlUrl = API.dl(`https://youtu.be/${item.id}`, type);

            this._m.downloader.downloadUrl(dlUrl);

            await asyncDelay(1e3);
        }

        this._isPlaylistDownloadActive = false;
    }
}
