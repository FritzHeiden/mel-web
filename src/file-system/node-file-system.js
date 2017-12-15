import path from 'path';
import fs from 'fs';

export default class NodeFileSystem {
    constructor() {
        this.APPLICATION_DIRECTORY = this._getApplicationDirectory();
    }

    _getApplicationDirectory() {
        return path.dirname(process.mainModule.filename);
    }

    readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(filePath), {encoding: "utf-8"}, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    readFileBuffer(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(filePath), (err, buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(buffer.buffer);
            });
        });
    }

    readDir(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            })
        });
    }

    writeFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        });
    }

    stats(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({isDirectory: stats.isDirectory(), lastModified: stats.mtime});
            })
        });
    }
}