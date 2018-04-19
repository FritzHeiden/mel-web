import { Response } from 'mel-core'

export default class ExpressResponse extends Response {
  constructor (response) {
    super()
    this._response = response
  }

  send (body) {
    this._response.status(this._status).send(body)
  }

  sendFile (relativeFilePath) {
    this._response.status(this._status).sendFile(relativeFilePath)
  }

  setHeader (field, value) {
    this._response.set(field, value)
  }
}
