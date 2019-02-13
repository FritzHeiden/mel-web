const IDLE = "idle";
const PENDING = "pending";
const DOWNLOADING = "downloading";
const SUCCESS = "success";
const FAILURE = "failure";

class DownloadItem {
  constructor(track) {
    this._track = track;
    this._size = null;
    this._status = IDLE;
    this._buffer = null;
  }

  getTrack() {
    return this._track;
  }

  getSize() {
    return this._size;
  }

  setSize(size) {
    this._size = size;
    return this;
  }

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    this._status = status;
    return this;
  }

  setBuffer(buffer) {
    this._buffer = buffer;
    return this;
  }

  getBuffer() {
    return this._buffer;
  }
}

DownloadItem.IDLE = IDLE;
DownloadItem.PENDING = PENDING;
DownloadItem.DOWNLOADING = DOWNLOADING;
DownloadItem.SUCCESS = SUCCESS;
DownloadItem.FAILURE = FAILURE;

module.exports = DownloadItem;
