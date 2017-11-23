function getLeaveReviewLink() {
  // return `https://www.nhs.uk/Services/GP/LeaveReview/DefaultView.aspx?id=${gpData.choicesId}`;
  return 'https://gp-feedback-prototype-lab3.herokuapp.com/2_leave_a_written_review';
}

function isNotEmptyString(string) {
  return string;
}

function isNotTitle(term) {
  const regex = /^(doctor|dr\.|dr)$/i;
  return !regex.test(term);
}

function getFilteredGps(gpData, searchStr) {
  if (gpData.doctors) {
    let filteredDocs = [];

    const searchTerms = searchStr
      .split(' ')
      .filter(isNotEmptyString)
      .filter(isNotTitle)
      .map(term => term.toLowerCase());

    searchTerms.forEach((term) => {
      filteredDocs = filteredDocs
        .concat(gpData.doctors
          .filter(d => isNotEmptyString(d.name))
          .filter(doctor => doctor.name.toLowerCase().includes(term))
          .map(doctor => doctor.name));
    });

    return [...new Set(filteredDocs)];
  }

  return [];
}

function mappedTitleForGps(doctors) {
  const mappedTitleGps = [];
  const regexpDrAll = /^(Other|DOCTOR|Doctor|DR|Dr.|Dt|dr|GP|Dr (Mrs)|Miss|Mr|Mr.|Mra|Mrs|Ms|Senior Partner|Dr)/i;
  const regexpProfAll = /^(Pro|Prof|Prof.|Professor|Proffessor)/i;

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
  getLeaveReviewLink,
  getFilteredGps,
  mappedTitleForGps,
};
