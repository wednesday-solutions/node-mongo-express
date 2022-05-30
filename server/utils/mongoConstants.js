function getMongoOptions() {
    return '?readPreference=secondary';
}
function getMongoUri() {
    return `mongodb://${process.env.MONGO_BASE_URI}:${process.env.MONGO_PORT}/${
        process.env.MONGO_DB_NAME
    }${getMongoOptions()}`;
}
module.exports = { getMongoUri };
