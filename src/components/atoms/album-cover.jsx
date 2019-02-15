import React from "react";
import Image from "./image";

class AlbumCover extends React.Component {
  render() {
    const { album, melHttpService, className } = this.props;
    let placeholderText = "album";
    if (album) placeholderText = album.getTitle();
    let url = "";
    if (album && album.getId() && melHttpService) {
      url = melHttpService.getAlbumCoverUrl(album.getId());
    }
    return (
      <Image
        url={url}
        placeholderText={placeholderText}
        className={className}
      />
    );
  }
}

export default AlbumCover;
