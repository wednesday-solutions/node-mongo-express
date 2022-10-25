const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = require('./server.config')({
    mode: 'production',
    entry: [path.join(process.cwd(), '/server/index.js')],
    plugins: [],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
});
