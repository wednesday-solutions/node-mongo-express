import bunyan from 'bunyan';

export default global.log = bunyan.createLogger({
    name: 'parcel-node-mongo-express',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});
