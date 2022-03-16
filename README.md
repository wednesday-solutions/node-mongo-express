# parcel-node-express-mongo

A basic starter for a web app with parceljs, node, express and mongoose

## Pre-start

    - npm

## Features

    - Babel 7
    - Express
    - Bunyan

# Shard setup

Run the following script

```
./setup-shards/scripts/setup/base.sh
```

Take a look at [this](./setup-shards/README.md) to create shards and replica sets.

## Seeders

Run the following command to begin seeding

```
node seeders/index.js
```

## How to start

    - git clone `https://github.com/pandaling/parcel-node-express-mongo.git`
    - cd `parcel-node-express-mongo`
    - npm install
    - npm run server
    - open browser to `localhost:9000` (port default to 9000)

## Mongo DB

    - test api with postman
    - eg: 'localhost:9000/user/create'

## Philosophy

When using NoSQLs you are optimising for read performance. We're doing this by denormalising data. There are multiple copies of the same data. For example

-   Orders contains purchasedProducts which contains Products. Instead of referencing here we embed
-   SupplierProducts contains embedded objects for both Suppliers and Products
-   StoreProducts contains embedded objects for both Stores and Products

This makes our application write heavy. Every time there is a change to a product we need to make a change to

-   SupplierProducts
-   StoreProducts
-   Products

Orders is not impacted since a change in the product after purchase will not affect the order.

However the application is able to perform extremely fast reads. 2 reasons for better performance is

-   shards
-   document embedding

NoSQLs are also good for handling large volumes of data. This is supported due to its ability to have shards. In this application we create 4 shards and the data is distributed amongst these shards.

These are the shard keys that we use

-   Order
    -   \_id
-   name
    -   Products:
    -   Suppliers
    -   Stores
        <br/>We got really good distribution across shards(24-26%) per shard after seeding 4 million records. It's possible to get a hot shard due to this but we're yet to see that.
-   productId
    -   SupplierProducts
    -   StoreProducts
        <br/>productId is chosen as the shard key since we anticipate that the queries for fetching all suppliers/stores that sell a particular product will be much more than fetching all products of a supplier/store.
