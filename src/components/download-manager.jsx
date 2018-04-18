import React from 'react'
import styles from './download-manager.sass'
import DownloadService from '../services/download-service'
import Button from './general/button'

const MINIMIZED = 1
const MAXIMIZED = 2

class DownloadManager extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    DownloadService.addOnDownloadListChangedListener(artists =>
      this._onDownloadListChanged(artists)
    )
    this._gatherProps(props)
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
  }

  _gatherProps (props) {
    this.state.state = props.state
  }

  _onDownloadListChanged (artists) {
    this.state.artists = artists
    this.setState(this.state)
  }

  render () {
    if (!this.state.artists || this.state.artists.length === 0) {
      return this._renderHidden()
    } else {
      if (this.state.state === MAXIMIZED) {
        return this._renderMinimized()
      } else {
        return this._renderMinimized()
      }
    }
  }

  _renderMinimized () {
    let artistCount = 0
    let albumCount = 0
    let trackCount = 0

    for (let artist of this.state.artists) {
      artistCount++
      for (let album of artist.albums) {
        albumCount++
        for (let track of album.tracks) {
          trackCount++
        }
      }
    }

    console.log(artistCount, albumCount, trackCount)

    return (
      <div className={styles.wrapper + ' ' + styles.minimized}>
        <div
          className={styles.text}
        >{`${artistCount} Artists, ${albumCount} Albums, ${trackCount} Tracks selected for download.`}</div>
        <Button
          className={styles.button}
          icon={'fas fa-times'}
          label={'Discard'}
          onClick={() => DownloadService.deleteList()}
        />
        <Button
          className={styles.button}
          icon={'fas fa-list-ul'}
          label={'Open List'}
        />
        <Button
          className={styles.button}
          icon={'fas fa-download'}
          label={'Download'}
          accent
        />
      </div>
    )
  }

  _renderHidden () {
    return <div className={styles.wrapper + ' ' + styles.hidden} />
  }
}

DownloadManager.MINIMIZED = MINIMIZED
DownloadManager.MAXIMIZED = MAXIMIZED

export default DownloadManager
