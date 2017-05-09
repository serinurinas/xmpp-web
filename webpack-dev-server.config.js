let webpack = require('webpack');
let path = require('path');
let buildPath = path.resolve(__dirname, 'build');
let nodeModulesPath = path.resolve(__dirname, 'node_modules');
let TransferWebpackPlugin = require('transfer-webpack-plugin');

let config = {
  //Entry points to the project
  entry: [
    path.join('webpack','hot','dev-server'),
    path.join('webpack','hot','only-dev-server'),
    path.join(__dirname, 'src','app','app.jsx'),
    path.join(__dirname, 'src','app','app.scss'),
  ],
  //Config options on how to interpret requires imports
  resolve: {
    extensions: ["", ".js", ".jsx"],
  },
  //Server Configuration options
  devServer:{
    contentBase: '',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    port: 3000,        //Port Number
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js',
  },
  plugins: [
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Moves files
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, "src")),
  ],
  module: {
    //Loaders to interpret non-vanilla javascript code as well as most other extensions including images and text.
    preLoaders: [
      {
        //Eslint loader
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.join(__dirname, "src","app")],
        exclude: [nodeModulesPath, path.join(__dirname, "src","app","vendor")],
      },
    ],
    loaders: [
      {
        //React-hot loader and
        test: /\.(js|jsx)$/,  //All .js and .jsx files
        loaders: ['react-hot','babel-loader?stage=0'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath, path.join(__dirname, "src","app","vendor")],
      },

      {
        test: /\.scss$/,
        loader: "style!css!sass",
      },

      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf|\.ico$/,
        loader: "file",
      },
    ],
  },
  //eslint config options. Part of the eslint-loader package
  eslint: {
    configFile: '.eslintrc',
  },
};

module.exports = config;
