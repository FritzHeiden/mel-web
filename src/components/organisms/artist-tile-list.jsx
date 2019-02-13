import React from "react";
import TileList from "./tile-list";
import ArtistCard from "../molecules/artist-card";

import styles from "./artist-tile-list.sass";

class ArtistTileList extends React.Component {
  render() {
    const { artists, history, className } = this.props;

    return (
      <TileList className={className}>
        {artists
          .filter(artist => artist !== undefined)
          .map((artist, index) => (
            <ArtistCard
              key={index}
              artist={artist}
              onClick={() => history.push(`/artist/${artist.getId()}`)}
            />
          ))
          .concat(
            [null, null, null, null, null, null, null, null, null, null].map(
              (element, index) => (
                <ArtistCard key={"p" + index} className={styles.placeholder} />
              )
            )
          )}
      </TileList>
    );
  }
}

ArtistTileList.defaultProps = {
  artists: [],
  history: {
    push: () => {
      console.error("Missing prop in ArtistTileList: history");
    }
  },
  className: ""
};

export default ArtistTileList;
