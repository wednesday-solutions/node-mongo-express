const mongoose = require('mongoose');
const { default: faker } = require('@faker-js/faker');
const cluster = require('cluster');
const os = require('os');
const { Products } = require('../models/products');
const { ReferencedOrders } = require('../models/referencedOrders');
const totalCPUs = os.cpus().length;

function seed() {
    mongoose
        .connect('mongodb://localhost:60000/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(async () => {
            console.log('connected to mongodb');
            for (let i = 0; i < 5000; i++) {
                const products = [];
                for (let j = 0; j < 3; j++) {
                    products.push(await createProduct());
                }
                await createOrder(products);
            }
        })
        .catch(err => {
            console.log('Error is ', err);
        });
    console.log('done!');
}

function createProduct() {
    return Products.create({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()) * 100,
        category: faker.commerce.department(),
        totalSales: 0,
        quantityAverage: 0,
        schema: 1
    });
}

function createOrder(products) {
    const totalPrice = products.reduce(
        (total, product) => total + product.price,
        0
    );
    const order = {
        purchasedProducts: products.map(p => p._id),
        totalPrice
    };
    return ReferencedOrders.create(order);
}
if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    seed();
}
