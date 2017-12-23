import { MelCore } from 'mel-core'
import WebServer from 'src/web/web-server'
import NodeFileSystem from 'src/file-system/node-file-system'
import NedbDatabase from 'src/database/nedb-database'

class Core {
  async start () {
    let melCore = new MelCore()
    let fileSystem = new NodeFileSystem()
    melCore.fileSystem = fileSystem
    melCore.webServer = new WebServer(3541)
    melCore.database = new NedbDatabase(fileSystem.APPLICATION_DIRECTORY)
    await melCore.initialize()

    // await melCore.refreshFiles()
    console.log('done')
  }
}

const core = new Core()
core.start()
