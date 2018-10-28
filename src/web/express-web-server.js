import express from 'express'
import http from 'http'
import path from 'path'
import { WebServer } from 'mel-core'
import fs from 'fs'

import ExpressResponse from './express-response'
import ExpressRequest from './express-request'

export default class ExpressWebServer extends WebServer {
  constructor () {
    super()
    this._app = express()
    this._server = http.createServer(this._app)
    this.port = 3541
    this._servingDirectory = ''
  }

  _get (uri, handler) {
    this._app.get(uri, (request, response) => {
      response.set('Content-Type', 'text/plain')
      handler(new ExpressRequest(request), new ExpressResponse(response))
    })
  }

  _static (directoryPath) {
    this._servingDirectory = directoryPath
    let webRoot = this.getWebRoot()
    if (!webRoot.endsWith('/')) webRoot += '(/|$)'
    let regex = '^' + webRoot
    regex = new RegExp(regex)
    this._app.get(regex, async (request, response) => {
      let filePath = request.path.replace(regex, '')
      if (!filePath.startsWith('/')) filePath = '/' + filePath
      let absolutePath = directoryPath + filePath
      console.log('SERVING', absolutePath)
      console.log(regex.toString())
      if (
        await new Promise(resolve => fs.stat(absolutePath, err => resolve(err)))
      ) {
        response.sendFile(directoryPath)
      } else {
        response.sendFile(absolutePath)
      }
    })
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
