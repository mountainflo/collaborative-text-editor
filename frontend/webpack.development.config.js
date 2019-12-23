const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const APP_DIR = path.resolve(__dirname, "src");

module.exports = {
    mode: 'development',
    entry: APP_DIR + '/client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './',
        host: '0.0.0.0',
        hot: true,
        index: 'index.html',
        inline: true,
        port: '8081',
        serveIndex: true,
        stats: 'normal'
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};