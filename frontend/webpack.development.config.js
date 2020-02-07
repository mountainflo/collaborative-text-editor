const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'development',
  entry: APP_DIR + '/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
  },
  devServer: {
    contentBase: './',
    host: '0.0.0.0',
    hot: true,
    index: 'index.html',
    inline: true,
    port: '8081',
    serveIndex: true,
    stats: 'normal',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-regenerator',
              '@babel/plugin-proposal-class-properties',
              ['transform-remove-console', {'exclude': ['error', 'warn', 'log', 'debug']}],
            ]},
        },
        {loader: 'eslint-loader'},
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
};
