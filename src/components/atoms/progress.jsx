import React from 'react'

import styles from './progress.sass'

class Progress extends React.Component {
  render () {
    const { progress, className } = this.props
    const angle = Math.PI * 2 * progress
    const x = Math.sin(angle)
    const y = -Math.cos(angle)
    if (angle > Math.PI) {
      return (
        <svg
          className={[styles.progress, className].join(' ')}
          viewBox={'-1.1 -1.1 2.2 2.2'}
        >
          <path d={`M0,0   L0,  -1 A1,1 0 0 1 0,1`} />
          <path d={`M0.1,0 L0.1, 1 A1,1 0 0 1, ${x} ${y}`} />
        </svg>
      )
    } else {
      return (
        <svg
          className={[styles.progress, className].join(' ')}
          viewBox={'-1.1 -1.1 2.2 2.2'}
        >
          <path d={`M0,0 L0,-1 A1,1 0 0 1 ${x},${y}`} />
        </svg>
      )
    }
  }
}

module.exports = Progress
