function getBookOnlineLink(gpData) {
  return (gpData.onlineServices && gpData.onlineServices.appointments)
    ? gpData.onlineServices.appointments.url : undefined;
}

module.exports = getBookOnlineLink;
