const { resolve } = require("path");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: "production",
  output: {
    path: resolve(__dirname, "build"),
    filename: "index.js",
  },
  module: {
    rules: [{ test: /\.ts?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    typeorm: "commonjs typeorm",
  },
};
