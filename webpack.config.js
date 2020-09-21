const path = require("path");

module.exports = {
  name: "js",
  entry: "./js/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "www/static/js")
  }
};
