import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import LibraryView from './views/library-view'
import ArtistView from './views/artist-view'
import AlbumView from './views/album-view'
import style from './web-app.sass'
import { MelClientSocket } from 'mel-core'
import SocketIoWebSocket from './network/socket-io-web-socket'
import NavigationHistoryBar from './components/navigation-history-bar'
import DownloadManager from './components/download-manager'

class WebApp extends React.Component {
  constructor () {
    super()
    console.log('Initializing WebApp')
    this._melClientSocket = new MelClientSocket(new SocketIoWebSocket('localhost', 3541))
  }

  render () {
    return <div className={style.wrapper}>
      <div id="content" className={style.content}>
        <Route exact path="/" render={props => <LibraryView {...props} melClientSocket={this._melClientSocket}/>}/>
        <Route path="/artist/:artistId" render={props => <ArtistView {...props} melClientSocket={this._melClientSocket}/>}/>
        <Route path="/album/:albumId" render={props => <AlbumView {...props} melClientSocket={this._melClientSocket}/>}/>
        <DownloadManager state={DownloadManager.MINIMIZED}/>
      </div>
    </div>
  }
}

// const style = {
//     backgroundColor: "#202020",
//     color: "#656367",
//     display: "flex",
//     flexDirection: "column",
//     fontFamily: 'Open Sans',
//
//     content: {
//         padding: "20px",
//     },
//
//     width: "100%",
//     flex: 1,
//     padding: 0,
//     margin: 0,
// };

ReactDOM.render(<BrowserRouter><WebApp/></BrowserRouter>, document.getElementById('root'))