import mongoose from 'mongoose';
import { getMongoUri } from 'utils/mongoConstants.js';
import log from 'utils/logger';

export const mongoConnector = () => {
    let db;

    
    if (mongoose.connection.readyState === 1) {
        log.info('Mongo already connected.');
        db = mongoose.connection;
    } else {
        mongoose.connect(getMongoUri());
        db = mongoose.connection;
        db.on('error', err => { 
            log.error('error', err)
        });
        db.once('open', () =>
            log.info(
                'mongo connection successfully connected to ',
                getMongoUri()
            )
        );
    }
    return db;
};
