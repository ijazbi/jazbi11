'use strict';
function getSingleElementByClassName(className) {
  return document.getElementsByClassName(className)[0];
}

document.addEventListener('DOMContentLoaded', function() {
  getSingleElementByClassName('hs_loginButton').addEventListener('click', function() {
    window.localStorage.fakeUsername = document.getElementById('fakeUsername').value;
    window.localStorage.loggedIn = 'true';
    window.close();
  });
});