import index from 'raw-loader!./html/index.html'
import webapp from 'raw-loader!../dist/web-app.js'
import styles from 'raw-loader!../dist/styles.css'
import robotoRegularFont from 'raw-loader!../dist/res/fonts/Roboto/Roboto-Regular.ttf'
import openSansRegularFont from 'raw-loader!../dist/res/fonts/Open_Sans/OpenSans-Regular.ttf'

const GENERIC_BINARY = 'application/octet-stream'
const TTF = GENERIC_BINARY
const HTML = 'text/html'
const CSS = 'text/css'
const JS = 'application/javascript'

export default class WebApp {
  constructor () {
    this._index = index
      .substr(0, index.length - 1)
      .replace('module.exports = "', '')
    this._index = this._index.replace(/\\n/g, '\n')
    this._index = this._index.replace(/\\"/g, '"')
  }

  getRoutes () {
    return [
      {uri: '/', method: 'GET', callback: this._getCallback(this._index, HTML)},
      {uri: '/index.html', method: 'GET', callback: this._getCallback(this._index, HTML)},
      {uri: '/styles.css', method: 'GET', callback: this._getCallback(styles, CSS)},
      {uri: '/web-app.js', method: 'GET', callback: this._getCallback(webapp, JS)},
      {
        uri: '/res/fonts/Roboto/Roboto-Regular.ttf',
        method: 'GET',
        callback: this._getCallback(robotoRegularFont, TTF)
      },
      {
        uri: '/res/fonts/Open_Sans/OpenSans-Regular.ttf',
        method: 'GET',
        callback: this._getCallback(openSansRegularFont, TTF)
      },
    ]
  }

  _getCallback (body, mime) {
    return (request, response) => {
      response.body = body
      response.status = 200
      response.setHeader('Content-Type', mime)
      response.send()
    }
  }
}