module.exports = {
    info: {
        title: 'API', // Title (required)
        version: '2.0.0' // Version (required)
    },
    apis: ['./server/routes/*.js'],
    host: 'http://localhost:9000',
    basePath: '/'
};
