import API from './Api.js'

export default class Download {
    /**
     * @param {EntryPoint} entry,
     * @param {URL} url
     * @param {Object} data
     */
    constructor(entry, url, data) {
        this._m = entry;

        this._url = url;
        this._data = data;
    }

    domLookup() {
        this._title = document.querySelector('.track-info > .title');
        this._title.innerHTML = this._data.title;

        this._thumbnail = document.querySelector('.track-info > .thumbnail');
        this._thumbnail.src = this._data.thumbnail;

        this._form = document.querySelector('form');
        this._form.addEventListener('submit', (e) => this._startDownload(e));
    }

    /**
     * @private
     */
    _startDownload(e) {
        e.preventDefault();

        const data = new FormData(this._form);
        const url = this._m.router.query.get('url');

        const dlUrl = API.dl(url, data.get('type'));

        this._m.downloader.downloadUrl(dlUrl);

        this._form.reset();
    }
}
