const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: `${__dirname}/public`,
    filename: "finch-sdk.js",
    library: "FinchCheckout",
    libraryTarget: "umd"
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "env",
                  {
                    modules: "umd",
                    targets: {
                      browsers: ["last 2 Chrome versions"]
                    }
                  }
                ]
              ],
              plugins: ["add-module-exports"]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png)$/,
        loaders: "url-loader"
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: [require("autoprefixer")({ grid: true })]
            }
          }
        ]
      }
    ]
  },
  devtool: "source-map",
  devServer: {
    host: "localhost",
    port: "3030",
    compress: true,
    hot: true,
    watchOptions: {
      poll: true
    }
  }
};
