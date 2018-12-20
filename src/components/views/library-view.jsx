import React from 'react'
import styles from './library-view.sass'
import ArtistTileList from '../organisms/artist-tile-list'

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

  render () {
    const { artists } = this.state
    const { history } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>Library</h1>
        </div>
        <ArtistTileList
          className={styles.list}
          artists={artists
            .filter(artist => artist.getAlbums().length > 0)
            .sort((a, b) => a.getId().localeCompare(b.getId()))}
          history={history}
        />
      </div>
    )
  }
}
