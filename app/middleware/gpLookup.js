const sampleGPs = {
  A81001: {
    organisation_code: 'A81001',
    name: 'The Densham Surgery',
    location: {
      address: 'The Health Centre, Lawson Street, Stockton, Cleveland',
      postcode: 'TS18 1HU',
      latitude: 54.561691284179688,
      longitude: -1.3189228773117065
    },
    contact_telephone_number: '01642 672351'
  }
};

function getGP(orgCode) {
  return sampleGPs[orgCode] || { name: 'Unknown Practice' };
}

module.exports = getGP;
