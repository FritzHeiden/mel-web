import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import styles from './download-view.sass'

class DownloadView extends React.Component {
  close () {
    const { history } = this.props
    if (history.action === 'PUSH') {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  render () {
    return (
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>{'Downloads'}</h1>
          <div className={styles.spacer} />
          <div className={styles.closeButtonWrapper}>
            <FontAwesomeIcon
              icon={faTimes}
              className={styles.closeButton}
              onClick={() => this.close()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default DownloadView
