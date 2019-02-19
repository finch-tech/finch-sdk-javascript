const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: `${__dirname}/dist`,
    filename: "finch-sdk.min.js",
    library: "FinchCheckout",
    libraryTarget: "umd"
  },
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
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  }
};
