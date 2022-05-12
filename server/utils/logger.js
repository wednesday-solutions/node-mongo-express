import bunyan from 'bunyan';

module.exports = global.log = bunyan.createLogger({
    name: 'parcel-node-mongo-express',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});
