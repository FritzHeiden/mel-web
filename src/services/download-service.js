import { Artist } from 'mel-core'

class DownloadService {
  constructor (melHttpService) {
    this._artists = []
    this._listeners = []
    this._melHttpService = melHttpService
  }

  get artists () {
    return this._artists
  }

  addOnDownloadListChangedListener (listener) {
    this._listeners.push(listener)
  }

  addArtist (newArtist) {
    let artist = this._artists.find(artist => (artist.id = newArtist.id))
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
    let artist = this._artists.find(
      artist => artist.id === newTrack.album.artist.id
    )
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
    let artist = this._artists.find(
      artist => artist.id === needleAlbum.artist.id
    )
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

  async startDownload () {
    let tracks = []
    this._artists.forEach(artist =>
      artist.albums.forEach(album =>
        album.tracks.forEach(track => tracks.push(track))
      )
    )

    const buffers = {}
    for (let track of tracks) {
      console.log('Downloading', track.id, '...')
      buffers[track.id] = await this._melHttpService.downloadTrack(track.id)
    }
    console.log(buffers)
  }
}

let downloadService = {
  _instance: null,
  initialize (melHttpService) {
    this._instance = new DownloadService(melHttpService)
  },
  getInstance () {
    console.log('GETTING DOWNLOAD SERVICE INSTANCE', this._instance)
    return this._instance
  }
}

export default downloadService
