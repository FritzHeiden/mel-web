import express from 'express'
import http from 'http'
import path from 'path'
import { WebServer } from 'mel-core'
import ExpressResponse from './express-response'

export default class ExpressWebServer extends WebServer {
  constructor () {
    super()
    this._app = express()
    this._server = http.createServer(this._app)
    this.port = 3541
    this._servingDirectory = ''
  }

  _get (uri, callback) {
    this._app.get(uri, (request, response) => {
      response.set('Content-Type', 'text/plain')
      callback(null, new ExpressResponse(response))
    })
  }

  _static (directoryPath) {
    this._servingDirectory = directoryPath
    this._app.use(express.static(directoryPath, { fallthrough: true }))
  }

  start () {
    return new Promise((resolve, reject) => {
      try {
        this._app.get('*', (request, response) =>
          response.sendFile(path.join(this._servingDirectory, 'index.html'))
        )
        this._server.listen(this.port, resolve)
      } catch (e) {
        reject(e)
      }
    })
  }

  get port () {
    return this._port
  }

  set port (port) {
    this._port = port
  }

  get server () {
    return this._server
  }
}
