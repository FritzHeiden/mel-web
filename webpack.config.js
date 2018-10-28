const path = require('path')
const fs = require('fs')

const DIST_DIR = path.join(__dirname, 'dist')
const SRC_DIR = path.join(__dirname, 'src')
let nodeModules = {}
fs
  .readdirSync(path.resolve(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => {
    nodeModules[mod] = `commonjs ${mod}`
  })

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', path.join(SRC_DIR, './core.js')],
  output: {
    filename: 'mel-server.js',
    path: DIST_DIR
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: nodeModules
}
