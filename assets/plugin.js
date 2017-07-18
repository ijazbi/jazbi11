'use strict';
function sendToAppHandler(data) {
  // send data to modal
  window.localStorage.jsonData = JSON.stringify(data);
  // open a custom modal, where the data will be read and displayed on the dashboard
  hsp.showCustomPopup(window.location.origin + '/modal', 'Post Info');
}

document.addEventListener('DOMContentLoaded', function () {
  // the hsp.init function initializes the Hootsuite App SDK
  // it should only be used once per component because it
  // resets event handlers and any other configuration
  hsp.init({
    useTheme: true
  });

  // binds the "Send to <Your-app-here>" button in all Hootsuite streams
  // to a function of your choice. Can be anonymous as well
  hsp.bind('sendtoapp', sendToAppHandler);
});
