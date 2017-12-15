import Datastore from 'nedb';

const DATABASE_DIRECTORY_NAME = "data";
const TRACKS_DB_FILENAME = "tracks.db";
const ALBUMS_DB_FILENAME = "albums.db";
const ARTISTS_DB_FILENAME = "artists.db";
const FILES_DB_FILENAME = "files.db";

export default class NedbDatabase {
    constructor(databaseDirectory) {
        this._databaseDirectory = databaseDirectory;
        this._db = {};
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this._db.artists = new Datastore({filename: "{0}/{1}/{2}".format(this._databaseDirectory, DATABASE_DIRECTORY_NAME, ARTISTS_DB_FILENAME)});
                this._db.artists.loadDatabase();
                this._db.albums = new Datastore({filename: "{0}/{1}/{2}".format(this._databaseDirectory, DATABASE_DIRECTORY_NAME, ALBUMS_DB_FILENAME)});
                this._db.albums.loadDatabase();
                this._db.tracks = new Datastore({filename: "{0}/{1}/{2}".format(this._databaseDirectory, DATABASE_DIRECTORY_NAME, TRACKS_DB_FILENAME)});
                this._db.tracks.loadDatabase();
                this._db.files = new Datastore({filename: "{0}/{1}/{2}".format(this._databaseDirectory, DATABASE_DIRECTORY_NAME, FILES_DB_FILENAME)});
                this._db.files.loadDatabase();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    insertFile(file) {
        return new Promise((resolve, reject) => {
            let files = this._db.files;
            files.insert(file, (err, newFile) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newFile);
                }
            });
        });
    }

    readFile(filePath) {
        return new Promise((resolve, reject) => {
            let files = this._db.files;
            files.findOne({path: filePath}, (err, file) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(file);
                }
            })
        })
    }

    updateFile(file) {
        return new Promise((resolve, reject) => {
            let files = this._db.files;
            files.update({path: file.path}, file, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            })
        });
    }

    insertTrack(track) {
        return new Promise((resolve, reject) => {
            let tracks = this._db.tracks;
            tracks.insert(track, (err, newTrack) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newTrack);
                }
            });
        });
    }

    readTrack(trackId) {
        return new Promise((resolve, reject) => {
            let tracks = this._db.tracks;
            tracks.findOne({"id": trackId}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve (docs);
                }
            });
        });
    }

    // load(loadedCallback) {
    //     this.db.artists = new Datastore({filename: path.join(this.databaseDirectory, DATABASE_DIRECTORY_NAME, ARTISTS_DB_FILENAME)});
    //     this.db.artists.loadDatabase();
    //     this.db.albums = new Datastore({filename: path.join(this.databaseDirectory, DATABASE_DIRECTORY_NAME, ALBUMS_DB_FILENAME)});
    //     this.db.albums.loadDatabase();
    //     this.db.tracks = new Datastore({filename: path.join(this.databaseDirectory, DATABASE_DIRECTORY_NAME, TRACKS_DB_FILENAME)});
    //     this.db.tracks.loadDatabase();
    //     loadedCallback();
    // }
    //
    // _insertData(database, data, preProcess, callback) {
    //     if (!callback) {
    //         callback = preProcess;
    //     } else {
    //         if (preProcess) {
    //             data = data.map(data => preProcess(data));
    //         }
    //     }
    //     data.forEach(record => {
    //         this.db.updateQueue.push({db: database, data: record}, callback);
    //     });
    // }
    //
    // _getData(database, query, postProcess) {
    //     return new Promise((resolve, reject) => {
    //         this._getDataList(database, query, postProcess).then(docs => {
    //             resolve(docs[0]);
    //         }).catch(err => reject(err));
    //     })
    // }
    //
    // _getDataList(database, query, postProcess) {
    //     return new Promise((resolve, reject) => {
    //         database.find(query, (err, docs) => {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }
    //
    //             if (postProcess) {
    //                 resolve(docs.map(doc => postProcess(doc)));
    //             } else {
    //                 resolve(docs);
    //             }
    //         })
    //     });
    // }
    //
    // insertTrack(track) {
    //     this.insertTracks([track]);
    // }
    //
    // insertTracks(tracks) {
    //     this._insertData(this.db.tracks, tracks, this.serializeTrack, err => err ? console.error(err) : err);
    // }
    //
    // getTrack(trackId) {
    //     return this._getData(this.db.tracks, {id: trackId}, this.deserializeTrack);
    // }
    //
    // getTracks(trackIds) {
    //     if (trackIds) {
    //         return this._getDataList(this.db.tracks, {id: {$in: trackIds}}, this.deserializeTrack);
    //     } else {
    //         return this._getDataList(this.db.tracks, {}, this.deserializeTrack);
    //     }
    // }
    //
    // getTracksByAlbum(albumId) {
    //     return this._getDataList(this.db.tracks, {album: albumId}, this.deserializeTrack);
    // }
    //
    //
    // insertAlbum(album) {
    //     this.insertAlbums([album]);
    // }
    //
    // insertAlbums(albums) {
    //     this._insertData(this.db.albums, albums, this.serializeAlbum, err => err ? console.error(err) : err);
    // }
    //
    // getAlbum(albumId) {
    //     return this._getData(this.db.albums, {id: albumId}, this.deserializeAlbum);
    // }
    //
    // getAlbums(albumIds) {
    //     if (albumIds) {
    //         return this._getDataList(this.db.albums, {id: {$in: albumIds}}, this.deserializeAlbum);
    //     } else {
    //         return this._getDataList(this.db.albums, {}, this.deserializeAlbum);
    //     }
    // }
    //
    // getAlbumsByArtist(artistId) {
    //     return this._getDataList(this.db.albums, {artist: artistId}, this.deserializeAlbum);
    // }
    //
    // getFeatureAlbumsByArtist(artistId) {
    //     return this._getDataList(this.db.albums, {featureArtists: artistId}, this.deserializeAlbum);
    // }
    //
    //
    // insertArtist(artist) {
    //     this.insertArtists([artist]);
    // }
    //
    // insertArtists(artists) {
    //     this._insertData(this.db.artists, artists, this.serializeArtist, err => err ? console.error(err) : err);
    // }
    //
    // getArtist(artistId) {
    //     return this._getData(this.db.artists, {id: artistId}, this.deserializeArtist);
    // }
    //
    // getArtists(artistIds) {
    //     if (artistIds) {
    //         return this._getDataList(this.db.artists, {id: {$in: artistIds}}, this.deserializeArtist);
    //     } else {
    //         return this._getDataList(this.db.artists, {}, this.deserializeArtist);
    //     }
    // }
    //
}