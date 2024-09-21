function getZoomLevelFromUrl(url) {
  let zoomMatch = url.match(/@[^z]+,(\d+)z/);
  return zoomMatch ? parseInt(zoomMatch[1]) : null;
}

module.exports = { getZoomLevelFromUrl };
