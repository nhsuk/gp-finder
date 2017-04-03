function getBookOnlineLink(gpData) {
  if (gpData.bookingSystem && gpData.bookingSystem.bookOnlineLink) {
    return gpData.bookingSystem.bookOnlineLink;
  }
  return undefined;
}

module.exports = getBookOnlineLink;
