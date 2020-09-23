export default {
    api: {
        frontend: false,
        sites: {
            rule: 'allow',
            exception: []
        }
    },
    cluster: {
        threads: 1
    },
    web: {
        port: 8080,
        allow_headers: [
            'Authorization',
            'Access-Control-Allow-Headers',
            'Origin',
            'Accept',
            'Content-Type',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ],
        allow_methods: [
            'GET',
            'HEAD',
            'PUT',
            'PATCH',
            'POST',
            'DELETE'
        ],
        origins: [
            'http://localhost:8080',
            'http://127.0.0.1:8080'
        ]
    }
}
