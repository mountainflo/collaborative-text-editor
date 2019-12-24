const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const APP_DIR = path.resolve(__dirname, "src");

module.exports = {
    mode: 'production',
    entry: APP_DIR + '/client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/',
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};