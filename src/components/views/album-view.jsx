import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDotCircle,
  faDownload,
  faCheck,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { Album, Artist } from "mel-core";

import NavigationHistoryBar from "../navigation-history-bar";
import styles from "./album-view.sass";
import DownloadService from "../../services/download-service";
import AlbumCover from "../atoms/album-cover";
import Spinner from "../atoms/spinner";

export default class AlbumView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      album: new Album(null, new Artist(null, "Loading ..."), "Loading ...")
    };
    this.initialize().then();
  }

  componentWillReceiveProps() {
    this.initialize().then();
  }

  async initialize() {
    const { albumId } = this.props;

    const downloadService = DownloadService.getInstance();
    downloadService.onDownloadListChange(() => this.setState(this.state));
    this.state.downloadService = downloadService;

    this.state.album = await this.loadAlbum(albumId);
    this.setState(this.state);
  }

  async loadAlbum(albumId) {
    const { melClientSocket } = this.props;

    let album = await melClientSocket.getAlbum(albumId);

    let tracks = [];
    for (let track of album.getTracks()) {
      track = await melClientSocket.getTrack(track.getId());
      track.setAlbum(album);
      tracks.push(track);
    }
    album.setTracks(tracks);

    album.setArtist(await melClientSocket.getArtist(album.getArtist().getId()));

    return album;
  }

  addToDownloads() {
    const { downloadService, album } = this.state;
    downloadService.addAlbum(album);
    this.setState(this.state);
  }

  render() {
    const { melHttpService } = this.props;
    const { album } = this.state;
    if (!album) {
      return (
        <div className={styles.loading}>
          <Spinner />
          <div>{"Loading ..."}</div>
        </div>
      );
    }

    return (
      <div className={styles.wrapper}>
        <NavigationHistoryBar
          locations={[
            { name: "Library", url: "/" },
            {
              name: album.getArtist().getName(),
              url: `/artist/${album.getArtist().getId()}`,
              icon: faUser
            },
            {
              name: album.getTitle(),
              url: `/album/${album.getId()}`,
              icon: faDotCircle
            }
          ]}
        />
        <div className={styles.albumWrapper}>
          <div className={styles.albumInfo}>
            <AlbumCover
              album={album}
              className={styles.cover}
              melHttpService={melHttpService}
            />
            <div className={styles.albumTitle}>
              <h1>{album.getTitle()}</h1>
            </div>
            {this.renderDownloadButton()}
          </div>
          <div className={styles.musicWrapper}>
            <div className={styles.head}>
              <h2>{"Tracks"}</h2>
            </div>
            {this.renderTracks()}
          </div>
        </div>
      </div>
    );
  }

  renderDownloadButton() {
    const { downloadService, album } = this.state;

    let icon = faDownload;
    let text = "Add to Downloads";
    if (downloadService.containsAlbum(album)) {
      icon = faCheck;
      text = "In Downloads List";
    }
    return (
      <div className={styles.download} onClick={() => this.addToDownloads()}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className={styles.text}>{text}</div>
      </div>
    );
  }

  renderTracks() {
    const { album } = this.state;
    const tracks = album.getTracks();

    const discNumbers = [];
    tracks.forEach(track => {
      const number = track.getDiscNumber();
      if (number && discNumbers.indexOf(number) === -1)
        discNumbers.push(number);
    });

    const elements = [];
    discNumbers
      .sort((a, b) => a - b)
      .forEach(discNumber => {
        if (discNumbers.length > 1) {
          elements.push(
            <div className={styles.head} key={"disc" + discNumber}>
              <h3>{"Disc " + discNumber}</h3>
            </div>
          );
        }
        elements.push(
          <div key={discNumber} className={styles.discWrapper}>
            {tracks
              .filter(track => track.getDiscNumber() === discNumber)
              .sort((trackA, trackB) => trackA.getNumber() - trackB.getNumber())
              .map(track => (
                <div key={track.getId()} className={styles.trackWrapper}>
                  <div className={styles.number}>{track.getNumber()}</div>
                  <div className={styles.title}>{track.getTitle()}</div>
                </div>
              ))}
          </div>
        );
      });
    return elements;
  }
}
