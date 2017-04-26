function getBookOnlineLink(gpData) {
  if (gpData.onlineServices &&
      gpData.onlineServices.appointments &&
      gpData.onlineServices.appointments.url) {
    return gpData.onlineServices.appointments.url;
  }
  return undefined;
}

module.exports = getBookOnlineLink;
