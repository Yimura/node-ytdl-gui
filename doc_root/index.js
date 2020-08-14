import fs from 'fs';
import { resolve } from 'path'

export default class Index {
    constructor(main) {

    }

    get(request) {
        request.writeHead(200, { 'Content-Type': 'text/html' });

        fs.readFile(resolve('./doc_root/index.html'), (err, data) => {
            if (err) {
                request.end('Failed to get index.html');

                return;
            }

            request.end(data);
        });

        return true;
    }
}
