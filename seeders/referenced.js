const {
    runInClusterMode,
    connectToMongo,
    createOrderWithProductReferenced,
    createProduct
} = require('./utils');

function seed() {
    connectToMongo()
        .then(async () => {
            for (let i = 0; i < 5000; i++) {
                const products = [];
                for (let j = 0; j < 3; j++) {
                    products.push(await createProduct());
                }
                await createOrderWithProductReferenced(products);
            }
        })
        .catch(err => {
            console.log('Error is ', err);
        });
    console.log('done!');
}

runInClusterMode(seed);
