import React from 'react'
import { Link } from 'react-router-dom'
import style from './library-view.sass'

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
    if (this.state.artists) {
      return this.state.artists
        .filter(artist => artist !== undefined)
        .filter(artist => artist.getAlbums().length > 0)
        .sort((a, b) => a.getName().localeCompare(b.getName()))
        .map((artist, index) => (
          <Link to={{ pathname: '/artist/' + artist.getId() }} key={index}>
            <div className={style.listItem}>{artist.getName()}</div>
          </Link>
        ))
    } else {
      return <div>Loading ...</div>
    }
  }

  render () {
    return (
      <div className={style.wrapper}>
        <h1>Library</h1>
        <div className={style.listWrapper}>
          <div className={style.list}>{this.renderArtistList()}</div>
        </div>
      </div>
    )
  }
}
