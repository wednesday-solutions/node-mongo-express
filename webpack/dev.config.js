/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = require('./server.config')({
    mode: 'development',
    // Add hot reloading in development
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(process.cwd(), '/server/index.js')
    ],
    // Don't use hashes in dev mode for better performance
    babelQuery: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
    },
    // Add development plugins
    plugins: [
        new webpack.HotModuleReplacementPlugin() // Tell webpack we want hot reloading
    ],
    optimization: {}
});
