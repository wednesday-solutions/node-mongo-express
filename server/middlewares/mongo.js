import mongoose from 'mongoose';

exports.mongoConnector = () => {
    let db;

    if (mongoose.connection.readyState === 1) {
        log.info('Mongo already connected.');
        db = mongoose.connection;
    } else {
        let mongoDB = 'mongodb://192.168.1.6:27019,192.168.1.6:27018,192.168.1.6:27017/testDB?replicaSet=rs0';
        mongoose.connect(mongoDB);
        db = mongoose.connection;
        db.on('error', err => log.error('error'));
        db.once('open', () =>
            log.info('mongo connection successfully connected to ', mongoDB)
        );
    }
};
