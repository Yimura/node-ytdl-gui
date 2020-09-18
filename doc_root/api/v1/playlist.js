import BasicEndpoint from '../../../src/structures/endpoints/BasicEndpoint.js'
import ytpl from 'ytpl'

export default class Playlist extends BasicEndpoint {
    constructor(main) {
        super(main);
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        const id = request.query.get('id');
        if (!id) return request.reject(400);

        const playlist = await ytpl(id);

        return request.accept(playlist);
    }
}
