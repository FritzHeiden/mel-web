import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { MelClientSocket, MelHttpService } from 'mel-core'

import './html/index.html'
import './res/fonts/Oswald/Oswald-Regular.ttf'
import './res/fonts/Open_Sans/OpenSans-Regular.ttf'
import './res/fonts/Roboto/Roboto-Regular.ttf'

import styles from './web-app.sass'
import LibraryView from './views/library-view'
import ArtistView from './views/artist-view'
import AlbumView from './views/album-view'
import SocketIoWebSocket from './network/socket-io-web-socket'
import DownloadManager from './components/download-manager'
import DownloadService from './services/download-service'

const PORT = 3541

class WebApp extends React.Component {
  constructor () {
    super()
    console.log('Initializing WebApp')
    this.state = {}
    this.state.melClientSocket = new MelClientSocket(
      new SocketIoWebSocket('localhost', PORT)
    )
    this.state.melHttpService = new MelHttpService('localhost', PORT)
    DownloadService.initialize(this.state.melHttpService)
  }

  render () {
    const { melClientSocket, melHttpService } = this.state
    const { MINIMIZED } = DownloadManager
    const { wrapper, content } = styles

    return (
      <div className={wrapper}>
        <div id='content' className={content}>
          <Route
            exact
            path='/'
            render={props => (
              <LibraryView {...props} melClientSocket={melClientSocket} />
            )}
          />
          <Route
            path='/artist/:artistId'
            render={props => (
              <ArtistView
                {...props}
                melClientSocket={melClientSocket}
                melHttpService={melHttpService}
              />
            )}
          />
          <Route
            path='/album/:albumId'
            render={props => (
              <AlbumView {...props} melClientSocket={melClientSocket} />
            )}
          />
          <DownloadManager state={MINIMIZED} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter>
    <WebApp />
  </BrowserRouter>,
  document.getElementById('root')
)
