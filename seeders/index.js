const { default: faker } = require('@faker-js/faker');
const random = require('lodash/random');
const range = require('lodash/range');
const { runInClusterMode, connectToMongo, createProduct } = require('./utils');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { Stores } = require('../models/stores');
const { Suppliers } = require('../models/suppliers');
const { StoreProducts } = require('../models/storeProducts');
const { SupplierProducts } = require('../models/supplierProducts');

const seed = async () => {
    connectToMongo().then(async () => {
        const divisor = 100;
        for (let i = 0; i < 5000; i++) {
            // await Store.deleteMany({});
            // await Product.deleteMany({});
            // await Supplier.deleteMany({});
            // await StoreProduct.deleteMany({});
            // await Order.deleteMany({});
            // await SupplierProduct.deleteMany({});

            console.log('i----------', i);
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
            console.log('------------------------------------\nSeeding stores');
            const seedStores = range(0, 200 / divisor).map((value, index) => ({
                name: faker.company.companyName(),
                address: faker.address.streetAddress(true),
                schema: 1
            }));
            const stores = await Stores.insertMany(seedStores, {
                writeConcern: { w: 0 }
            });
            console.log(
                '------------------------------------\nSeeding suppliers'
            );
            const seedSuppliers = range(0, 200 / divisor).map(
                (value, index) => ({
                    name: faker.company.companyName(),
                    schema: 1
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
                    schema: 1,
                    productId: product._id,
                    product,
                    store: stores[storeIndex],
                    storeId: stores[storeIndex]._id
                });
                const supplier = suppliers[supplierIndex];
                seedSupplierProducts.push({
                    schema: 1,
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
            console.log('------------------------------------\nSeeding orders');
            await Promise.all(
                range(0, 2500 / divisor).map(async orderIndex => {
                    const order = {};
                    const purchasedProducts = [];
                    const numberOfProducts = random(1, 6);

                    let total = 0;
                    for (let i = 0; i < numberOfProducts; i++) {
                        const product =
                            products[random(0, products.length - 1)];
                        total += product.price;
                        purchasedProducts.push(product);
                    }
                    order.totalPrice = total;
                    order.schema = 1;
                    order.purchasedProducts = purchasedProducts;
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
    });
};

runInClusterMode(seed);
