import mongoose from 'mongoose';
import log from 'utils/logger';

export const MONGO_URI = `mongodb://${process.env.MONGO_DOMAIN}:60000/ecommerce?readPreference=secondary`;

export const mongoConnector = () => {
    let db;

    if (mongoose.connection.readyState === 1) {
        log.info('Mongo already connected.');
        db = mongoose.connection;
    } else {
        mongoose.connect(MONGO_URI);
        db = mongoose.connection;
        db.on('error', err => log.error('error'));
        db.once('open', () =>
            log.info('mongo connection successfully connected to ', MONGO_URI)
        );
    }
    return db;
};
