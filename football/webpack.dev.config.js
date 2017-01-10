var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var WebpackMd5Hash = require('webpack-md5-hash');
module.exports = {
  entry: {
    'js/build.js': './app/modules/app.js'
  },
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "",
    //filename: '[name][hash:8].js'
    filename: '[name]'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/common.js'
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app/index.html'
    }),
    new ExtractTextPlugin("app.css", 'css/app.css', {allChunks: true}),
    /*new WebpackMd5Hash()*/
  ],
  watch: true,

  module: {
    noParse: /es6-promise\.js$/,
    loaders: [
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192&name=img/[name].[ext]'
      },
      {test: /\.vue$/, loader: 'vue'},
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
      /**
       * 不满足amd,cmd规范的模块,用如下方式进行处理
       * { test: require.resolve("./src/js/tool/swipe.js"),  loader: "exports?swipe"}
       * 引用方式,require('./tool/swipe.js');
       */
    ]
  },
  resolve: {
    root: '', //指定路径查找
    extensions: ['', '.js', '.json', '.scss'],//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      /**
       * jquery: "/path/to/jquery-git2.min.js"  //后续直接 require('jquery') 即可
       */
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
};
