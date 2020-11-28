export default {
    api: {
        // If the frontend should be enabled, disable this when using your own frontend
        frontend: true,
        sites: {
            // You can restrict from which domains people can download
            // There are two modes available "allow" and "deny".
            // When using allow, by default all domains are allowed and exceptions are blocked.
            // With deny, all domains are blocked and only exceptions can be downloaded from.
            rule: 'allow', // allow or deny
            exception: []
        }
    },
    cluster: {
        // By default, the webserver will be clustered in the same amount of Logical Cores available.
        // You can overwrite the automated mode and set the amount of threads the webserver should use.
        threads: 'auto', // a number is expected or "auto"

        respawn: true, // Respawn workers whenever they crash
        respawn_delay: 5e3 // The delay they are respawned on (in milliseconds)
    },
    web: {
        // Change the port of the web server, don't change this for the docker container as you'll have to adapt it there as well.
        port: 8080,

        // All of the below are advanced options and should only be modified if you know what you are doing.
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
