import { Artist } from 'mel-core'

class DownloadService {
  constructor () {
    this._artists = []
    this._listeners = []
  }

  get artists () {
    return this._artists
  }

  addOnDownloadListChangedListener (listener) {
    this._listeners.push(listener)
  }

  addArtist (newArtist) {
    let artist = this._artists.find(artist => artist.id = newArtist.id)
    if (!artist) {
      this._artists.push(newArtist)
      this._listeners.forEach(listener => listener(this._artists))
    } else {
      newArtist.album.forEach(album => this.addAlbum(album))
    }
  }

  addAlbum (newAlbum) {
    let artist = this._artists.find(artist => artist.id === newAlbum.artist.id)
    if (!artist) {
      let artist = new Artist(newAlbum.artist.id, newAlbum.artist.name)
      artist.addAlbum(newAlbum)
      this._artists.push(artist)
      this._listeners.forEach(listener => listener(this._artists))
    } else {
      let album = artist.albums.find(album => album.id === newAlbum.id)
      if (!album) {
        artist.addAlbum(newAlbum)
        this._listeners.forEach(listener => listener(this._artists))
      } else {
        newAlbum.tracks.forEach(track => {
          track.album = newAlbum
          this.addTrack(track)
        })
      }
    }
  }

  addTrack (newTrack) {
    let artist = this._artists.find(artist => artist.id === newTrack.album.artist.id)
    if (!artist) {
      let album = newTrack.album
      album.addTrack(newTrack)
      let artist = newTrack.album.artist
      artist.addAlbums(album)
      this._artists.push(artist)
      this._listeners.forEach(listener => listener(this._artists))
    } else {
      let album = artist.albums.find(album => album.id === newTrack.album.id)
      if (!album) {
        let album = newTrack.album
        album.addTrack(newTrack)
        artist.addAlbum(album)
        this._listeners.forEach(listener => listener(this._artists))
      } else {
        let track = album.tracks.find(track => track.id === newTrack.id)
        if (!track) {
          album.addTrack(newTrack)
          this._listeners.forEach(listener => listener(this._artists))
        }
      }
    }
  }

  containsAlbum (needleAlbum) {
    let artist = this._artists.find(artist => artist.id === needleAlbum.artist.id)
    if (!artist) {
      return false
    }
    let album = artist.albums.find(album => album.id === needleAlbum.id)
    if (!album) {
      return false
    }

    for (let needleTrack of needleAlbum.tracks) {
      if (!album.tracks.find(track => track.id === needleTrack.id)) {
        return false
      }
    }

    return true
  }

  deleteList () {
    this._artists = []
    this._listeners.forEach(listener => listener(this._artists))
  }
}

let downloadService = new DownloadService()

export default downloadService