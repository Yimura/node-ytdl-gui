import Data from '/assets/js/Data.js'

class Playlist {
    constructor() {

    }

    domLookup() {
        this.elName = document.querySelector('#playlist > h1');
    }
}

const pl = new Playlist();
document.addEventListener('DOMContentLoaded', () => pl.domLookup());
