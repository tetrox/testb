const webpack                  = require('webpack');
const merge                    = require('webpack-merge');
const helpers                  = require('./helpers');
const commonConfig             = require('./config.common');
const HtmlWebpackPlugin        = require('html-webpack-plugin');
const isProd                   = process.env.NODE_ENV === 'production';

const webpackConfig = merge(commonConfig('dashboard'), {
    plugins: [
        // new HtmlWebpackPlugin({template: 'dashboard/wp_template.html'})
    ]
});

console.log(webpackConfig);
module.exports = webpackConfig;
