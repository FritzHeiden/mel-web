import React from 'react'
import Image from './image'

class AlbumCover extends React.Component {
  render () {
    const { album, melHttpService, className } = this.props
    if (!album) return <Image placeholderText={'album'} className={className} />
    return (
      <Image
        url={melHttpService.getAlbumCoverUrl(album.getId())}
        placeholderText={album.getTitle()}
        className={className}
      />
    )
  }
}

export default AlbumCover
