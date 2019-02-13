import React from "react";

import styles from "./spinner.sass";

class Spinner extends React.Component {
  render() {
    return <div className={[styles.spinner, this.props.className].join(" ")} />;
  }
}

module.exports = Spinner;
