<img align="left" src="https://github.com/wednesday-solutions/parcel-node-mongo-express/blob/main/parcel_node_mongo_express_github.svg" width="480" height="520" />

<div>
  <a href="https://www.wednesday.is?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" align="left" style="margin-left: 0;">
    <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f5879492fafecdb3e5b0e75_wednesday_logo.svg">
  </a>
  <p>
    <h1 align="left">Parcel Node Mongo Express
    </h1>
  </p>

  <p>
An enterprise Mongo-Express REST API built using nodejs showcasing - Testing Strategy, mongoDB sharding, models, a REST API Interface, support for Redis, aggregation queries, aggregation caching, circuit-breakers, slack integration, RBAC, rate limited APIs and multi-container queues and schedulers.
  </p>

  ___


  <p>
    <h4>
      Expert teams of digital product strategists, developers, and designers.
    </h4>
  </p>

  <div>
    <a href="https://www.wednesday.is/contact-us?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88b9005f9ed382fb2a5_button_get_in_touch.svg" width="121" height="34">
    </a>
    <a href="https://github.com/wednesday-solutions/" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88bb1958c3253756c39_button_follow_on_github.svg" width="168" height="34">
    </a>
  </div>

  ___

  <span>We’re always looking for people who value their work, so come and join us. <a href="https://www.wednesday.is/hiring">We are hiring!</a></span>
</div>

<!-- # parcel-node-express-mongo

A basic starter for a web app with parceljs, node, express and mongoose -->

## Pre-start

    - yarn
    - docker

## Features

    - Babel 7
    - Express
    - Bunyan

## Build and run docker container locally
 
    - docker-compose down
    - docker-compose build
    - docker-compose up

# Shard setup

Run the following script

```
./setup-shards/scripts/setup/base.sh
```

Take a look at [this](./setup-shards/README.md) to create shards and replica sets.

## Seeders

Run the following command to begin seeding

```
./seeders/seed.sh
```

## How to start

    - cd `parcel-node-mongo-express`
    - yarn
    - ./setup-shards/scripts/setup/base.sh
    - cp .env.example .env.local
    - ./seeders/seed.sh
    - yarn start
    - open browser to `localhost:9000` (port default to 9000)

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
