const { default: faker } = require('@faker-js/faker');
const random = require('lodash/random');
const range = require('lodash/range');
const moment = require('moment');
const { runSeeders, connectToMongo, createProduct } = require('./utils');
const { Orders } = require('database/models/orders');
const { Products } = require('database/models/products');
const { Stores } = require('database/models/stores');
const { Suppliers } = require('database/models/suppliers');
const { StoreProducts } = require('database/models/storeProducts');
const { SupplierProducts } = require('database/models/supplierProducts');

const OCT_10_1994 = 782980686236;

const seed = async () => {
    console.log('connected to mongodb::index');
    await Promise.all([
        connectToMongo().then(async () => {
            const divisor = process.env.DIVISOR || 10;
            for (let i = 0; i < 5000 / divisor; i++) {
                console.log(
                    '------------------------------------\nSeeding products'
                );
                const seedProducts = await Promise.all(
                    range(1, 2000 / divisor).map(async (value, index) =>
                        createProduct(true)
                    )
                );
                const products = await Products.insertMany(seedProducts, {
                    writeConcern: { w: 0 }
                });
                console.log(
                    '------------------------------------\nSeeding stores'
                );
                const seedStores = range(0, 200 / divisor).map(
                    (value, index) => ({
                        name: faker.company.companyName(),
                        address: faker.address.streetAddress(true)
                    })
                );
                const stores = await Stores.insertMany(seedStores, {
                    writeConcern: { w: 0 }
                });
                console.log(
                    '------------------------------------\nSeeding suppliers'
                );
                const seedSuppliers = range(0, 200 / divisor).map(
                    (value, index) => ({
                        name: faker.company.companyName()
                    })
                );
                const suppliers = await Suppliers.insertMany(seedSuppliers, {
                    writeConcern: { w: 0 }
                });

                const seedStoreProducts = [];
                const seedSupplierProducts = [];
                products.forEach(product => {
                    const storeIndex = random(0, stores.length - 1);
                    const supplierIndex = random(0, suppliers.length - 1);
                    seedStoreProducts.push({
                        productId: product._id,
                        product,
                        store: stores[storeIndex],
                        storeId: stores[storeIndex]._id
                    });
                    const supplier = suppliers[supplierIndex];
                    seedSupplierProducts.push({
                        productId: product._id,
                        product,
                        supplier: supplier,
                        supplierId: supplier._id
                    });
                });

                console.log(
                    '------------------------------------\nSeeding seedStoreProducts and seedSupplierProducts'
                );
                StoreProducts.insertMany(seedStoreProducts, {
                    writeConcern: { w: 0 }
                });
                SupplierProducts.insertMany(seedSupplierProducts, {
                    writeConcern: { w: 0 }
                });

                const seedOrders = [];
                console.log(
                    '------------------------------------\nSeeding orders'
                );
                await Promise.all(
                    range(0, 2500 / divisor).map(async orderIndex => {
                        const order = {};
                        const purchasedProducts = [];
                        const numberOfProducts = random(1, 6);
                        products.forEach(product => {
                            let qty = Math.floor(Math.random() * 3);
                            product['quantity'] = qty ? qty : 1;
                        });

                        let total = 0;
                        for (let i = 0; i < numberOfProducts; i++) {
                            const product =
                                products[random(0, products.length - 1)];
                            total += product.price * product.quantity;
                            purchasedProducts.push(product);
                        }
                        order.totalPrice = total;
                        order.purchasedProducts = purchasedProducts;
                        order.createdAt = moment(
                            OCT_10_1994 + 86400000 * orderIndex
                        ).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        seedOrders.push(order);
                    })
                );

                try {
                    Orders.insertMany(seedOrders, {
                        writeConcern: { w: 0 }
                    });
                } catch (e) {
                    console.log({ e: e });
                }
            }
        })
    ]);
};

runSeeders(seed);
