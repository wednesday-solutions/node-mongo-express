const faker = require('faker');
const mongoConnector = require('../../server/middlewares/mongo');

async function seedDB() {
    try {
        for (let i = 0; i < 20000; i++) {
            const name = faker.commerce.productName();
            const category = faker.commerce.department();
            const amount = faker.commerce.price() * 100;

            collection.insertMany({ name, category, amount });
        }
        console.log('Database seeded! :)');
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
seedDB();
