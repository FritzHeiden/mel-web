import express from 'express';

export default class WebServer {
    constructor(port = 3541) {
        this.webServer = express();
        this.port = port;
    }

    get(uri, callback) {
        this.webServer.get(uri, (request, response) => {
            response.set("Content-Type", "text/plain");
            callback({}, {
                _status: 200,
                set body(body) {
                    this._body = body;
                },
                get body() {
                    return this._body
                },
                set status(status) {
                    this._status = status;
                },
                get status() {
                    return this._status;
                },
                setHeader(key, value) {
                    response.set(key, value);
                },
                send() {
                    response.status(this.status).send(this.body);
                }
            });
        });
    }

    start() {
        return new Promise((resolve, reject) => {
            try {
                this.webServer.listen(this.port, resolve);
            } catch(e) {
                reject(e);
            }
        });
    }

    get port() {
        return this._port;
    }

    set port(port) {
        this._port = port;
    }
}