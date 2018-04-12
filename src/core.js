import { MelCore } from 'mel-core'
import ExpressWebServer from 'src/web/express-web-server'
import NodeFileSystem from 'src/file-system/node-file-system'
import NedbDatabase from 'src/database/nedb-database'
import SocketIoWebSocket from 'src/network/socket-io-web-socket'

export class MelServer {
  async start () {
    this._melCore = new MelCore()
    let fileSystem = new NodeFileSystem()
    this._melCore.fileSystem = fileSystem
    let expressWebServer = new ExpressWebServer()
    this._melCore.webServer = expressWebServer
    this._melCore.database = new NedbDatabase(fileSystem.APPLICATION_DIRECTORY)
    this._melCore.webSocket = new SocketIoWebSocket(expressWebServer.server)
    await this._melCore.initialize()
  }

  async refreshFiles () {
    await this._melCore.refreshFiles()
  }

  get port () {
    return this._melCore.webServer.port
  }
}

let main = async () => {
  const melServer = new MelServer()
  await melServer.start()

  console.log(`MelServer started at port ${melServer.port}`)
  await melServer.refreshFiles()
}

main().catch(err => console.error(err))
