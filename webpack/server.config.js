const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
require('@babel/register'); //  will bind itself to node's require and automatically compile files on the fly

const dotEnvFile =
    process.env.ENVIRONMENT_NAME === 'production'
        ? `.env`
        : `.env.${process.env.ENVIRONMENT_NAME || 'local'}`;

const env = dotenv.config({ path: dotEnvFile }).parsed;

const envKeys = {
    ...Object.keys(process.env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
        return prev;
    }, {}),
    ...Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {})
};

module.exports = (options = {}) => ({
    mode: options.mode,
    entry: options.entry,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // allows transpiling JavaScript files using Babel and webpack
                    options: options.babelQuery
                }
            }
        ]
    },
    plugins: options.plugins.concat([new webpack.DefinePlugin(envKeys)]),
    optimization: options.optimization,
    node: {
        __dirname: true
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            utils: path.resolve(__dirname, '../server/utils'),
            middlewares: path.resolve(__dirname, '../server/middlewares'),
            server: path.resolve(__dirname, '../server'),
            api: path.resolve(__dirname, '../server/api'),
            config: path.resolve(__dirname, '../config'),
            services: path.resolve(__dirname, '../server/services'),
            database: path.resolve(__dirname, '../server/database'),
            daos: path.resolve(__dirname, '../server/daos'),
            'superagent-proxy': false
        },

        extensions: ['.js']
    },
    output: {
        libraryTarget: 'commonjs'
    },

    target: 'node'
});
