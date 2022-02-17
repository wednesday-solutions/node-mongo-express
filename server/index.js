import express from 'express';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import log from '@utils/logger';
import { mongoConnector } from './middlewares/mongo';
import { range } from 'lodash';
import { apiSuccess } from '@utils/apiUtils';
import database from './database';
import mongoose from 'mongoose';
import faker from '@faker-js/faker';
import Product from '../seeders/multiple-collections/products';
import Store from '../seeders/multiple-collections/store';
import Supplier from '../seeders/multiple-collections/suppliers';
import random from 'lodash/random';
import { randomiser } from './utils/random';
/**
 * Connect to database
 */
// let db = mongoConnector();

/**
 * Create express server
 */
const app = express();

app.set('port', process.env.PORT || 9000);
app.use(helmet());
app.use(cors());
// get information from html forms
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// setup database
database(app);

app.get('/', (req, res) => {
    apiSuccess(res, 'node-parcel-express-mongo server at your service🖖');
});

mongoose
    .connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('connected to mongodb');
    })
    .catch(err => {
        console.log('Error is ', err);
    });

const seedDB = async () => {
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});

    const seedStores = range(0, 5).map((value, index) => ({
        name: faker.company.companyName(),
        address: faker.address.streetAddress(true)
    }));

    const dbStoreIds = (await Store.insertMany(seedStores)).map(m => m._id);
    const seedProducts = await Promise.all(
        range(1, 20).map(async (value, index) => {
            let stores = randomiser(arr, 3);
            return {
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()) * 100,
                category: faker.commerce.department(),
                storeId: stores
            };
        })
    );
    await Product.insertMany(seedProducts);
};

seedDB().then(() => {
    mongoose.connection.close();
});
module.exports = app;
