const {
    runSeeders,
    connectToMongo,
    createOrderWithProductReferenced,
    createProduct
} = require('./utils');

async function seed() {
    await Promise.all([
        connectToMongo()
            .then(async () => {
                const divisor = process.env.DIVISOR || 100;
                console.log('connected to mongodb::referenced');
                for (let i = 0; i < 5000 / divisor; i++) {
                    const products = [];
                    for (let j = 0; j < 3; j++) {
                        products.push(await createProduct());
                    }
                    await createOrderWithProductReferenced(products);
                }
            })
            .catch(err => {
                console.log('Error is ', err);
            })
    ]);
}

runSeeders(seed);
