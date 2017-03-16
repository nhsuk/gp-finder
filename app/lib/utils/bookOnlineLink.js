function surgeryLinkUtil(gp) {
  if ((gp.contact) && (gp.contact.website)) {
    return gp.contact.website;
  }
  return undefined;
}

function bookOnlineLinkUtil(gp) {
  switch (gp.supplier) {
    case 'EMIS':
      return 'https://patient.emisaccess.co.uk/Account/Login';
    case 'Informatica':
    case 'INPS':
      return 'https://www.myvisiononline.co.uk/vpp/';
    case 'Microtest':
      return 'https://www.thewaiting-room.net/';
    case 'TPP':
      return `https://systmonline.tpp-uk.com/Login?PracticeId=${gp.odsCode}`;
    case 'NK':
    case 'EMIS (I)':
    case 'INPS (I)':
    default:
      return surgeryLinkUtil(gp);
  }
}

module.exports = bookOnlineLinkUtil;
