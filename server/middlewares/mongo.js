import mongoose from 'mongoose';
import log from '@utils/logger';
export const mongoConnector = () => {
    let db;

    if (mongoose.connection.readyState === 1) {
        log.info('Mongo already connected.');
        db = mongoose.connection;
    } else {
        let mongoDB =
            'mongodb://localhost:27017/ecommerce?readPreference=secondary';
        mongoose.connect(mongoDB);
        db = mongoose.connection;
        db.on('error', err => log.error('error'));
        db.once('open', () =>
            log.info('mongo connection successfully connected to ', mongoDB)
        );
    }
    return db;
};
