const mongoose = require("mongoose");
const { default: faker } = require("@faker-js/faker");
const { model: Order } = require("../models/orders");
const { model: Product } = require("../models/products");
const { model: Store } = require("../models/store");
const { model: Supplier } = require("../models/suppliers");
const { model: StoreProduct } = require("../models/storeProducts");
const { model: SupplierProduct } = require("../models/supplierProducts");
const random = require("lodash/random");
const range = require("lodash/range");
const cluster = require("cluster");
const os = require("os");
const totalCPUs = os.cpus().length;

const seedDB = async () => {
  for (let i = 0; i < 500; i++) {
    // await Store.deleteMany({});
    // await Product.deleteMany({});
    // await Supplier.deleteMany({});
    // await StoreProduct.deleteMany({});
    // await Order.deleteMany({});
    // await SupplierProduct.deleteMany({});

    console.log("------------------------------------\nSeeding stores");
    const seedStores = range(0, 20).map((value, index) => ({
      name: faker.company.companyName(),
      address: faker.address.streetAddress(true),
      schema: 1
    }));
    const stores = await Store.insertMany(seedStores);
    console.log("------------------------------------\nSeeding suppliers");
    const seedSuppliers = range(0, 20).map((value, index) => ({
      name: faker.company.companyName(),
      schema: 1
    }));
    const suppliers = await Supplier.insertMany(seedSuppliers);

    console.log("------------------------------------\nSeeding products");

    console.log("i----------", i);

    // setTimeout()
    const seedProducts = await Promise.all(
      range(1, 200).map(async (value, index) => ({
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
      "------------------------------------\nSeeding seedStoreProducts and seedSupplierProducts"
    );
    await StoreProduct.insertMany(seedStoreProducts);
    await SupplierProduct.insertMany(seedSupplierProducts);

    const seedOrders = [];
    console.log("------------------------------------\nSeeding orders");
    await Promise.all(
      range(0, 250).map(async orderIndex => {
        const order = {};
        const purchasedProducts = [];
        const numberOfProducts = random(1, 6);

        let total = 0;
        for (let i = 0; i < numberOfProducts; i++) {
          const product = products[random(0, products.length - 1)];
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
      const res = await Order.insertMany(seedOrders);
      // console.log({ res });
    } catch (e) {
      console.log({ e: e });
    }
  }
};

const seedAll = async () => {
  await seedDB();
};

function seedUsingMongoose() {
  console.log("------------------------------------\nSeeding using mongoose");
  mongoose
    .connect("mongodb://localhost:60000/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("connected to mongodb");
      return seedAll().then(() => {
        mongoose.connection.close();
      });
    })
    .catch(err => {
      console.log("Error is ", err);
    });
}
if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  seedUsingMongoose();
}
