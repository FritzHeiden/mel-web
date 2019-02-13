const StringFormatter = {};

StringFormatter.formatSize = size => {
  size = parseInt(size);
  const KB = 1000;
  const MB = 1000000;
  const GB = 1000000000;
  if (size < MB) {
    return String(Math.floor(size / KB * 100) / 100) + " KB";
  } else if (size < GB) {
    return String(Math.floor(size / MB * 100) / 100) + " MB";
  } else {
    return String(Math.floor(size / GB * 100) / 100) + " GB";
  }
};

module.exports = StringFormatter;
