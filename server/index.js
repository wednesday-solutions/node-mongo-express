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
import { model as Order } from '../seeders/multiple-collections/orders';
import { model as Product } from '../seeders/multiple-collections/products';
import { model as Store } from '../seeders/multiple-collections/store';
import { model as Supplier } from '../seeders/multiple-collections/suppliers';
import { model as StoreProduct } from '../seeders/multiple-collections/storeProducts';
import { model as SupplierProduct } from '../seeders/multiple-collections/supplierProducts';
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
    .connect('mongodb://localhost:27027/ecommerce', {
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
    await StoreProduct.deleteMany({});
    await Order.deleteMany({});
    await SupplierProduct.deleteMany({});

    console.log('------------------------------------\nSeeding stores');
    const seedStores = range(0, 2).map((value, index) => ({
        name: faker.company.companyName(),
        address: faker.address.streetAddress(true),
        schema: 1
    }));
    const stores = await Store.insertMany(seedStores);
    console.log('------------------------------------\nSeeding suppliers');
    const seedSuppliers = range(0, 2).map((value, index) => ({
        name: faker.company.companyName(),
        schema: 1
    }));
    const suppliers = await Supplier.insertMany(seedSuppliers);

    console.log('------------------------------------\nSeeding products');

    const seedProducts = await Promise.all(
        range(1, 20).map(async (value, index) => ({
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()) * 100,
            category: faker.commerce.department(),
            totalSales: 0,
            quantityAverage: 0,
            schema: 1
        }))
    );
    const products = await Product.insertMany(seedProducts);

    const seedStoreProducts = [];
    const seedSupplierProducts = [];
    products.forEach(product => {
        const storeIndex = random(0, stores.length - 1);
        const supplierIndex = random(0, suppliers.length - 1);
        console.log({ supplierIndex });
        seedStoreProducts.push({
            schema: 1,
            productId: product._id,
            product,
            store: stores[storeIndex],
            storeId: stores[storeIndex]._id
        });
        // seedSupplierProducts.push({
        //     schema: 1,
        //     productId: product._id,
        //     product,
        //     supplier: suppliers[supplierIndex],
        //     supplierId: suppliers[supplierIndex]._id
        // });
    });

    console.log(
        '------------------------------------\nSeeding seedStoreProducts and seedSupplierProducts'
    );
    await StoreProduct.insertMany(seedStoreProducts);
    await SupplierProduct.insertMany(seedSupplierProducts);

    const seedOrders = [];
    console.log('------------------------------------\nSeeding orders');
    range(0, 25).forEach(orderIndex => {
        const order = new Order();
        console.log({ order });
        order.purchasedProducts = [];
        const numberOfProducts = random(1, 6);

        let total = 0;
        for (let i = 0; i < numberOfProducts; i++) {
            const product = products[random(0, products.length - 1)];
            total += product.price;
            order.purchasedProducts.push(product);
        }

        order.totalPrice = total;
        order.schema = 1;
        seedOrders.push(order);
    });
    try {
        const res = await Order.insertMany(seedOrders);
        console.log({ res });
    } catch (e) {
        console.log({ e });
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
module.exports = app;
