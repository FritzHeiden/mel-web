import { Artist } from 'mel-core'
import JSZip from 'jszip'
import EventEmitter from '../tools/event-emitter'

const DOWNLOAD_LIST_CHANGE = 'download_list_change'
const TOTAL_SIZE_CHANGE = 'total_size_change'

class DownloadService {
  constructor (melHttpService) {
    this._artists = []
    this._melHttpService = melHttpService
    this._eventEmitter = new EventEmitter()
    this._totalSize = 0
    this._trackSizes = {}
  }

  get artists () {
    return this._artists
  }

  addOnDownloadListChangedListener (listener) {
    this._eventEmitter.on(DOWNLOAD_LIST_CHANGE, listener)
  }

  addOnTotalSizeChangedListener (listener) {
    this._eventEmitter.on(TOTAL_SIZE_CHANGE, listener)
  }

  addArtist (newArtist) {
    let artist = this._artists.find(artist => artist.id === newArtist.id)
    if (!artist) {
      this._artists.push(newArtist)
    } else {
      newArtist.album.forEach(album => this.addAlbum(album))
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newArtist.albums.forEach(album =>
      album.tracks.forEach(track => this._fetchTrackSize(track.id)))
  }

  addAlbum (newAlbum) {
    let artist = this._artists.find(artist => artist.id === newAlbum.artist.id)
    if (!artist) {
      let artist = newAlbum.artist
      artist.addAlbum(newAlbum)
      this._artists.push(artist)
    } else {
      let album = artist.albums.find(album => album.id === newAlbum.id)
      if (!album) {
        artist.addAlbum(newAlbum)
      } else {
        newAlbum.tracks.forEach(track => this.addTrack(track))
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newAlbum.tracks.forEach(track => this._fetchTrackSize(track.id))
  }

  addTrack (newTrack) {
    let artist = this._artists.find(
      artist => artist.id === newTrack.album.artist.id
    )
    if (!artist) {
      let album = newTrack.album
      album.addTrack(newTrack)
      let artist = album.artist
      artist.addAlbums(album)
      this._artists.push(artist)
    } else {
      let album = artist.albums.find(album => album.id === newTrack.album.id)
      if (!album) {
        let album = newTrack.album
        album.addTrack(newTrack)
        artist.addAlbum(album)
      } else {
        let track = album.tracks.find(track => track.id === newTrack.id)
        if (!track) {
          album.addTrack(newTrack)
        }
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    this._fetchTrackSize(newTrack.id)
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
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
  }

  async startDownload () {
    const zip = new JSZip()
    for (let artist of this._artists) {
      const artistFolder = zip.folder(artist.name)
      for (let album of artist.albums) {
        let folderName = album.title
        if (typeof album.year === 'number') {
          folderName = `${album.year} - ${album.title}`
        }
        const albumFolder = artistFolder.folder(folderName)
        for (let track of album.tracks) {
          console.log('Downloading', track.id, '...')
          const buffer = await this._melHttpService.downloadTrack(track.id)
          let fileName = track.title + '.mp3'
          if (typeof track.number === 'number') {
            fileName =
              `${track.number}`.padStart(2, '0') + ` - ${track.title}.mp3`
          }
          albumFolder.file(fileName, buffer)
        }
      }
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    location.href = URL.createObjectURL(blob)
  }

  async _fetchTrackSize(trackId) {
    const {size} = await this._melHttpService.getTrackDataInfo(trackId)
    this._totalSize += size
    this._trackSizes[trackId] = size
    this._eventEmitter.invokeAll(TOTAL_SIZE_CHANGE, this._totalSize)
    return size
  }

  getTrackSize (trackId) {
    return this._trackSizes[trackId]
  }

  getTotalSize () {
    return this._totalSize
  }
}

let downloadService = {
  _instance: null,
  initialize (melHttpService) {
    this._instance = new DownloadService(melHttpService)
  },
  getInstance () {
    return this._instance
  }
}

export default downloadService
