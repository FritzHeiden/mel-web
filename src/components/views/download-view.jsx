import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUser,
  faDotCircle,
  faTrashAlt,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

import DownloadService from "../../services/download-service";
import StringFormatter from "../../utils/string-formatter";
import Spinner from "../atoms/spinner";
import DownloadItem from "../../services/download-item";
import Progress from "../atoms/progress";

import styles from "./download-view.sass";

class DownloadView extends React.Component {
  constructor() {
    super();
    this.state = {};
    const downloadService = DownloadService.getInstance();
    this.state.downloadItems = downloadService.getDownloadItems();
    this.state.currentItem = downloadService.getCurrentItem();
    downloadService.onDownloadListChange(downloadItems => {
      this.state.downloadItems = downloadItems;
      this.setState(this.state);
    });
    downloadService.onCurrentItemChange(item => {
      this.state.currentItem = item;
      this.state.currentItemProgress = 0;
      this.state.downloadItems = downloadService.getDownloadItems();
      this.setState(this.state);
    });
    downloadService.onCurrentItemProgressChange(progress => {
      const { currentItem } = this.state;
      this.state.currentItemProgress = progress / currentItem.getSize();
      this.setState(this.state);
    });
    downloadService.onStateChange(() => {
      this.state.currentItemProgress = 0;
      this.setState(this.state);
    });
    this.state.downloadService = downloadService;
  }

  close() {
    const { history } = this.props;
    if (history.action === "PUSH") {
      history.goBack();
    } else {
      history.push("/");
    }
  }

  removeTrack(track) {
    const { downloadService } = this.state;
    downloadService.removeTrack(track.getId());
  }

  render() {
    const { downloadItems } = this.state;

    return (
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>{"Downloads"}</h1>
          <div className={styles.spacer} />
          <div className={styles.closeButtonWrapper}>
            <FontAwesomeIcon
              icon={faTimes}
              className={styles.closeButton}
              onClick={() => this.close()}
            />
          </div>
        </div>
        {this.renderList(downloadItems)}
      </div>
    );
  }

  renderList(downloadItems) {
    const { downloadService } = this.state;
    return (
      <div className={styles.downloadList}>
        {downloadItems.map((item, index) => {
          const track = item.getTrack();
          const album = track.getAlbum();
          const artist = album.getArtist();
          return (
            <div className={styles.listItem} key={index}>
              <div className={styles.track}>{track.getTitle()}</div>
              <div className={styles.album}>
                <FontAwesomeIcon className={styles.icon} icon={faDotCircle} />
                <div
                  className={styles.label}
                  onClick={() =>
                    this.props.history.push(`/album/${album.getId()}`)
                  }
                >
                  {album.getTitle()}
                </div>
              </div>
              <div className={styles.artist}>
                <FontAwesomeIcon className={styles.icon} icon={faUser} />
                <div
                  className={styles.label}
                  onClick={() =>
                    this.props.history.push(`/artist/${artist.getId()}`)
                  }
                >
                  {artist.getName()}
                </div>
              </div>
              <div className={styles.size}>
                {item.getSize()
                  ? StringFormatter.formatSize(item.getSize())
                  : "Fetching ..."}
              </div>
              <div className={styles.status}>{this.renderStatus(item)}</div>
              <div className={styles.delete}>
                {downloadService.getState() === DownloadService.DONE ||
                downloadService.getState() === DownloadService.PENDING ? (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => this.removeTrack(track)}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderStatus(downloadItem) {
    const { currentItemProgress } = this.state;
    const { IDLE, PENDING, SUCCESS, DOWNLOADING } = DownloadItem;

    switch (downloadItem.getStatus()) {
      case IDLE:
        return null;
      case PENDING:
        return <Spinner />;
      case SUCCESS:
        return <FontAwesomeIcon icon={faCheckCircle} />;
      case DOWNLOADING:
        return (
          <Progress
            className={styles.progress}
            progress={currentItemProgress}
          />
        );
      default:
        return null;
    }
  }
}

export default DownloadView;
