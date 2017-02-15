const contexts = require('./contexts');

function text(res) {
  return res.locals.context === contexts.stomachAche.context
    ? contexts.stomachAche.text
    : 'Back';
}

function url(req, res) {
  let link;

  if (res.locals.context === contexts.stomachAche.context) {
    link = contexts.stomachAche.url;
  } else {
    // eslint-disable-next-line no-script-url
    link = req.get('referer') || 'javascript:history.back();';
  }

  return link;
}

function backLinkUtils(req, res) {
  return {
    text: text(res),
    url: url(req, res),
  };
}

module.exports = backLinkUtils;
