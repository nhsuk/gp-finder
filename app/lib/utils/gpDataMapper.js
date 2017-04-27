function getBookOnlineLink(gpData) {
  return (gpData.onlineServices && gpData.onlineServices.appointments)
    ? gpData.onlineServices.appointments.url : undefined;
}

function getFilteredGps(gpData, searchStr) {
  if (gpData.doctors) {
    const regexp = new RegExp(searchStr, 'i');
    return gpData.doctors.filter(doctor => regexp.test(doctor));
  }
  return undefined;
}

module.exports = {
  getBookOnlineLink,
  getFilteredGps,
};
