import MelCore from 'mel-core'
import WebServer from "./web/web-server";
import NodeFileSystem from "src/file-system/node-file-system";
import NedbDatabase from "./database/nedb-database";

class Core {
    constructor() {
        if (!String.prototype.format) {
            String.prototype.format = function () {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] !== 'undefined'
                        ? args[number]
                        : match;
                });
            };
        }
        let melCore = new MelCore();
        let fileSystem = new NodeFileSystem();
        melCore.fileSystem = fileSystem;
        melCore.webServer = new WebServer(3541);
        melCore.database = new NedbDatabase(fileSystem.APPLICATION_DIRECTORY);
        melCore.initialize().then(() => {
            melCore.refreshFiles();
        });
    }
}

new Core();