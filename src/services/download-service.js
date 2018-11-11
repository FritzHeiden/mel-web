import { Artist, Album } from 'mel-core'
import JSZip from 'jszip'
import EventEmitter from '../tools/event-emitter'

const DOWNLOAD_LIST_CHANGE = 'download_list_change'
const TOTAL_SIZE_CHANGE = 'total_size_change'
const TOTAL_LOADED_CHANGE = 'total_loaded_change'
const CURRENT_TRACK_CHANGE = 'current_track_change'
const STATE_CHANGE = 'state_change'

const PENDING = 'pending'
const DOWNLOADING = 'downloading'
const ZIPPING = 'zipping'
const DONE = 'done'

class DownloadService {
  constructor (melHttpService) {
    this._artists = []
    this._melHttpService = melHttpService
    this._eventEmitter = new EventEmitter()
    this._totalSize = 0
    this._trackSizes = {}
    this._totalLoaded = 0
    this._currentTrack = null
    this._state = PENDING
    this.onDownloadListChange(() => this._setState(PENDING))
  }

  get artists () {
    return this._artists
  }

  onDownloadListChange (listener) {
    this._eventEmitter.on(DOWNLOAD_LIST_CHANGE, listener)
  }

  onTotalSizeChange (listener) {
    this._eventEmitter.on(TOTAL_SIZE_CHANGE, listener)
  }

  onCurrentTrackChange (listener) {
    this._eventEmitter.on(CURRENT_TRACK_CHANGE, listener)
  }

  onStateChange (listener) {
    this._eventEmitter.on(STATE_CHANGE, listener)
  }

  addArtist (newArtist) {
    let artist = this._artists.find(
      artist => artist.getId() === newArtist.getId()
    )
    if (!artist) {
      this._artists.push(artist)
    } else {
      newArtist.album.forEach(album => this.addAlbum(album))
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newArtist
      .getAlbums()
      .forEach(album =>
        album.getTracks().forEach(track => this._fetchTrackSize(track.getId()))
      )
  }

  addAlbum (newAlbum) {
    let artist = this._artists.find(
      artist => artist.getId() === newAlbum.getArtist().getId()
    )
    if (!artist) {
      // We only want our artist to have id and name
      const id = newAlbum.getArtist().getId()
      const name = newAlbum.getArtist().getName()
      let artist = new Artist(id, name)
      artist.addAlbum(newAlbum)
      this._artists.push(artist)
    } else {
      let album = artist
        .getAlbums()
        .find(album => album.getId() === newAlbum.getId())
      if (!album) {
        artist.addAlbum(newAlbum)
      } else {
        newAlbum.getTracks().forEach(track => this.addTrack(track))
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newAlbum.getTracks().forEach(track => this._fetchTrackSize(track.getId()))
  }

  addTrack (newTrack) {
    let artist = this._artists.find(
      artist =>
        artist.getId() ===
        newTrack
          .getAlbum()
          .getArtist()
          .getId()
    )
    if (!artist) {
      let album = newTrack.getAlbum()
      const albumId = album.getId()
      const title = album.getTitle()
      const year = album.getYear()
      album = new Album(albumId, null, title, year)
      album.addTrack(newTrack)

      let artist = album.getArtist()
      const artistId = artist.getId()
      const artistName = artist.getName()
      artist = new Artist(artistId, artistName)
      artist.addAlbums(album)
      this._artists.push(artist)
    } else {
      let album = artist
        .getAlbums()
        .find(album => album.getId() === newTrack.getAlbum().getId())
      if (!album) {
        let album = newTrack.getAlbum()
        const id = album.getId()
        const title = album.getTitle()
        const year = album.getYear()
        album = new Album(id, null, title, year)
        album.addTrack(newTrack)
        artist.addAlbum(album)
      } else {
        let track = album
          .getTracks()
          .find(track => track.getId() === newTrack.getId())
        if (!track) {
          album.addTrack(newTrack)
        }
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    this._fetchTrackSize(newTrack.getId())
  }

  containsAlbum (needleAlbum) {
    let artist = this._artists.find(
      artist => artist.getId() === needleAlbum.getArtist().getId()
    )
    if (!artist) {
      return false
    }
    let album = artist
      .getAlbums()
      .find(album => album.getId() === needleAlbum.getId())
    if (!album) {
      return false
    }

    for (let needleTrack of needleAlbum.getTracks()) {
      if (
        !album.getTracks().find(track => track.getId() === needleTrack.getId())
      ) {
        return false
      }
    }

    return true
  }

  deleteList () {
    this._artists = []
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    this._totalSize = 0
    this._currentTrack = null
    this._trackSizes = {}
    this._state = PENDING
    this._totalLoaded = 0
  }

  async startDownload () {
    this._setState(DOWNLOADING)
    const zip = new JSZip()
    console.log('ARTISTS', this._artists)
    for (let artist of this._artists) {
      let artistFolder = zip.folder(artist.getName())

      for (let album of artist.getAlbums()) {
        let folderName = album.getTitle()
        if (typeof album.getYear() === 'number') {
          folderName = `${album.getYear()} - ${album.getTitle()}`
        }
        let albumFolder = artistFolder.folder(folderName)

        for (let track of album.getTracks()) {
          this._setCurrentTrack(track.getId())
          const buffer = await this._melHttpService.downloadTrack(track.getId())
          this._setCurrentTrack(null)

          let fileName = track.getTitle() + '.mp3'
          if (typeof track.getNumber() === 'number') {
            fileName =
              `${track.getNumber()}`.padStart(2, '0') +
              ` - ${track.getTitle()}.mp3`
          }
          albumFolder.file(fileName, buffer)
          console.log(zip)
        }
      }
    }
    this._setState(ZIPPING)
    const blob = await zip.generateAsync({ type: 'blob' })
    location.href = URL.createObjectURL(blob)
    this._setState(DONE)
  }

  async _fetchTrackSize (trackId) {
    const { size } = await this._melHttpService.getTrackDataInfo(trackId)
    this._totalSize += size
    this._trackSizes[trackId] = size
    this._eventEmitter.invokeAll(TOTAL_SIZE_CHANGE, this._totalSize)
    return size
  }

  _setCurrentTrack (trackId) {
    this._artists.forEach(artist =>
      artist.getAlbums().forEach(album => {
        const track = album.getTracks().find(track => track.getId() === trackId)
        this._currentTrack = track
        this._eventEmitter.invokeAll(CURRENT_TRACK_CHANGE, track)
      })
    )
  }

  getCurrentTrack () {
    return this._currentTrack
  }

  _setState (state) {
    if (state !== this._state) {
      this._state = state
      this._eventEmitter.invokeAll(STATE_CHANGE, this._state)
    }
  }

  getState () {
    return this._state
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
  PENDING,
  DOWNLOADING,
  ZIPPING,
  DONE,
  initialize (melHttpService) {
    this._instance = new DownloadService(melHttpService)
  },
  getInstance () {
    return this._instance
  }
}

export default downloadService
