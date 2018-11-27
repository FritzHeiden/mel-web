import React from 'react'
import Image from './image'

class ArtistThumbnail extends React.Component {
  render () {
    const { artist, className } = this.props
    if (!artist) {
      return <Image className={className} placeholderText={'artist'} />
    }
    return <Image placeholderText={artist.getName()} className={className} />
  }
}

export default ArtistThumbnail
