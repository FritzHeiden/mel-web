import { WebSocket } from 'mel-core'
import ServerSocket from 'socket.io'

export default class SocketIoWebSocket extends WebSocket {
  constructor (server, socket) {
    super()
    if (!server) {
      this._io = socket
    } else {
      this._io = new ServerSocket(server)
      this._hasServer = true
    }
  }

  on (event, callback) {
    if (event === 'connection') {
      return this._io.on(event, socket => {
        callback(new SocketIoWebSocket(null, socket))
      })
    } else {
      return this._io.on(event, callback)
    }
  }

  emit (event, data) {
    this._io.emit(event, data)
  }

  get id () {
    return this._io.id
  }
}
