function getBookOnlineLink(gpData) {
  return (gpData.onlineServices && gpData.onlineServices.appointments)
    ? gpData.onlineServices.appointments.url : undefined;
}

function getFilteredGps(gpData, searchStr) {
  if (gpData.doctors) {
    let filteredSearchStr = searchStr;
    let filteredDocs = [];
    if (searchStr.match(/^DOCTOR|Doctor|doctor|DR|Dr.|Dr|dr.|dr/)) {
      filteredSearchStr = searchStr.replace(/^\S+ /g, '');
    }
    const searchArr = filteredSearchStr.split(' ');
    searchArr.forEach((searchSubStr) => {
      const regexp = new RegExp(searchSubStr, 'i');
      filteredDocs = filteredDocs.concat(gpData.doctors.filter(doctor => regexp.test(doctor)));
    });
    return [...new Set(filteredDocs)];
  }
  return undefined;
}

function mappedTitleForGps(doctors) {
  const mappedTitleGps = [];
  const regexpDrAll = new RegExp(/^(Other|DOCTOR|Doctor|DR|Dr.|Dt|dr|GP|Dr (Mrs)|Miss|Mr|Mr.|Mra|Mrs|Ms|Senior Partner|Dr)/, 'i');
  const regexpProfAll = new RegExp(/^(Pro|Prof|Prof.|Professor|Proffessor)/, 'i');
  doctors.forEach((doctor) => {
    let formattedDoctor = '';
    switch (doctor) {
      case (doctor.match(/^LOCUM|Salaried GP|The|Locum/) || {}).input:
        formattedDoctor = doctor;
        break;
      case (doctor.match(/^General Practitioner|Medi-Access Surgery/) || {}).input:
        formattedDoctor = doctor.replace(/General Practitioner |Medi-Access Surgery /, '');
        break;
      case (doctor.match(/^drs|DRS|Drs/) || {}).input:
        formattedDoctor = doctor.replace(/drs|DRS|Drs/, 'Drs');
        break;
      case (doctor.match(regexpProfAll) || {}).input:
        formattedDoctor = `${doctor.replace(/^\S+/g, 'Professor')} (GP)`;
        break;
      case (doctor.match(regexpDrAll) || {}).input:
        formattedDoctor = doctor.replace(/^\S+/g, 'Dr');
        break;
      case (doctor.match(/^[^a-zA-Z] */) || {}).input:
        formattedDoctor = doctor.replace(/^[^a-zA-Z] */, 'Dr ');
        break;
      default:
        formattedDoctor = `Dr ${doctor}`;
    }
    mappedTitleGps.push(formattedDoctor);
  });
  return mappedTitleGps;
}

module.exports = {
  getBookOnlineLink,
  getFilteredGps,
  mappedTitleForGps,
};
