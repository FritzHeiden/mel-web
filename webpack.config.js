var path = require('path')
var fs = require('fs')

var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

var DIST_DIR = path.join(__dirname, 'dist')
var CLIENT_DIR = path.join(__dirname, 'src')

module.exports = {
  context: CLIENT_DIR,
  entry: {
    path: path.join(CLIENT_DIR, './core.js')
  },
  output: {
    filename: './mel-server.js',
    path: DIST_DIR
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$|\.jsx$/,
        use: [{loader: 'source-map-loader'}],
        enforce: 'pre'
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {loader: 'raw-loader'}
      }
    ]
  },
  target: 'node',
  externals: nodeModules
  // plugins: [
  //     new webpack.DefinePlugin({
  //         'process.env.NODE_ENV': JSON.stringify('development')
  //     })
  // ]
}
