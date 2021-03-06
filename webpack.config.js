var webpack = require('webpack');
module.exports = {
  entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  module: {//在配置文件里添加JSON loader
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
      }
    ]
  },
  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    inline: true//实时刷新
  }
}