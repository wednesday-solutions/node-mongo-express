const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    suppliers: [
        {
            ref: 'Supplier',
            type: 'ObjectId'
        }
    ],
    stores: [
        {
            ref: 'Store',
            type: 'ObjectId'
        }
    ],
    schema: {
        type: Number,
        required: true
    },
    totalSales: {
        type: Number,
        required: true
    },
    quantityAverage: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', schema);

module.exports = Product;

/**
 Store: {
  id: Number
  name: String,
  schema: Number 
  suppliers: [ids]
  products: [ids]
}

Suppliers: {
  id: Number
  name: String,
  schema: Number,
  products: [ids],
  stores: [ids]   
}

Product: {
  id: Number
  name: String,
  schema: Number 
  variations: []
  suppliers: [ids]
  stores: [ids],
  totalSales: Number,
  quantityAverage: Number,
}

Order :{
    id: Number,
    product: id,
    quantity: Number
    orderSum: Number
}

Follow up questions:
Creating separate collections for all the entities makes sense for now?


How frequently would the stores and suppliers be updated?
Along with product what info suppliers/stores would be required by the application?


1. Get all the products for a supplier: If we want to fetch this everytime instead
having a ref we can store the name and price directly inside the supplier table embedding 
it? Assuming suppliers won't be more than a few thousands.
2. Get all the products in a store? Refercing the stores should be fine here.
3.Get all the stores that have a product?
4. Average ticket size for a product? Storing total number onf products sold till date
order in the product collection and fetching them to find the number
5. Total size of product? Again store on the product collection itself
6. Suppliers for store? Reference on the store
7. Stores for supplier? Reference on the supplier
 */
