import express from 'express'
import http from 'http'
import { WebServer } from 'mel-core'

export default class ExpressWebServer extends WebServer {
  constructor () {
    super()
    this._app = express()
    this._server = http.createServer(this._app)
    this.port = 3541
  }

  _get (uri, callback) {
    this._app.get(uri, (request, response) => {
      response.set('Content-Type', 'text/plain')
      callback(null, {
        _status: 200,
        set body (body) {
          this._body = body
        },
        get body () {
          return this._body
        },
        set status (status) {
          this._status = status
        },
        get status () {
          return this._status
        },
        setHeader (key, value) {
          response.set(key, value)
        },
        send () {
          response.status(this.status).send(this.body)
        }
      })
    })
  }

  _static (directoryPath) {
    console.log('Serving static files from ' + directoryPath)
    this._app.use(express.static(directoryPath))
  }

  start () {
    return new Promise((resolve, reject) => {
      try {
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
