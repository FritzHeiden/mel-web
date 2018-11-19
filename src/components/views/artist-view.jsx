import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import NavigationHistoryBar from '../navigation-history-bar'
import styles from './artist-view.sass'
import AlbumCover from '../album-cover'
import Spinner from '../atoms/spinner'

export default class ArtistView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.initialize().then()
  }

  componentWillReceiveProps () {
    this.initialize().then()
  }

  async initialize () {
    const { artistId } = this.props
    this.state.artist = await this.loadArtist(artistId)
    this.setState(this.state)
  }

  async loadArtist (artistId) {
    const { melClientSocket } = this.props

    let artist = await melClientSocket.getArtist(artistId)
    let albums = []
    for (let album of artist.getAlbums()) {
      albums.push(await melClientSocket.getAlbum(album.getId()))
    }
    artist.setAlbums(albums)
    let featureAlbums = []
    for (let album of artist.getFeatureAlbums()) {
      featureAlbums.push(await melClientSocket.getAlbum(album.getId()))
    }
    artist.setFeatureAlbums(featureAlbums)
    return artist
  }

  render () {
    const { artist } = this.state
    if (!artist) {
      return (
        <div className={styles.loading}>
          <Spinner />
          <div>{'Loading ...'}</div>
        </div>
      )
    }

    return (
      <div className={styles.wrapper}>
        <NavigationHistoryBar
          locations={[
            { name: 'Library', url: '/' },
            {
              name: artist.getName(),
              url: `/artist/${artist.getId()}`,
              icon: faUser
            }
          ]}
        />
        <div className={styles.artistWrapper}>
          <div className={styles.artistInfo}>
            <div className={styles.thumbWrapper}>
              <div className={styles.placeholder}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.thumb} />
            </div>
            <h1>{artist.getName()}</h1>
          </div>
          <div className={styles.musicWrapper}>
            <div className={styles.head}>
              <h2>{'Albums'}</h2>
            </div>
            <div className={styles.albumsWrapper}>
              {this.renderAlbumList(artist.getAlbums())}
            </div>
            {/* <h2>Appears on</h2> */}
            {/* <div className={styles.albumsWrapper}> */}
            {/* {this.renderAlbumList(artist.getFeatureAlbums())} */}
            {/* </div> */}
          </div>
        </div>
      </div>
    )
  }

  renderAlbumList (albums) {
    const { melHttpService } = this.props
    return albums
      .sort((a, b) => b.year - a.year)
      .map(album => (
        <Link
          key={album.getId()}
          className={styles.albumWrapper}
          to={{ pathname: '/album/' + album.getId() }}
        >
          <AlbumCover
            className={styles.cover}
            albumId={album.getId()}
            melHttpService={melHttpService}
          />
          <div className={styles.title}>{album.getTitle()}</div>
          <div className={styles.year}>{album.getYear()}</div>
        </Link>
      ))
      .concat(
        [null, null, null, null, null, null, null, null, null, null].map(
          (element, index) => {
            return <div key={index} className={styles.placeholder} />
          }
        )
      )
  }
}
