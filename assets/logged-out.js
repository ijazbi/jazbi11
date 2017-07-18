'use strict';
document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('focus', function() {
    if (window.localStorage.loggedIn === 'true') {
      window.location.href = '/modal';
    }
  });
});