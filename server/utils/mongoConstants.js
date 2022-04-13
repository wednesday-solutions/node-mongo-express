function getMongoUri(ip, port) {
    return `mongodb://${process.env.MONGO_BASE_URI}:${process.env.MONGO_PORT}/ecommerce?readPreference=secondary`;
}
module.exports = { getMongoUri };
