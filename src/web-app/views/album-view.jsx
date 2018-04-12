import React from 'react'
import { Link } from 'react-router-dom'
import { Album } from 'mel-core'
import NavigationHistoryBar from '../components/navigation-history-bar'
import styles from './album-view.sass'
import DownloadService from '../services/download-service'

export default class AlbumView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
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

    for (let track of album.tracks) {
      tracks.push(await this.state.melClientSocket.getTrack(track.id))
    }

    album.tracks = tracks
    album.artist = await this.state.melClientSocket.getArtist(album.artist.id)

    console.log(album)

    this.state.album = album
    this.setState(this.state)
  }

  _addToDownloads () {
    DownloadService.addAlbum(this.state.album)
    console.log(DownloadService.artists)
    this.setState(this.state)
  }

  renderTrackList () {
    return this.state.album.tracks
      .sort((a, b) => a.number - b.number)
      .map(track => {
        let listArtists = (artists) => {
          if (artists) {
            return track.artists.map((artist, index) =>
              <Link to={{pathname: /artist/ + artist.id}}>
                            <span>
                                {artist.name}{index + 1 === album.artists.length ? '' : ', '}
                            </span>
              </Link>)
          } else {
            return ''
          }
        }
        return <div key={track.id}>
          <span>{track.number} </span>
          <span>{track.title}</span>
          {/*{listArtists(track.artists)}*/}
        </div>
      })
  }

  renderOtherAlbums () {
    return this.state.album.artist.albums.map(album =>
      <div key={album.id}>
        <span>{album.year} </span>
        <span>{album.title}</span>
      </div>)
  }

  render () {
    if (this.state.album) {
      return <div className={styles.wrapper}>
        <NavigationHistoryBar locations={[
          {name: 'Library', url: '/'},
          {name: this.state.album.artist.name, url: `/artist/${this.state.album.artist.id}`, icon: 'fas fa-user'},
          {name: this.state.album.title, url: `/album/${this.state.album.id}`, icon: 'fas fa-dot-circle'}
        ]}/>
        <div className={styles.albumWrapper}>
          <div className={styles.albumInfo}>
            <div className={styles.coverWrapper}>
              <div className={styles.placeholder}><i className={'fas fa-dot-circle'}/></div>
              <div className={styles.cover}/>
            </div>
            <h1 className={styles.albumTitle}>{this.state.album.title}</h1>
            {this._renderDownloadButton()}
          </div>
          <div className={styles.musicWrapper}>
            <h2>Tracks</h2>
            {this._renderTracks()}
          </div>
        </div>
      </div>
    } else {
      return <div>Loading ...</div>
    }
  }

  _renderDownloadButton () {
    let icon
    let text
    if (DownloadService.containsAlbum(this.state.album)) {
      icon = 'fas fa-check'
      text = 'In Downloads List'
    } else {
      icon = 'fas fa-download'
      text = 'Add to Downloads'
    }
    return <div className={styles.download} onClick={() => this._addToDownloads()}>
      <div className={styles.icon}><i className={icon}/></div>
      <div>{text}</div>
    </div>
  }

  _renderTracks () {
    let cdMap = new Map()
    this.state.album.tracks.forEach(track => {
      let caption = `Disc ${track.discNumber}`
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
      elements.push(<div key={caption} className={styles.discWrapper}>
        {captionLabel}
        {tracks.sort((a, b) => a.number - b.number).map(track =>
          <div key={track.id} className={styles.trackWrapper}>
            <div className={styles.number}>{track.number}</div>
            <div className={styles.title}>{track.title}</div>
          </div>)}
      </div>)
    }

    return elements
  }
}

/*


    if (this.state.artist) {
      return <div className={styles.wrapper}>
        <NavigationHistoryBar locations={[
          {name: 'Library', url: '/'},
          {name: this.state.artist.name, url: `/artist/${this.state.artist.id}`, icon: 'fas fa-user'}
        ]}/>
        <div className={styles.artistWrapper}>
          <div className={styles.artistInfo}>
            <div className={styles.thumbWrapper}>
              <div className={styles.placeholder}><i className={'fas fa-user'}/></div>
              <div className={styles.thumb} />
            </div>
            <h1>{this.state.artist.name}</h1>
          </div>
          <div className={styles.musicWrapper}>
            <h2>Albums</h2>
            <div className={styles.albumsWrapper}>
              {this._renderAlbumList(this.state.artist.albums)}
            </div>
            <h2>Appears on</h2>
            <div className={styles.albumsWrapper}>
              {this._renderAlbumList(this.state.artist.featureAlbums)}
            </div>
          </div>
        </div>
      </div>
    } else {
      return <div>Loading ...</div>
    }
 */