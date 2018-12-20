import React from 'react'

import styles from './card.sass'

class Card extends React.Component {
  render () {
    const { image, text, onClick, className } = this.props
    return (
      <div className={[styles.wrapper, className].join(' ')} onClick={onClick}>
        <div className={styles.image}>{image}</div>
        <div className={styles.text}>{text}</div>
      </div>
    )
  }
}

Card.defaultProps = {
  image: <div />,
  text: '',
  onClick: () => {},
  className: ''
}

export default Card
