const path = require('path')
const fs = require('fs')

const DIST_DIR = path.join(__dirname, 'dist')
const SRC_DIR = path.join(__dirname, 'src')
const MODULES_DIR = path.join(__dirname, 'node_modules')
const MEL_WEB_DIR = fs.realpathSync(
  path.join(MODULES_DIR, 'mel-core/dist/mel-web')
)

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
      },
      {
        test: /.+/,
        loader: 'file-loader',
        include: MEL_WEB_DIR,
        options: {
          name: '[path][name].[ext]',
          outputPath: 'mel-web',
          context: MEL_WEB_DIR
        }
      }
    ]
  },
  externals: nodeModules
}
