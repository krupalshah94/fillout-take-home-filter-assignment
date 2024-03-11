var path =  require('path');

module.exports = {
  mode: 'production',
  entry: ["./src/index.ts"],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname,"dist")
  },
  module: {
    rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
    ]
  },
  resolve: {
    extensions: [".ts",".js",".json"]
  },
  target: 'node',
  node: {
        __dirname: true
    },
  plugins: []
};