import React from 'react'

import styles from './image.sass'

class Image extends React.Component {
  render () {
    const { url, placeholderText, className } = this.props
    // let imageUrl = null
    // if (album) {
    //   imageUrl = melHttpService.getAlbumCoverUrl(album.getId())
    //   placeholderText = album.getTitle()
    // } else if (artist) {
    //   placeholderText = artist.getName()
    // }
    return (
      <div className={className}>
        <div className={styles.placeholder}>
          {placeholderText
            .split('')
            .map((character, index) => <div key={index}>{character}</div>)}
        </div>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${url})` }}
        />
      </div>
    )
  }
}

export default Image
