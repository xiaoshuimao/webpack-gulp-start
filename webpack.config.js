var path = require("path");
var glob = require("glob");
var fs = require("fs");
var webpack = require('webpack');
var ENV_CONFIG = require('./env.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var srcDir = path.join(__dirname, "src");
var excludeFromStats = [
  /node_modules[\\\/]/
];
module.exports = function(RUN_ENV) {
  var config = {};
  /* entry */
  config.entry = getEntry();
  /* output */
  config.output = {
    path: path.join(__dirname, "topic/"),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].bundle.js"
  };
  /* module */
  config.module = {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css!autoprefixer-loader'
    }, {
      test: /\.less$/,
      loader: 'style!css!autoprefixer-loader!less-loader'
    }, {
      test: /\.html$/,
      loader: "html-loader"
    }, {
      test: /.(png|jpg|gif|webp)$/,
      loader: "url-loader"
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }, ]
  };
  /* plugins */
  config.plugins = [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(getApiConfig(RUN_ENV)),
    }),
    new CommonsChunkPlugin('common.js')
  ];
  /* resolve */
  config.resolve = {
    root: [path.join(process.cwd(), "src"), path.join(process.cwd(), "node_modules")],
    modulesDirectories: ['js/lib', 'js/3rd'],
    alias: {
      "jq": "js/3rd/jquery-2.1.4.min.js",
      "zepto": "js/3rd/zepto.min.js"
    },
    extensions: ['', '.js', '.less', '.css', '.gif', '.png', '.webp', '.jpg']
  };
  /* devServer */
  config.devServer = {
    stats: {
      cached: false,
      exclude: excludeFromStats,
      colors: true
    }
  };

  return config;
};

function getApiConfig(RUN_ENV) {
  return ENV_CONFIG[RUN_ENV];
}

function getEntry() {
  var filesObj = {};
  var files = glob.sync("src/**/*.js", {
    ignore: ["src/js/lib/*.js", "src/js/3rd/*.js"]
  });
  files.forEach(function(item) {
    var idx = item.lastIndexOf("/");
    if (idx > -1) {
      filesObj[item.substring(4, item.length - 3)] = [path.resolve(__dirname, item)];
    }
  });
  return filesObj;
}