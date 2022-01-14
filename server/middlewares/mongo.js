import mongoose from 'mongoose';

exports.mongoConnector = () => {
    let db;

    if (mongoose.connection.readyState === 1) {
        log.info('Mongo already connected.');
        db = mongoose.connection;
    } else {
        let mongoDB = 'mongodb://localhost:27017/testDB';
        mongoose.connect(mongoDB);
        db = mongoose.connection;
        db.on('error', err => log.error('error'));
        db.once('open', () =>
            log.info('mongo connection successfully connected to ', mongoDB)
        );
    }
};
