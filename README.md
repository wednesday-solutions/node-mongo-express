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
