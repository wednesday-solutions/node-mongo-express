const { default: faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
const { Products } = require('../models/products');
const { ReferencedOrders } = require('../models/referencedOrders');
const { UnshardedOrders } = require('../models/unshardedOrders');

const {
    UnshardedReferencedOrders
} = require('../models/unshardedReferencedOrders');
const totalCPUs = os.cpus().length;
function createProduct(dontCreate) {
    const product = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()) * 100,
        category: faker.commerce.department(),
        totalSales: 0,
        quantityAverage: 0,
        schema: 1
    };
    if (dontCreate) {
        return product;
    }
    return Products.create(product);
}

function createOrderWithProductReferenced(products) {
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

function createOrder(products, dontCreate, referenced) {
    const totalPrice = products.reduce(
        (total, product) => total + product.price,
        0
    );
    const order = {
        purchasedProducts: products,
        totalPrice
    };
    if (dontCreate) {
        return order;
    }
    let model = UnshardedOrders;
    if (referenced) {
        model = UnshardedReferencedOrders;
    }
    return model.create(order);
}
function connectToMongo() {
    return mongoose.connect('mongodb://localhost:60000/ecommerce', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
function runInClusterMode(func) {
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
        func();
    }
}
module.exports = {
    createProduct,
    createOrder,
    createOrderWithProductReferenced,
    connectToMongo,
    runInClusterMode
};
