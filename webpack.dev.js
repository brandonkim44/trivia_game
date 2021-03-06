const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    publicPath: '/dist',
    contentBase: "./",
    hot: true,
    watchContentBase: true,
    open: "Google Chrome",
  },
});