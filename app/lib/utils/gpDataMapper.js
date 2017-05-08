function getBookOnlineLink(gpData) {
  return (gpData.onlineServices && gpData.onlineServices.appointments)
    ? gpData.onlineServices.appointments.url : undefined;
}

function getFilteredGps(gpData, searchStr) {
  if (gpData.doctors) {
    let filteredDocs = [];
    const searchArr = searchStr.split(' ');
    searchArr.forEach((searchSubStr) => {
      const regexp = new RegExp(searchSubStr, 'i');
      filteredDocs = filteredDocs.concat(gpData.doctors.filter(doctor => regexp.test(doctor)));
    });
    return [...new Set(filteredDocs)];
  }
  return undefined;
}

module.exports = {
  getBookOnlineLink,
  getFilteredGps,
};
