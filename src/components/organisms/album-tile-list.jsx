import React from "react";

import TileList from "./tile-list";
import styles from "./album-tile-list.sass";
import AlbumCard from "../molecules/album-card";

class AlbumTileList extends React.Component {
  render() {
    const { albums, history, melHttpService } = this.props;
    return (
      <TileList>
        {albums
          .map((album, index) => (
            <AlbumCard
              album={album}
              melHttpService={melHttpService}
              onClick={() => history.push(`/album/${album.getId()}`)}
              key={index}
            />
          ))
          .concat(
            [null, null, null, null, null, null, null, null, null, null].map(
              (element, index) => (
                <AlbumCard key={"p" + index} className={styles.placeholder} />
              )
            )
          )}
      </TileList>
    );
  }
}

AlbumTileList.defaultProps = {
  albums: [],
  history: {
    push: () => {
      console.error("Missing prop in AlbumTileList: history");
    }
  },
  melHttpService: null
};

export default AlbumTileList;
