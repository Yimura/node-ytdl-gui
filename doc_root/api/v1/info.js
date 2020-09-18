import BasicEndpoint from '../../../src/structures/endpoints/BasicEndpoint.js'

export default class Info extends BasicEndpoint {
    constructor(main) {
        super(main);
    }

    /**
     * @param {Request} request
     */
    async get(request) {
        

        return true;
    }
}
