const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require("webpack-merge");
const base = require("./webpack.config")(false);
const path = require("path");

module.exports = merge(base, {
  mode: "production",
  devtool: "nosources-source-map", //https://webpack.js.org/configuration/devtool/ && https://github.com/webpack/webpack/issues/5627#issuecomment-389492939
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/src/index-prod.html"),
      filename: "index-prod.html"
    }),
    new CspHtmlWebpackPlugin(
      {
        "base-uri": ["'self'"],
        "object-src": ["'none'"],
        "script-src": ["'unsafe-eval'", "https://www.youtube.com", "https://s.ytimg.com"],
        "style-src": ["'self'"],
        "frame-src": ["https://www.youtube.com", "https://content.googleapis.com"],
        "worker-src": ["'none'"]
      },
      {
        hashEnabled: {
          "style-src": false
        }
      }
    )
  ]
});
