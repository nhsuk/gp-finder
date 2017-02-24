function backLinkUtils(req) {
  return {
    text: 'Back',
    // eslint-disable-next-line no-script-url
    url: req.get('referer') || 'javascript:history.back();',
  };
}

module.exports = backLinkUtils;
