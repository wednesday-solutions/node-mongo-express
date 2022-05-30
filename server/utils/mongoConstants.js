function getMongoOptions() {
    return process.env.MONGO_PORT === '27017'
        ? ''
        : '?readPreference=secondary';
}
function getMongoUri() {
    return `mongodb://${process.env.MONGO_BASE_URI}:${process.env.MONGO_PORT}/${
        process.env.MONGO_DB_NAME
    }${getMongoOptions()}`;
}
module.exports = { getMongoUri };
