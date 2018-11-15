import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faUser, faDotCircle } from '@fortawesome/free-solid-svg-icons'

import DownloadService from '../../services/download-service'

import styles from './download-view.sass'

class DownloadView extends React.Component {
  constructor () {
    super()
    this.state = {}
    this.state.downloadService = DownloadService.getInstance()
    this.state.artists = this.state.downloadService.getArtists()
  }

  close () {
    const { history } = this.props
    if (history.action === 'PUSH') {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  render () {
    const { artists } = this.state

    return (
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>{'Downloads'}</h1>
          <div className={styles.spacer} />
          <div className={styles.closeButtonWrapper}>
            <FontAwesomeIcon
              icon={faTimes}
              className={styles.closeButton}
              onClick={() => this.close()}
            />
          </div>
        </div>
        {this.renderList(artists)}
      </div>
    )
  }

  renderList (artists) {
    return (
      <div className={styles.downloadList}>
        {artists.map((artist, artistIndex) =>
          artist.getAlbums().map((album, albumIndex) =>
            album.getTracks().map((track, trackIndex) => (
              <div
                className={styles.listItem}
                key={`${artistIndex}${albumIndex}${trackIndex}`}
              >
                <div className={styles.track}>{track.getTitle()}</div>
                <div className={styles.album}>
                  <FontAwesomeIcon className={styles.icon} icon={faDotCircle} />
                  <div
                    className={styles.label}
                    onClick={() =>
                      this.props.history.push(`/album/${album.getId()}`)
                    }
                  >
                    {album.getTitle()}
                  </div>
                </div>
                <div className={styles.artist}>
                  <FontAwesomeIcon className={styles.icon} icon={faUser} />
                  <div
                    className={styles.label}
                    onClick={() =>
                      this.props.history.push(`/artist/${artist.getId()}`)
                    }
                  >
                    {artist.getName()}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    )
  }
}

export default DownloadView
