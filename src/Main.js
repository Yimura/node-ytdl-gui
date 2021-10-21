import Modules from './Modules.js'
import config from '@/data/config.js'
import cluster from 'cluster'
import log from './util/Log.js'
import { cpus } from 'os'
import { resolve } from 'path'

export default class Main {
    constructor() {
        
    }

    get config() {
        return config;
    }

    get log() {
        return log;
    }

    get modules() {
        return Modules;
    }

    async start() {
        if (cluster.isMaster) {
            log.info('MASTER', `Master Cluster is started on PID ${process.pid}`);

            const threads = config.cluster.threads === 'auto' ? cpus().length : config.cluster.threads;
            for (let i = 0; i < threads; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                log.warn('MASTER', `Worker died ${worker.process.pid}`);
            });

            return;
        }

        log.info('SLAVE', `Slave started on PID ${process.pid}`);

        await Modules.load(this, resolve('./src/modules'));
    }

    /**
     * Cleanup everything nicely
     */
    async exit() {
        log.verbose("MAIN", "Received close signal.");

        await Modules.cleanup();

        process.exit(0);
    }
}
