import { WebSocket } from 'mel-core'
import SocketClient from 'socket.io-client'

export default class SocketIoWebSocket extends WebSocket {
  constructor (host, port, { webRoot }) {
    super()
    this._host = host
    this._port = port
    this._webRoot = '/'
    if (webRoot) this._webRoot = webRoot
  }

  connect () {
    console.log('Connecting to server ...')
    let protocol = location.protocol
    this._io = SocketClient(`${protocol}//${this._host}:${this._port}`, {
      path: this._webRoot + 'socket'
    })
  }

  emit (event, data) {
    return this._io.emit(event, data)
  }

  on (event, callback) {
    return this._io.on(event, callback)
  }
}
