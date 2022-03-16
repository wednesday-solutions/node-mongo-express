const {
    runInClusterMode,
    connectToMongo,
    createOrder,
    createProduct
} = require('./utils');

function seed() {
    connectToMongo()
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

runInClusterMode(seed);
