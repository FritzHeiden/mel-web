import React from 'react'
import {
  faTimes,
  faListUl,
  faDownload
} from '@fortawesome/free-solid-svg-icons'

import styles from './download-bar.sass'
import DownloadService from '../services/download-service'
import Button from './atoms/button'

class DownloadManager extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    const downloadService = DownloadService.getInstance()
    downloadService.onDownloadListChange(artists => {
      this.state.artists = artists
      this.setState(this.state)
    })
    downloadService.onTotalSizeChange(totalSize => {
      this.state.totalSize = totalSize
      this.setState(this.state)
    })
    downloadService.onStateChange(state => {
      this.state.downloadState = state
      this.setState(this.state)
    })
    downloadService.onCurrentTrackChange(track => {
      if (track) {
        this.state.currentTrack = track
        this.setState(this.state)
      }
    })
    this.state.downloadService = downloadService
    this.state.downloadState = downloadService.getState()
    this.state.artists = downloadService.getArtists()
    this.state.totalSize = downloadService.getTotalSize()
  }

  render () {
    if (!this.state.artists || this.state.artists.length === 0) {
      return this._renderHidden()
    }

    const { downloadService, downloadState } = this.state

    let text = ''

    switch (downloadState) {
      case DownloadService.PENDING:
        text = this.textPending()
        break
      case DownloadService.DOWNLOADING:
        text = this.textDownloading()
        break
      case DownloadService.ZIPPING:
        text = 'Compressing files ...'
        break
      case DownloadService.DONE:
        text = 'Download successful!'
        break
    }

    return (
      <div className={styles.wrapper + ' ' + styles.minimized}>
        <div className={styles.text}>{text}</div>
        <Button
          className={styles.button}
          icon={faTimes}
          label={'Discard'}
          onClick={() => downloadService.deleteList()}
        />
        <Button
          className={styles.button}
          icon={faListUl}
          label={'Open List'}
          onClick={() => this.props.history.push('/downloads')}
        />
        <Button
          className={styles.button}
          icon={faDownload}
          label={'Download'}
          accent
          onClick={() => downloadService.startDownload()}
        />
      </div>
    )
  }

  textPending () {
    const { totalSize, artists } = this.state
    let artistCount = 0
    let albumCount = 0
    let trackCount = 0

    for (let artist of artists) {
      artistCount++
      for (let album of artist.getAlbums()) {
        albumCount++
        for (let track of album.getTracks()) {
          trackCount++
        }
      }
    }

    return (
      `${artistCount} Artists, ` +
      `${albumCount} Albums, ` +
      `${trackCount} Tracks selected for download. ` +
      `(${this._formatSize(totalSize)})`
    )
  }

  textDownloading () {
    const { currentTrack } = this.state
    return `Downloading ${currentTrack.getTitle()} ...`
  }

  _formatSize (size) {
    const KB = 1000
    const MB = 1000000
    const GB = 1000000000
    if (size < MB) {
      return String(Math.floor(size / KB * 100) / 100) + ' KB'
    } else if (size < GB) {
      return String(Math.floor(size / MB * 100) / 100) + ' MB'
    } else {
      return String(Math.floor(size / GB * 100) / 100) + ' GB'
    }
  }

  _renderHidden () {
    return <div className={styles.wrapper + ' ' + styles.hidden} />
  }
}

export default DownloadManager