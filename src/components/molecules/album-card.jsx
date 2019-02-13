import React from "react";
import { Album, Artist } from "mel-core";

import Card from "./card";
import AlbumCover from "../atoms/album-cover";
import styles from "./album-card.sass";

const PLACEHOLDER_ALBUM_TITLE = "Album";
const PLACEHOLDER_ARTIST_NAME = "Artist";

class AlbumCard extends React.Component {
  render() {
    const { album, melHttpService, className, onClick } = this.props;
    return (
      <Card
        image={<AlbumCover album={album} melHttpService={melHttpService} />}
        text={
          <React.Fragment>
            <div>{album.getTitle()}</div>
            <div className={styles.year}>{album.getYear()}</div>
          </React.Fragment>
        }
        onClick={onClick}
        className={className}
      />
    );
  }
}

AlbumCard.defaultProps = {
  album: new Album(
    null,
    new Artist(null, PLACEHOLDER_ARTIST_NAME),
    PLACEHOLDER_ALBUM_TITLE
  ),
  melHttpService: null,
  onClick: () => {}
};

export default AlbumCard;
