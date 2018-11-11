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
    this.state.downloadService = DownloadService.getInstance()
    this._gatherProps(props)
    this._loadAlbum()
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
    this._loadAlbum()
  }

  _gatherProps (props) {
    this.state.melClientSocket = props.melClientSocket
    this.state.albumId = props.match.params.albumId
  }

  async _loadAlbum () {
    let album = await this.state.melClientSocket.getAlbum(this.state.albumId)

    let tracks = []

    for (let track of album.getTracks()) {
      tracks.push(await this.state.melClientSocket.getTrack(track.getId()))
    }

    album.setTracks(tracks)
    album.setArtist(
      await this.state.melClientSocket.getArtist(album.getArtist().getId())
    )

    console.log(album)

    this.state.album = album
    this.setState(this.state)
  }

  _addToDownloads () {
    const { downloadService } = this.state

    downloadService.addAlbum(this.state.album)
    this.setState(this.state)
  }

  render () {
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
                  melHttpService={this.props.melHttpService}
                />
              </div>
              <h1 className={styles.albumTitle}>
                {this.state.album.getTitle()}
              </h1>
              {this._renderDownloadButton()}
            </div>
            <div className={styles.musicWrapper}>
              <h2>Tracks</h2>
              {this._renderTracks()}
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading ...</div>
    }
  }

  _renderDownloadButton () {
    const { downloadService } = this.state

    let icon
    let text
    if (downloadService.containsAlbum(this.state.album)) {
      icon = faCheck
      text = 'In Downloads List'
    } else {
      icon = faDownload
      text = 'Add to Downloads'
    }
    return (
      <div className={styles.download} onClick={() => this._addToDownloads()}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>{text}</div>
      </div>
    )
  }

  _renderTracks () {
    let cdMap = new Map()
    this.state.album.getTracks().forEach(track => {
      let caption = `Disc ${track.getDiscNumber()}`
      if (!cdMap.get(caption)) {
        cdMap.set(caption, [])
      }

      cdMap.get(caption).push(track)
    })

    let elements = []
    for (let [caption, tracks] of cdMap) {
      let captionLabel
      if (cdMap.size > 1) {
        captionLabel = <h3>{caption}</h3>
      }
      elements.push(
        <div key={caption} className={styles.discWrapper}>
          {captionLabel}
          {tracks.sort((a, b) => a.number - b.number).map(track => (
            <div key={track.getId()} className={styles.trackWrapper}>
              <div className={styles.number}>{track.getNumber()}</div>
              <div className={styles.title}>{track.getTitle()}</div>
            </div>
          ))}
        </div>
      )
    }

    return elements
  }
}
