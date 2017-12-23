var path = require('path')
var WebpackLinkPlugin = require('webpack-link')

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
  plugins: [
    new WebpackLinkPlugin({
      loadModule: path.resolve(__dirname, '../mel-core')
    })
  ],
  target: 'node'
  // plugins: [
  //     new webpack.DefinePlugin({
  //         'process.env.NODE_ENV': JSON.stringify('development')
  //     })
  // ]
}
