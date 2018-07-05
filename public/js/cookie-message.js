(function(global) {
  'use strict'
  var $ = global.jQuery;
  var document = global.document;

  function setCookie(name, value, options) {
    options = options || {};
    var cookieString = name + '=' + value + '; path=/';

    if (options.days) {
      var date = new Date();
      date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
      cookieString = cookieString + '; expires=' + date.toGMTString();
    }

    if (document.location.protocol === 'https:') {
      cookieString = cookieString + '; Secure';
    }

    document.cookie = cookieString;
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');

    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i];

      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }

      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  $(function() {
    var banner = document.getElementById('global-cookies-banner');

    if (banner && getCookie('nhsuk_seen_cookie_message') === null) {
      banner.style.display = 'block';
      setCookie('nhsuk_seen_cookie_message', 'yes', { days: 28 });
    }
  });
})(window);
