function url(req) {
  // eslint-disable-next-line no-script-url
  const link = req.get('referer') || 'javascript:history.back();';
  return link;
}

function backLinkUtils(req) {
  return {
    text: 'Back',
    url: url(req),
  };
}

module.exports = backLinkUtils;
