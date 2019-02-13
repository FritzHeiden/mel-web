import React from "react";

import styles from "./tile-list.sass";

class TileList extends React.Component {
  render() {
    const { children, className } = this.props;
    return (
      <div className={[styles.wrapper, className].join(" ")}>{children}</div>
    );
  }
}

TileList.defaultProps = {
  className: ""
};

export default TileList;
