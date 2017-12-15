import Deserializer from "../tools/deserializer";

export default class MelService {
    constructor() {
        this._deserializer = new Deserializer();
    }

    getTracks() {
        return new Promise((resolve, reject) => this._sendRequest("GET", "/api/tracks")
            .then(response => resolve(this._deserializer.deserializeTracks(JSON.parse(response).tracks)))
            .catch(err => reject(err)));
    }

    getArtist(artistId) {
        return new Promise((resolve, reject) => this._sendRequest("GET", "/api/artists/" + artistId)
            .then(response => resolve(this._deserializer.deserializeArtist(JSON.parse(response).artist)))
            .catch(err => reject(err)));
    }

    getArtists() {
        return new Promise((resolve, reject) => this._sendRequest("GET", "/api/artists")
            .then(response => resolve(this._deserializer.deserializeArtists(JSON.parse(response).artists)))
            .catch(err => reject(err)));
    }

    getAlbum(albumId) {
        return new Promise((resolve, reject) => this._sendRequest("GET", "/api/albums/" + albumId)
            .then(response => resolve(this._deserializer.deserializeAlbum(JSON.parse(response).album)))
            .catch(err => reject(err)));
    }

    _sendRequest(method, url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(request.responseText);
                    } else {
                        reject(request.status);
                    }
                }
            };
            request.open(method, url, true);
            request.send();
        });
    }
}