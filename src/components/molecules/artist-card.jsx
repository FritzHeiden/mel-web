import React from "react";
import { Artist } from "mel-core";
import Card from "./card";
import ArtistThumbnail from "../atoms/artist-thumbnail";

const PLACEHOLDER_ARTIST_NAME = "Artist";

class ArtistCard extends React.Component {
  render() {
    const { artist, onClick, className } = this.props;
    return (
      <Card
        image={<ArtistThumbnail artist={artist} />}
        text={artist.getName()}
        onClick={onClick}
        className={className}
      />
    );
  }
}

ArtistCard.defaultProps = {
  artist: new Artist(null, PLACEHOLDER_ARTIST_NAME, [], []),
  onClick: () => {}
};

export default ArtistCard;
