/*
* This file only interfaces with the data sent by plugin.js
* There isn't an awful lot of Hootsuite-specific code in here,
* this is mostly just to show an example of the things you can
* do with the Hootsuite SDK.
*/
'use strict';

function getSingleElementByClassName(className) {
  return document.getElementsByClassName(className)[0];
}

function replaceInnerInClass(className, text) {
  var theClass = getSingleElementByClassName(className);
  theClass.innerHTML = '';
  theClass.appendChild(document.createTextNode(text));
}

function appendTextToClass(className, text) {
  getSingleElementByClassName(className).appendChild(document.createTextNode(text));
}

function replaceTextInClass(className, text) {
  replaceInnerInClass(className, '');
  appendTextToClass(className, text);
}

function prettifyTimeAgo(datetime) {
  var timeDiff = Date.now().valueOf() - datetime.valueOf();

  // milliseconds
  if (timeDiff < 1000) {
    return ' just now';
  }

  // seconds
  timeDiff = Math.round(timeDiff / 1000);
  if (timeDiff < 30) {
    return timeDiff + ' secs ago';
  }

  // minutes
  timeDiff = Math.round(timeDiff / 60);
  if (timeDiff < 50) {
    return timeDiff + ' mins ago';
  }

  // hours
  timeDiff = Math.round(timeDiff / 60);
  if (timeDiff < 24) {
    return timeDiff + ' hours ago';
  }

  // days
  timeDiff = Math.round(timeDiff / 24);
  if (timeDiff < 7) {
    return timeDiff + ' days ago';
  }

  // weeks
  timeDiff = Math.round(timeDiff / 7);
  if (timeDiff < 4) {
    return timeDiff + ' weeks ago';
  }

  // months
  timeDiff = Math.round(timeDiff / 4);
  return timeDiff + ' months ago';
}

function populateMessage(data) {
  // dumps pretty json into hidden area
  var prettyJSONData = JSON.stringify(data, null, 4);
  appendTextToClass('hs_jsonDump', prettyJSONData);

  // finds network-specific information
  var avatarURL = 'https://hootsuite.com/dist/images/logos/hootsuite/owly.png';
  var displayName = '';
  var profileURL = '';
  switch (data.post.network) {
    case 'FACEBOOK':
    avatarURL = data.profile.picture;
    displayName = data.profile.name;
    profileURL = data.profile.link;
    break;
    case 'TWITTER':
    avatarURL = data.profile.profile_image_url_https;
    displayName = data.profile.name;
    profileURL = data.profile.url;
    break;
    case 'INSTAGRAM':
    avatarURL = data.profile.profile_picture;
    displayName = data.profile.full_name;
    profileURL = 'https://instagram.com/' + data.post.user.username;
    break;
    case 'YOUTUBE':
    avatarURL = data.profile.avatar_url;
    displayName = data.profile.name;
    profileURL = 'https://www.youtube.com/channel/' + data.profile.userid;
    break;
  }

  // displays user's display name and attaches url to username
  appendTextToClass('hs_userName', displayName);
  getSingleElementByClassName('hs_userName').setAttribute('href', profileURL);
  getSingleElementByClassName('hs_avatar').setAttribute('title', data.post.user.username);

  // displays user screen name as hover tooltip
  var screenName = data.post.user.username;
  if (screenName === null) {
    getSingleElementByClassName('hs_userName').removeAttribute('title');
  }
  getSingleElementByClassName('hs_userName').setAttribute('title', '@' + screenName);

  // displays timestamp, links to post, shows where something was posted from
  var timestamp = new Date(data.post.datetime);
  var timeAgo = prettifyTimeAgo(timestamp);
  appendTextToClass('hs_postTime', timeAgo);
  var timeElement = getSingleElementByClassName('hs_postTime');
  timeElement.setAttribute('href', data.post.href);
  if (data.post.source !== '') {
    timeElement.setAttribute('title', timestamp.toLocaleString() + " via " + data.post.source);
  } else {
    timeElement.setAttribute('title', timestamp.toLocaleString());
  }


  // display likes, comments, shares
  // also possible to link to network-specific likes, comments, and share lists
  appendTextToClass('hs_likesCount', data.post.counts.likes);
  appendTextToClass('hs_commentsCount', data.post.counts.replies);
  appendTextToClass('hs_sharesCount', data.post.counts.shares);

  // displays post body
  appendTextToClass('hs_postBody', data.post.content.body);

  // displays avatar
  getSingleElementByClassName('hs_avatarImage').setAttribute('src', avatarURL);

  getSingleElementByClassName('hs_avatar').addEventListener('click', function () {
    // This is a Hootsuite SDK function which displays another modal.
    // This modal can be populated with any data.
    hsp.customUserInfo({
      fullName: data.post.user.username,
      avatar: avatarURL,
      profileURL: data.profile.link,
      userLocation: data.profile.location,
      bio: data.profile.bio,
      extra: [
        {
          label: "Gender",
          value: data.profile.gender
        }
      ]
    });
  });
}

function startEventListeners() {
  getSingleElementByClassName('hs_showJsonButton').addEventListener('click', function () {
    if (getSingleElementByClassName('hs_jsonDump').style.display === 'none') {
      replaceInnerInClass('hs_showJsonButton', 'Hide JSON Payload');
      getSingleElementByClassName('hs_jsonDump').style.display = 'block';
      getSingleElementByClassName('hs_copyJsonButton').style.display = 'inline';
    } else {
      replaceInnerInClass('hs_showJsonButton', 'Show JSON Payload');
      getSingleElementByClassName('hs_jsonDump').style.display = 'none';
      getSingleElementByClassName('hs_copyJsonButton').style.display = 'none';
    }
  });

  getSingleElementByClassName('hs_copyJsonButton').addEventListener('click', function () {
    var range = document.createRange();
    range.selectNode(getSingleElementByClassName('hs_jsonDump'));
    window.getSelection().empty();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().empty();
    replaceTextInClass('hs_copyJsonButton', 'Copied!');
  });

  // sets up dropdown menu
  var topBarControl = getSingleElementByClassName('hs_topBarControlsBtn');
  topBarControl.addEventListener('click', function (event) {
    event.preventDefault();
    if (getSingleElementByClassName('hs_dropdownMenuList').style.display === 'none') {
      topBarControl.classList.add('active');
      getSingleElementByClassName('hs_dropdownMenuList').style.display = 'block';
    } else {
      topBarControl.classList.remove('active');
      getSingleElementByClassName('hs_dropdownMenuList').style.display = 'none';
    }
  });

  getSingleElementByClassName('hs_logout').addEventListener('click', function () {
    window.localStorage.loggedIn = 'false';
  });
}

// for our purposes this is the same thing as jQuery's  $(document).ready(...)
document.addEventListener('DOMContentLoaded', function () {
  var data = JSON.parse(window.localStorage.jsonData);
  console.log(data);
  populateMessage(data);
  startEventListeners();
  if (window.localStorage.loggedIn === 'true') {
    replaceTextInClass('hs_fakeLoggedIn', 'Logged in as ' + window.localStorage.fakeUsername);
  }
});
