const {
    runSeeders,
    connectToMongo,
    createOrder,
    createProduct
} = require('./utils');

function seed() {
    connectToMongo()
        .then(async () => {
            console.log('connected to mongodb::unsharded');
            const divisor = process.env.DIVISOR || 100;
            for (let i = 0; i < 5000 / divisor; i++) {
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
}

runSeeders(seed);
