import Main from './src/Main.js'

const main = new Main();
main.start();

process.on('SIGINT', () => main.exit());
process.on('SIGTERM', () => main.exit());

process.on('unhandledRejection', console.log);
