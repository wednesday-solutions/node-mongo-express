module.exports = function (api) {
    api.cache(true); // Caches the computed configuration

    const presets = [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3
            }
        ],
        '@babel/preset-flow'
    ];
    const plugins = [
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-class-properties',
        '@babel/transform-runtime',
        '@babel/plugin-transform-async-generator-functions'
    ];

    // Environment-specific configuration
    const env = process.env.BABEL_ENV || process.env.NODE_ENV;
    if (env !== 'test') {
        plugins.push(['@babel/plugin-transform-modules-commonjs']);
    }

    return {
        presets,
        plugins
    };
};
