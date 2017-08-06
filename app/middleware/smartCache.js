const onHeaders = require('on-headers');

function notErrorResponse(statusCode) {
  return statusCode >= 200 && statusCode < 400;
}

function setCacheHeader(res, settings) {
  res.setHeader('Cache-Control', `public, max-age=${settings.maxAge}`);
}

function smartCache(settings) {
  return (req, res, next) => {
    onHeaders(res, () => {
      if (notErrorResponse(res.statusCode)) {
        setCacheHeader(res, settings);
      }
    });
    return next();
  };
}

module.exports = smartCache;

