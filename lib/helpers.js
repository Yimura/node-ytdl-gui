module.exports = class Helpers {
    constructor() {

    }

    parseBody(req, res) {
        let reqBody = '';

        return new Promise(function(resolve, reject) {
            req.on('data', (data) => {
                reqBody += data;

                if (reqBody.length > 1e5) {
                    res.writeHead(413, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(this.error[413]));

                    req.connection.destroy();
                }
            });

            req.on('end', () => {
                const body = JSON.parse(reqBody);

                resolve(body);
            });
        });
    }

    parseGet(req, res) {
        const
            split_url = req.url.split('?')[1].split('&'),
            get = {};

        for (let i in split_url) {
            const pair = split_url[i].split('=');

            get[pair[0]] = pair[1];
        }

        return get;
    }
}
