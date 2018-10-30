import 'babel-polyfill'
import { MelCore } from 'mel-core'

import ExpressWebServer from './web/express-web-server'
import NodeFileSystem from './file-system/node-file-system'
import NedbDatabase from './database/nedb-database'
import SocketIoWebSocket from './network/socket-io-web-socket'

const RELATIVE_CONFIG_PATH = '/config.json'
const RELATIVE_MEL_WEB_PATH = '/www'

export class MelServer {
  async start () {
    this._melCore = new MelCore()
    let fileSystem = new NodeFileSystem()
    this._melCore.fileSystem = fileSystem
    let expressWebServer = new ExpressWebServer()
    this._melCore.webServer = expressWebServer
    this._melCore.database = new NedbDatabase(fileSystem.APPLICATION_DIRECTORY)
    this._melCore.webSocket = new SocketIoWebSocket(expressWebServer.server)
    await this._melCore.initialize({
      configPath: fileSystem.APPLICATION_DIRECTORY + RELATIVE_CONFIG_PATH,
      melWebPath: fileSystem.APPLICATION_DIRECTORY + RELATIVE_MEL_WEB_PATH
    })
  }

  async refreshFiles () {
    await this._melCore.refreshFiles()
  }

  getPort () {
    return this._melCore.webServer.getPort()
  }
}

let main = async () => {
  const melServer = new MelServer()
  await melServer.start()

  console.log(`MelServer started at port ${melServer.getPort()}`)
  await melServer.refreshFiles()
}

main().catch(err => console.error(err))
