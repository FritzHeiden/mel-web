import React from 'react'
import { Link } from 'react-router-dom'
import styles from './library-view.sass'
import ArtistThumbnail from '../atoms/artist-thumbnail'

export default class LibraryView extends React.Component {
  constructor (props) {
    super(props)
    this.state = { artists: [] }
    this._melClientSocket = props.melClientSocket
    this._melClientSocket.getArtists().then(artists => {
      this.state.artists = artists
      this.setState(this.state)
    })
  }

  renderArtistList () {
    const { artists } = this.state
    const { history } = this.props
    if (artists) {
      return artists
        .filter(artist => artist !== undefined)
        .filter(artist => artist.getAlbums().length > 0)
        .sort((a, b) => a.getId().localeCompare(b.getId()))
        .map((artist, index) => (
          <div
            key={index}
            className={styles.listItem}
            onClick={() => history.push(`/artist/${artist.getId()}`)}
          >
            <ArtistThumbnail artist={artist} className={styles.thumb} />
            <div className={styles.text}>{artist.getName()}</div>
          </div>
        ))
        .concat(
          [null, null, null, null, null, null, null, null, null, null].map(
            (element, index) => {
              return <div key={index} className={styles.placeholder} />
            }
          )
        )
    } else {
      return <div>Loading ...</div>
    }
  }

  render () {
    return (
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>Library</h1>
        </div>
        <div className={styles.list}>{this.renderArtistList()}</div>
      </div>
    )
  }
}
