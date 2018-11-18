import React from 'react'
import {
  faTimes,
  faListUl,
  faDownload,
  faBan
} from '@fortawesome/free-solid-svg-icons'

import styles from './download-bar.sass'
import DownloadService from '../services/download-service'
import Button from './atoms/button'
import StringFormatter from '../utils/string-formatter'

class DownloadBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    const downloadService = DownloadService.getInstance()
    downloadService.onDownloadListChange(downloadItems => {
      this.state.downloadItems = downloadItems
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
    downloadService.onCurrentItemChange(item => {
      if (item) {
        this.state.currentItem = item
        this.setState(this.state)
      }
    })
    this.state.downloadService = downloadService
    this.state.downloadState = downloadService.getState()
    this.state.downloadItems = downloadService.getDownloadItems()
    this.state.totalSize = downloadService.getTotalSize()
  }

  render () {
    const { downloadService, downloadState, downloadItems } = this.state
    if (
      this.props.history.location.pathname !== '/downloads' &&
      (!downloadItems || downloadItems.length === 0)
    ) {
      return <div className={styles.wrapper + ' ' + styles.hidden} />
    }

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
          label={'Clear'}
          onClick={() => downloadService.deleteList()}
        />
        {this.props.history.location.pathname === '/downloads' ? (
          <Button
            className={styles.button}
            icon={faListUl}
            label={'Close List'}
            onClick={() =>
              this.props.history.action === 'PUSH'
                ? this.props.history.goBack()
                : this.props.history.push('/')
            }
          />
        ) : (
          <Button
            className={styles.button}
            icon={faListUl}
            label={'Open List'}
            onClick={() => this.props.history.push('/downloads')}
          />
        )}
        {downloadService.getState() === DownloadService.DOWNLOADING ? (
          <Button
            className={styles.button}
            icon={faBan}
            label={'Abort'}
            accent
            onClick={() => downloadService.abortDownload()}
            disabled={false}
          />
        ) : (
          <Button
            className={styles.button}
            icon={faDownload}
            label={'Download'}
            accent
            onClick={() => downloadService.startDownload()}
            disabled={
              downloadService.getDownloadItems().length === 0 ||
              (downloadService.getState() !== DownloadService.DONE &&
                downloadService.getState() !== DownloadService.PENDING)
            }
          />
        )}
      </div>
    )
  }

  textPending () {
    const { downloadItems, downloadService } = this.state
    const artists = []
    const albums = []
    const totalSize = downloadService.getTotalSize()

    downloadItems.forEach(item => {
      const track = item.getTrack()
      const albumId = track.getAlbum().getId()
      const artistId = track
        .getAlbum()
        .getArtist()
        .getId()
      if (artists.indexOf(artistId) === -1) artists.push(artistId)
      if (albums.indexOf(albumId) === -1) albums.push(albumId)
    })

    return (
      `${artists.length} Artists, ` +
      `${albums.length} Albums, ` +
      `${downloadItems.length} Tracks selected for download. ` +
      `(${StringFormatter.formatSize(totalSize)})`
    )
  }

  textDownloading () {
    const { currentItem } = this.state
    return `Downloading ${currentItem.getTrack().getTitle()} ...`
  }
}

export default DownloadBar
