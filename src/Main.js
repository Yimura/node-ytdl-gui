import ModuleManager from './manager/ModuleManager.js'
import config from '../data/config.js'
import cluster from 'cluster'
import { cpus } from 'os'
import log from './util/Log.js'

export default class Main {
    moduleManager = new ModuleManager(this);

    constructor() {
        Object.assign(this, {
            config
        });
    }

    getModule(moduleName) {
        return this.moduleManager.get(moduleName);
    }

    start() {
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

        this.moduleManager.load();
    }

    /**
     * Cleanup everything nicely
     */
    exit() {
        process.exit(0);
    }
}
