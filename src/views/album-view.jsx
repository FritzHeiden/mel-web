import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDotCircle,
  faDownload,
  faCheck,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import NavigationHistoryBar from '../components/navigation-history-bar'
import styles from './album-view.sass'
import DownloadService from '../services/download-service'
import AlbumCover from '../components/album-cover'

export default class AlbumView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.initialize().then()
  }

  componentWillReceiveProps () {
    this.initialize().then()
  }

  async initialize () {
    const { albumId } = this.props

    const downloadService = DownloadService.getInstance()
    downloadService.onDownloadListChange(() => this.setState(this.state))
    this.state.downloadService = downloadService

    this.state.album = await this.loadAlbum(albumId)
    this.setState(this.state)
  }

  async loadAlbum (albumId) {
    const { melClientSocket } = this.props

    let album = await melClientSocket.getAlbum(albumId)

    let tracks = []
    for (let track of album.getTracks()) {
      tracks.push(await melClientSocket.getTrack(track.getId()))
    }
    album.setTracks(tracks)

    album.setArtist(await melClientSocket.getArtist(album.getArtist().getId()))

    return album
  }

  addToDownloads () {
    const { downloadService, album } = this.state
    downloadService.addAlbum(album)
    this.setState(this.state)
  }

  render () {
    const { melHttpService } = this.props
    const { album } = this.state
    if (album) {
      return (
        <div className={styles.wrapper}>
          <NavigationHistoryBar
            locations={[
              { name: 'Library', url: '/' },
              {
                name: album.getArtist().getName(),
                url: `/artist/${album.getArtist().getId()}`,
                icon: faUser
              },
              {
                name: album.getTitle(),
                url: `/album/${album.getId()}`,
                icon: faDotCircle
              }
            ]}
          />
          <div className={styles.albumWrapper}>
            <div className={styles.albumInfo}>
              <div className={styles.coverWrapper}>
                <AlbumCover
                  albumId={album.getId()}
                  className={styles.cover}
                  melHttpService={melHttpService}
                />
              </div>
              <h1 className={styles.albumTitle}>{album.getTitle()}</h1>
              {this.renderDownloadButton()}
            </div>
            <div className={styles.musicWrapper}>
              <h2>Tracks</h2>
              {this.renderTracks()}
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading ...</div>
    }
  }

  renderDownloadButton () {
    const { downloadService, album } = this.state

    let icon = faDownload
    let text = 'Add to Downloads'
    if (downloadService.containsAlbum(album)) {
      icon = faCheck
      text = 'In Downloads List'
    }
    return (
      <div className={styles.download} onClick={() => this.addToDownloads()}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>{text}</div>
      </div>
    )
  }

  renderTracks () {
    const { album } = this.state
    const tracks = album.getTracks()

    const discNumbers = []
    tracks.forEach(track => {
      const number = track.getDiscNumber()
      if (number && discNumbers.indexOf(number) === -1) discNumbers.push(number)
    })

    const elements = []
    discNumbers.sort((a, b) => a - b).forEach(discNumber => {
      if (discNumbers.length > 1) elements.push(<h3>{'Disc ' + discNumber}</h3>)
      elements.push(
        <div key={discNumber} className={styles.discWrapper}>
          {tracks
            .filter(track => track.getDiscNumber() === discNumber)
            .map(track => (
              <div key={track.getId()} className={styles.trackWrapper}>
                <div className={styles.number}>{track.getNumber()}</div>
                <div className={styles.title}>{track.getTitle()}</div>
              </div>
            ))}
        </div>
      )
    })
    return elements
  }
}
