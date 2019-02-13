import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Artist } from "mel-core";

import NavigationHistoryBar from "../navigation-history-bar";
import styles from "./artist-view.sass";
import Spinner from "../atoms/spinner";
import ArtistThumbnail from "../atoms/artist-thumbnail";
import AlbumTileList from "../organisms/album-tile-list";

class ArtistView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: new Artist(null, "Loading ...")
    };
    this.initialize().then();
  }

  componentWillReceiveProps() {
    this.initialize().then();
  }

  async initialize() {
    const { artistId } = this.props;
    this.state.artist = await this.loadArtist(artistId);
    this.setState(this.state);
  }

  async loadArtist(artistId) {
    const { melClientSocket } = this.props;

    let artist = await melClientSocket.getArtist(artistId);
    let albums = [];
    for (let album of artist.getAlbums()) {
      albums.push(await melClientSocket.getAlbum(album.getId()));
    }
    artist.setAlbums(albums);
    let featureAlbums = [];
    for (let album of artist.getFeatureAlbums()) {
      featureAlbums.push(await melClientSocket.getAlbum(album.getId()));
    }
    artist.setFeatureAlbums(featureAlbums);
    return artist;
  }

  render() {
    const { history, melHttpService } = this.props;
    const { artist } = this.state;
    if (!artist) {
      return (
        <div className={styles.loading}>
          <Spinner />
          <div>{"Loading ..."}</div>
        </div>
      );
    }

    return (
      <div className={styles.wrapper}>
        <NavigationHistoryBar
          locations={[
            { name: "Library", url: "/" },
            {
              name: artist.getName(),
              url: `/artist/${artist.getId()}`,
              icon: faUser
            }
          ]}
        />
        <div className={styles.artistWrapper}>
          <div className={styles.artistInfo}>
            <ArtistThumbnail artist={artist} className={styles.thumb} />
            <h1>{artist.getName()}</h1>
          </div>
          <div className={styles.musicWrapper}>
            <div className={styles.head}>
              <h2>{"Albums"}</h2>
            </div>
            <AlbumTileList
              albums={artist
                .getAlbums()
                .sort((a, b) => b.getYear() - a.getYear())}
              history={history}
              melHttpService={melHttpService}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistView;
