import JSZip from "jszip";

import EventEmitter from "../utils/event-emitter";
import DownloadItem from "./download-item";

const DOWNLOAD_LIST_CHANGE = "download_list_change";
const TOTAL_SIZE_CHANGE = "total_size_change";
const CURRENT_TRACK_CHANGE = "current_track_change";
const STATE_CHANGE = "state_change";
const CURRENT_ITEM_PROGRESS_CHANGE = "current_item_progress_change";

const PENDING = "pending";
const DOWNLOADING = "downloading";
const ZIPPING = "zipping";
const DONE = "done";

class DownloadService {
  constructor(melHttpService) {
    this._downloadItems = [];
    this._melHttpService = melHttpService;
    this._eventEmitter = new EventEmitter();
    this._currentItem = null;
    this._state = PENDING;
    this.onDownloadListChange(() => this._setState(PENDING));
  }

  containsTrack(trackId) {
    return this._downloadItems.some(
      item => item.getTrack().getId() === trackId
    );
  }

  containsAlbum(album) {
    return !album.getTracks().some(track => !this.containsTrack(track.getId()));
  }

  addTrack(track) {
    if (this.containsTrack(track.getId())) return;
    const downloadItem = new DownloadItem(track);
    this._melHttpService.getTrackDataInfo(track.getId()).then(({ size }) => {
      downloadItem.setSize(size);
      this._fireDownloadListChange();
    });
    this._downloadItems.push(downloadItem);
  }

  removeTrack(trackId) {
    const index = this._downloadItems.findIndex(
      item => item.getTrack().getId() === trackId
    );
    if (index === -1) return;
    this._downloadItems.splice(index, 1);
    this._fireDownloadListChange();
  }

  addAlbum(album) {
    album.getTracks().forEach(track => this.addTrack(track));
  }

  getDownloadItems() {
    return this._downloadItems;
  }

  getTotalSize() {
    return this._downloadItems.reduce((accumulator, item) => {
      const size = item.getSize();
      if (!size) return accumulator;
      return accumulator + size;
    }, 0);
  }

  deleteList() {
    this.abortDownload();
    this._currentItem = null;
    this._fireCurrentItemChange();
    this._state = PENDING;
    this._fireStateChange();
    this._downloadItems = [];
    this._fireDownloadListChange();
  }

  async startDownload() {
    this._setState(DOWNLOADING);
    const zip = new JSZip();
    for (let item of this._downloadItems) {
      const track = item.getTrack();
      const album = track.getAlbum();
      const artist = album.getArtist();

      let artistFolder = zip.folder(artist.getName());

      let albumFolderName = album.getTitle();
      if (typeof album.getYear() === "number") {
        albumFolderName = `${album.getYear()} - ${album.getTitle()}`;
      }
      let albumFolder = artistFolder.folder(albumFolderName);

      this._setCurrentItem(item);
      let buffer = item.getBuffer();
      if (!buffer) {
        buffer = await this._melHttpService.downloadTrack(
          track.getId(),
          progress => this._fireCurrentItemProgressChange(progress)
        );
        item.setBuffer(buffer);
      }
      item.setStatus(DownloadItem.SUCCESS);
      this._setCurrentItem(null);
      if (this._state !== DOWNLOADING) return;

      let fileName = track.getTitle() + ".mp3";
      if (typeof track.getNumber() === "number") {
        fileName =
          `${track.getNumber()}`.padStart(2, "0") +
          ` - ${track.getTitle()}.mp3`;
      }
      albumFolder.file(fileName, buffer);
    }
    this._setState(ZIPPING);
    const blob = await zip.generateAsync({ type: "blob" });
    location.href = URL.createObjectURL(blob);
    this._setState(DONE);
  }

  abortDownload() {
    if (!this._currentItem) return;
    this._melHttpService.abortTrackDownload(
      this._currentItem.getTrack().getId()
    );
    this._setState(PENDING);
    this._downloadItems.forEach(
      item =>
        item.getBuffer()
          ? item.setStatus(DownloadItem.SUCCESS)
          : item.setStatus(DownloadItem.IDLE)
    );
    this._fireStateChange();
  }

  _setCurrentItem(downloadItem) {
    this._currentItem = downloadItem;
    if (downloadItem) downloadItem.setStatus(DownloadItem.DOWNLOADING);
    this._fireCurrentItemChange();
  }

  getCurrentItem() {
    return this._currentItem;
  }

  _setState(state) {
    if (state !== this._state) {
      if (state === DOWNLOADING) {
        this._downloadItems.forEach(item =>
          item.setStatus(DownloadItem.PENDING)
        );
      }
      this._state = state;
      this._eventEmitter.invokeAll(STATE_CHANGE, this._state);
    }
  }

  getState() {
    return this._state;
  }

  onDownloadListChange(listener) {
    this._eventEmitter.on(DOWNLOAD_LIST_CHANGE, listener);
  }

  _fireDownloadListChange() {
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._downloadItems);
  }

  onTotalSizeChange(listener) {
    this._eventEmitter.on(TOTAL_SIZE_CHANGE, listener);
  }

  onCurrentItemChange(listener) {
    this._eventEmitter.on(CURRENT_TRACK_CHANGE, listener);
  }

  _fireCurrentItemChange() {
    this._eventEmitter.invokeAll(CURRENT_TRACK_CHANGE, this._currentItem);
  }

  onStateChange(listener) {
    this._eventEmitter.on(STATE_CHANGE, listener);
  }

  _fireStateChange() {
    this._eventEmitter.invokeAll(STATE_CHANGE, this._state);
  }

  onCurrentItemProgressChange(listener) {
    this._eventEmitter.on(CURRENT_ITEM_PROGRESS_CHANGE, listener);
  }

  _fireCurrentItemProgressChange(progress) {
    this._eventEmitter.invokeAll(CURRENT_ITEM_PROGRESS_CHANGE, progress);
  }
}

let downloadService = {
  _instance: null,
  PENDING,
  DOWNLOADING,
  ZIPPING,
  DONE,
  initialize(melHttpService) {
    this._instance = new DownloadService(melHttpService);
  },
  getInstance() {
    return this._instance;
  }
};

export default downloadService;
