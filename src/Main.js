import ModuleManager from './manager/ModuleManager.js'
import config from '../data/config.js'
import cluster from 'cluster'
import { cpus } from 'os'
import log from './util/Log.js'

export default class Main {
    moduleManager = new ModuleManager(this);

    constructor() {
        Object.assign(this, {
            config,
            cpus: cpus().length
        });
    }

    /**
     * Cleanup everything nicely
     */
    exit() {
        process.exit(0);
    }

    getModule(moduleName) {
        return this.moduleManager.get(moduleName);
    }

    spawn() {
        const threads = config.cluster.threads === 'auto' ? this.cpus : config.cluster.threads;

        for (let i = 0; i < threads; i++) {
            cluster.fork();
        }

        cluster.on('exit', this.workerExit.bind(this));
    }

    start() {
        if (cluster.isMaster) {
            log.info('MASTER', `Master Cluster is started on PID ${process.pid}`);

            this.spawn();

            return;
        }

        log.info('SLAVE', `Slave started on PID ${process.pid}`);

        this.moduleManager.load();
    }

    workerExit(worker, code, signal) {
        log.warn('MASTER', `Worker died ${worker.process.pid}`);

        if (config.cluster.respawn) {
            log.info('MASTER', `Respawning dead worker in ${config.cluster.respawn_delay}ms`);

            setTimeout(cluster.fork, config.cluster.respawn_delay);
        }
    }
}
