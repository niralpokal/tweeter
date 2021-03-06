var signUpForm = document.getElementById('sign-up');
var loginForm =document.getElementById('login')
var loginButton = document.getElementById('loginButton');
var signUpButton = document.getElementById('signUpButton')
var signUpBtn = document.getElementById('signUpBtn');
var loginBtn = document.getElementById('loginBtn')
var landingPage = document.getElementById('header')
var dashboard = document.getElementById('dashboard')
var userInfo = document.getElementById('userInfo')
var trends = document.getElementById('trends')
var timeline = document.getElementById('timeline');
var tweetBox = document.getElementById('tweetBox');
var userMessages = document.getElementById('userMessages');
var submitTweetBtn = document.getElementById('submitTweet');
var suggestions = document.getElementById('suggestions');
var selectedProfile = document.getElementById('selectedProfile');
var userProfile = document.getElementById('userProfile')
var userSuggestions = document.getElementById('userSuggestions')
var selectedTimeline = document.getElementById('selectedTimeline')
var selectedNav = document.getElementById('selectedNav');
var messagesDiv = document.getElementById('messagesDiv');
var messagesContainer = document.getElementById('messagesContainer');
var messages = document.getElementById('messages');
var messagesInfo = document.getElementById('messagesInfo')
var messageBox = document.getElementById('messageBox');
var submitMessage = document.getElementById('submitMessage');
var messageList = document.getElementById('messageList');
var notificationContainer = document.getElementById('notificationContainer');
var notifications = document.getElementById('notifications')
var close = document.getElementById('close');
var logoutIcon = document.getElementById('logoutIcon')
var notificationNumber = document.getElementById('numberofNotications');
var messageNumber = document.getElementById('numberOfMessages');
var modaltext = document.getElementById('modaltext')
var searchBar = document.getElementById('searchBar')
var searchResultsPeople = document.getElementById('searchResultsPeople');
var searchResultsTweets = document.getElementById('searchResultsTweets');
var searchContainer = document.getElementById('searchContainer');
var myUser = {};
var myTweets = {};
var followersInfo = {};

var promise = new Promise(function(resolve, reject){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/home', true)
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      resolve(response);
    } else if (xhr.status === 245){
      reject('no cookies');
    }
  }
});

promise.then(function(value){
  myUser = value;
  showDashBoard();
}, function(reason){});

$('#logoutIcon').popover({
  html: 'true',
  content : '<button type="button"  class="btn blue-background white" id="close">Log Out</button>'
});

loginButton.addEventListener('click',function(){
  $('#login').modal('show')
})

signUpButton.addEventListener('click', function(){
  $('#sign-up').modal('show')
});

loginBtn.addEventListener('click', function(event){
  $('#login').modal('toggle');
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var id = document.getElementById('loginName').value;
  var pass = document.getElementById('loginPass').value;
  var myData = {
    id:id,
    pass:pass
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if (xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      showDashBoard();
    }
  }
})

signUpBtn.addEventListener('click', function(event){
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var name = document.getElementById('signUpName').value;
  var handle = document.getElementById('signUpId').value;
  var pass1 = document.getElementById('signUpPass1').value;
  var pass2 = document.getElementById('signUpPass2').value;
  if(pass1 == pass2){
    var myData = {
      name:name,
      id:handle,
      pass:pass1,
    }
    $('#sign-up').modal('toggle');
    var payload = JSON.stringify(myData);
    xhr.send(payload);
  }else{
    console.log('error');
    pass1.className = 'form-control has-error'
    pass2.className = 'form-control has-error'
  }
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      showDashBoard();
    }
  }
})

function showDashBoard(){
  landingPage.className = "hidden";
  dashboard.className = "row-fluid"
  getTweets();
  appendUserInfo();
  getSuggestions(suggestions);
};

function getTweets(){
  myTweets.length = 0;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'getTweets', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var result = JSON.parse(xhr.responseText)
      myTweets = result;
      getUserTimeline();
    }
  }
}

function appendUserInfo(){
  var user = myUser;
  logoutIcon.setAttribute('src', user.picture);
  notificationNumber.textContent = myUser.numberOfNotifications;
  messageNumber.textContent = myUser.numberOfMessages;
  var thumbnail = document.createElement('div')
  thumbnail.className ="thumbnail"
  var caption = document.createElement('div')
  caption.className="caption text-center"
  var picture = document.createElement('img');
  picture.setAttribute('src', user.picture);
  picture.setAttribute('alt', "Profile Pic")
  picture.setAttribute('class', "img-responsive")
  picture.setAttribute('data-id', 'thumbnailProfile')
  var userName = document.createElement('h1');
  userName.className ="text-center margin userBtns"
  userName.setAttribute('data-id', myUser.handle)
  var userHandle = document.createElement('p');
  userHandle.className = "text-center userBtns"
  var buttonDiv = document.createElement('div');
  buttonDiv.className = "row"
  var column1 = document.createElement('div')
  column1.className = "col-xs-4";
  var column2 = document.createElement('div')
  column2.className = "col-xs-4";
  var column3 = document.createElement('div')
  column3.className = "col-xs-4";
  var tweetsBtn = document.createElement('a');
  tweetsBtn.setAttribute('role', 'button')
  tweetsBtn.setAttribute('data-id', 'userTweets')
  var followersBtn = document.createElement('a');
  followersBtn.setAttribute('role', 'button')
  followersBtn.setAttribute('data-id', 'userFollowers')
  var followingBtn = document.createElement('a');
  followingBtn.setAttribute('role', 'button')
  followingBtn.setAttribute('data-id', 'userFollowing')
  var userNameText = document.createTextNode(captilizeFirstLetter(user.name));
  var userHandleText = document.createTextNode('@'+user.handle)
  var numOfTweets = document.createTextNode(user.numberOfTweets);
  var numOfFollowers = document.createTextNode(user.numberOfFollowers);
  var numOfFollowing = document.createTextNode(user.numberOfFollowing);
  var tweets = document.createElement('p');
  tweets.className="text-muted small text-center userBtns"
  var followers = document.createElement('p');
  followers.className ="text-muted small text-center userBtns"
  var following = document.createElement('p');
  following.className="text-muted small text-center userBtns"
  var tweetsText = document.createTextNode('Tweets')
  var followingText = document.createTextNode('Following')
  var followersText = document.createTextNode('Followers')
  tweets.appendChild(tweetsText);
  followers.appendChild(followersText);
  following.appendChild(followingText);
  tweetsBtn.appendChild(tweets);
  tweetsBtn.appendChild(numOfTweets);
  followersBtn.appendChild(followers);
  followersBtn.appendChild(numOfFollowers);
  followingBtn.appendChild(following);
  followingBtn.appendChild(numOfFollowing);
  userName.appendChild(userNameText);
  userHandle.appendChild(userHandleText);
  caption.appendChild(userName);
  caption.appendChild(userHandle);
  column1.appendChild(tweetsBtn);
  column2.appendChild(followersBtn);
  column3.appendChild(followingBtn);
  buttonDiv.appendChild(column1);
  buttonDiv.appendChild(column2);
  buttonDiv.appendChild(column3);
  caption.appendChild(buttonDiv);
  thumbnail.appendChild(picture);
  thumbnail.appendChild(caption);
  userInfo.appendChild(thumbnail);
}

function getUserTimeline(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/userTimeline', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      var toSort = [];
      for(var i = 0; i< response.length; i++){
        var a = response[i].tweets;
        for(var z = 0; z< a.length; z++){
          toSort.push(a[z])
        }
      }
      var followingTweets = _.sortBy(toSort, 'date').reverse();
      appendUserTimeline(followingTweets, timeline);;
    }
  }
};

function appendUserTimeline(body, dom){
  for(var i = 0; i <body.length; i++){
    var panel = document.createElement('div');
    panel.className = "panel panel-default no-bottom-margin"
    var panelBody = document.createElement('div');
    panelBody.className = "panel-body";
    var media = document.createElement('div');
    media.className = "media";
    var mediaLeft = document.createElement('div');
    mediaLeft.className = "media-left";
    var mediaBody = document.createElement('div');
    mediaBody.className = "media-body"
    var picture = document.createElement('img')
    picture.setAttribute('src', body[i].picture);
    picture.setAttribute('alt', "Profile Pic");
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', "48");
    picture.setAttribute('height', "48");
    picture.setAttribute('data-id', 'profile')
    var h5 = document.createElement('h5');
    h5.setAttribute('data-id', body[i].handle)
    h5.className="media-heading margin-bottom"
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    p2.setAttribute('data-id', body[i].number)
    p2.setAttribute('data-tweet', body[i].text)
    var handle = document.createTextNode('@' + body[i].handle)
    var tweet = document.createTextNode(body[i].text);
    var favIcon = document.createElement('i');
    favIcon.className ="fa fa-heart-o";
    favIcon.setAttribute('data-id', 'addfavorite');
    if(myUser.favs.length != undefined){
      for(var y = 0; y < myUser.favs.length; y++){
        if (myUser.favs[y].number == body[i].number && myUser.favs[y].handle == body[i].handle){
          favIcon.className="fa fa-heart red";
          favIcon.setAttribute('data-id', 'unfavorite')
        }
      }
    }
    var retweetIcon = document.createElement('i');
    retweetIcon.className = "fa fa-retweet";
    retweetIcon.setAttribute('data-id', 'addRetweet');
    if(body[i].re == 1 && body[i].retweeter == myUser.handle ){
      retweetIcon.className = "fa fa-retweet blue";
      retweetIcon.setAttribute('data-id', 'removeRetweet');
      handle = document.createTextNode('You retweeted '+'@' + body[i].handle);
    } else if(body[i].re == 1){
      handle = document.createTextNode('@'+ body[i].retweeter + ' retweeted '+'@' + body[i].handle);
      retweetIcon.className = "fa fa-retweet";
      retweetIcon.setAttribute('data-id', 'cant');
    }
    var fav = document.createElement('li');
    fav.setAttribute('role', 'button');
    var numberOfFavsp = document.createElement('a');
    var numberOfFavs = document.createTextNode(' ' +body[i].numberOfFavs);
    numberOfFavsp.setAttribute('data-id', 'getfavorites' )
    var numberOfRetweetsp = document.createElement('a');
    var numberOfRetweets = document.createTextNode(' ' +body[i].numberOfRetweets + "           ");
    numberOfRetweetsp.setAttribute('data-id', 'getRetweets' )
    var br = document.createElement('br');
    var br2 = document.createElement('br');
    var ul = document.createElement('ul')
    ul.className = 'list-inline'
    var retweet = document.createElement('li');
    retweet.setAttribute('role', 'button');
    numberOfRetweetsp.appendChild(numberOfRetweets);
    retweet.appendChild(retweetIcon);
    retweet.appendChild(numberOfRetweetsp);
    numberOfFavsp.appendChild(numberOfFavs)
    fav.appendChild(favIcon);
    fav.appendChild(numberOfFavsp);
    p2.appendChild(tweet);
    p2.appendChild(br)
    h5.appendChild(handle);
    mediaBody.appendChild(h5);
    mediaBody.appendChild(p2);
    ul.appendChild(retweet);
    ul.appendChild(fav);
    mediaBody.appendChild(ul);
    mediaLeft.appendChild(picture);
    media.appendChild(mediaLeft);
    media.appendChild(mediaBody);
    panelBody.appendChild(media);
    panel.appendChild(panelBody);
    dom.appendChild(panel);
    if(body[i].retweets.length != undefined){
      for (var q = 0; q < body[i].retweets.length; q++){
        if (body[i].retweets[q].handle == myUser.handle){
          dom.removeChild(dom.lastChild);
        }
      }
    }
  }
}

function getSuggestions(dom){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/suggestions', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      appendSuggestions(response, dom);
    }
  }
}

function appendSuggestions(body, dom){
  removeSuggestions();
  removeSelectedSuggestions();
  var users = body;
  var panel1 = document.createElement('div');
  panel1.className = "panel panel-default"
  var panelHeading = document.createElement('div');
  panelHeading.className = "panel-heading blue-background white text-center"
  var panelText = document.createTextNode('Who To Follow');
  panelHeading.appendChild(panelText);
  panel1.appendChild(panelHeading);
  for(var i = 0; i<users.length; i++){
    var panelBody = document.createElement('div');
    panelBody.className = "panel-body bottom-border lower-padding";
    var media = document.createElement('div');
    media.className = "media";
    var mediaLeft = document.createElement('div');
    mediaLeft.className = "media-left media-middle";
    var mediaBody = document.createElement('div');
    mediaBody.className = "media-body"
    var hr = document.createElement('hr');
    var picture = document.createElement('img');
    picture.setAttribute('src', users[i].picture);
    picture.setAttribute('alt', "Profile Pic");
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', "48");
    picture.setAttribute('height', "48");
    picture.setAttribute('data-id', 'profile')
    var button = document.createElement('button');
    button.className = "btn blue-background white"
    button.setAttribute('data-id', 'follow');
    var buttonText = document.createTextNode('Follow')
    var h5 = document.createElement('h5');
    h5.setAttribute('data-id', users[i].handle)
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    var handle = document.createTextNode('@' + users[i].handle)
    var hr = document.createElement('hr')
    button.appendChild(buttonText);
    p2.appendChild(button);
    h5.appendChild(handle);
    mediaLeft.appendChild(picture);
    mediaBody.appendChild(h5);
    mediaBody.appendChild(p2);
    media.appendChild(mediaLeft);
    media.appendChild(mediaBody);
    panelBody.appendChild(media);
    panel1.appendChild(panelBody);
  }
  dom.appendChild(panel1);
}

function addFollower(target){
  var parent = target.parentNode;
  var theParent = parent.parentNode.getElementsByTagName('h5')[0];
  var toFollow = theParent.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addFollower', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    user:myUser.handle,
    follow:toFollow
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      getUpdatedUser();
    }
  }
}

function addFollower1(target){
  var parent = target.parentNode
  var toFollow = parent.parentNode.parentNode.getElementsByTagName('h1')[0].dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addFollower', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    user:myUser.handle,
    follow:toFollow
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      getUpdatedUser();
    }
  }

}

function removeFollower(target){
  var parent = target.parentNode;
  var theParent = parent.getElementsByTagName('h1')[0];
  var toFollow = theParent.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/removeFollower', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    user:myUser.handle,
    follow:toFollow
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      getUpdatedUser();
    }
  }
}

function addFavorite(target){
  target.className = "fa fa-heart red"
  target.setAttribute('data-id', 'unfavorite')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number +1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'addfav', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function unFavorite(target){
  target.className = "fa fa-heart-o"
  target.setAttribute('data-id', 'addfavorite')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number -1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'removefav', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function addRetweet(target){
  target.className = "fa fa-retweet blue"
  target.setAttribute('data-id', 'removeRetweet')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number +1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture,
    retweetNumber: Number(number)
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'addRetweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function removeRetweet(target){
  target.className = "fa fa-retweet"
  target.setAttribute('data-id', 'addRetweet')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number -1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture,
    retweetNumber: Number(number)
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'removeRetweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function getUpdatedUser(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getUpdate', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      updateTimeline();
    }
  }
}

function makeTweet() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/makeTweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var tweet = tweetBox.value;
  var mentions = [];
  var mentions2 = []
  var tags = [];
  var split  = tweet.split(/\s\w*/);
  for(var i = 0; i<split.length; i++){
    if(split[i].indexOf('@') !== -1){
      mentions.push(split[i]);
    } else if(split[i].indexOf('#') !== -1){
      tags.push(split[i]);
    }
  }
  for(var z =0; z < mentions.length; z++){
    mentions2.push(mentions[z].split(/\@/));
    mentions2[z].splice(0,1);
  }
  mentions.length = 0;
  for(var y = 0; y < mentions2.length; y++){
    mentions.push(mentions2[y][0]);
  }
  var myData = {
    name: myUser.name,
    text: tweet,
    handle: myUser.handle,
    tags: tags,
    mentions: mentions,
    picture: myUser.picture
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ==200){
      document.getElementById('form3').reset();
      getUpdatedUser();
    }
  }
}

function makeTweet1() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/makeTweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var tweet = modaltext.value;
  var mentions = [];
  var mentions2 = []
  var tags = [];
  var split  = tweet.split(/\s\w*/);
  for(var i = 0; i<split.length; i++){
    if(split[i].indexOf('@') !== -1){
      mentions.push(split[i]);
    } else if(split[i].indexOf('#') !== -1){
      tags.push(split[i]);
    }
  }
  for(var z =0; z < mentions.length; z++){
    mentions2.push(mentions[z].split(/\@/));
    mentions2[z].splice(0,1);
  }
  mentions.length = 0;
  for(var y = 0; y < mentions2.length; y++){
    mentions.push(mentions2[y][0]);
  }
  var myData = {
    name: myUser.name,
    text: tweet,
    handle: myUser.handle,
    tags: tags,
    mentions: mentions,
    picture: myUser.picture
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ==200){
      document.getElementById('form5').reset();
      $('#tweetAt').modal('toggle');
      getUpdatedUser();
    }
  }
}

function getSelectedProfile(data, callback){
  var myData = {
    handle: data
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/getProfile', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var result = JSON.parse(xhr.responseText);
      appendSelectedProfile(result, callback);
    }
  }
};

function appendSelectedProfile(result, callback){
  userProfile.className = 'hidden container-fluid well'
  selectedProfile.className ="container-fluid well"
  hideNotifcationsContainer();
  removeSelectedInfo();
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
  hideMessagesContainer();
  hideSearchContainer();
  var thumbnail = document.createElement('div')
  thumbnail.className ="thumbnail"
  var caption = document.createElement('div')
  caption.className="caption text-center"
  var picture = document.createElement('img');
  picture.setAttribute('src', result.picture);
  picture.setAttribute('alt', "Profile Pic")
  picture.setAttribute('width', 150);
  picture.setAttribute('height', 150);
  picture.setAttribute('data-id', 'thumbnailProfile')
  picture.className = 'img-rounded margin'
  var br = document.createElement('br');
  var userName = document.createElement('h1');
  userName.className ="text-center margin";
  userName.setAttribute('data-id', result.handle)
  var userHandle = document.createElement('p');
  userHandle.className = "text-center";
  var userText = document.createElement('p');
  userText.className = "small text-center";
  var userNameText = document.createTextNode(captilizeFirstLetter(result.name));
  var userHandleText = document.createTextNode('@'+result.handle);
  var userTextNode = document.createTextNode(captilizeFirstLetter(result.text));
  var buttonDiv = document.createElement('div');
  buttonDiv.className = "row"
  var column1 = document.createElement('div')
  column1.className = "col-xs-6";
  var column2 = document.createElement('div')
  column2.className = "col-xs-6";
  var tweetBtn = document.createElement('a');
  tweetBtn.setAttribute('role', 'button')
  tweetBtn.setAttribute('data-id', 'tweet1')
  var messageBtn = document.createElement('a');
  messageBtn.setAttribute('role', 'button')
  messageBtn.setAttribute('data-id', 'message1')
  var tweetBtnText = document.createTextNode('Tweet');
  var messageBtnText = document.createTextNode('Message');
  var followBtn = document.createElement('a')
  followBtn.setAttribute('role', 'button')
  followBtn.setAttribute('data-id', 'follow1');
  var followBtnText = document.createTextNode('Follow');
  followBtn.appendChild(followBtnText);
  tweetBtn.appendChild(tweetBtnText);
  messageBtn.appendChild(messageBtnText);
  column1.appendChild(tweetBtn);
  column2.appendChild(followBtn);
  for(var i= 0; i < myUser.following.length; i++){
    if (result.handle == myUser.following[i].handle){
      column2.replaceChild(messageBtn, followBtn);
      break;
    }
  }
  buttonDiv.appendChild(column1);
  buttonDiv.appendChild(column2);
  userName.appendChild(userNameText);
  userHandle.appendChild(userHandleText);
  userText.appendChild(userTextNode);
  caption.appendChild(userName);
  caption.appendChild(userHandle);
  caption.appendChild(userText);
  caption.appendChild(br);
  caption.appendChild(buttonDiv);
  if(result.handle == myUser.handle){
    caption.removeChild(caption.lastChild);
    caption.removeChild(caption.lastChild);
  }
  thumbnail.appendChild(picture);
  thumbnail.appendChild(caption);
  var selectedInfo = document.getElementById('selectedInfo');
  selectedInfo.appendChild(thumbnail);
  var tweetsLi = document.createElement('li')
  tweetsLi.setAttribute('role', 'presentation')
  var followersLi = document.createElement('li')
  followersLi.setAttribute('role', 'presentation')
  var followingLi = document.createElement('li')
  followingLi.setAttribute('role', 'presentation')
  var tweetsBtn = document.createElement('a');
  tweetsBtn.setAttribute('role', 'button')
  tweetsBtn.setAttribute('data-id', 'selectTweets')
  var followersBtn = document.createElement('a');
  followersBtn.setAttribute('role', 'button')
  followersBtn.setAttribute('data-id', 'selectFollowers')
  var followingBtn = document.createElement('a');
  followingBtn.setAttribute('role', 'button')
  followingBtn.setAttribute('data-id', 'selectFollowing')
  var favsLi = document.createElement('li');
  favsLi.setAttribute('role', 'presentation');
  var favsBtn = document.createElement('a');
  favsBtn.setAttribute('role', 'button');
  favsBtn.setAttribute('data-id', 'selectFavs');
  followersLi.className=""
  followingLi.className=""
  tweetsLi.className=""
  var tweets = document.createElement('p');
  tweets.className="text-muted small text-center"
  var followers = document.createElement('p');
  followers.className ="text-muted small text-center"
  var following = document.createElement('p');
  following.className="text-muted small text-center"
  var tweetsText = document.createTextNode('Tweets')
  var favs = document.createElement('p');
  favs.className = "text-muted text-center small";
  var favsText = document.createTextNode('Favs');
  var numOfFavs = document.createTextNode(result.numberOfFavs);
  var followingText = document.createTextNode('Following')
  var followersText = document.createTextNode('Followers')
  var numOfTweets = document.createTextNode(result.numberOfTweets);
  var numOfFollowers = document.createTextNode(result.numberOfFollowers);
  var numOfFollowing = document.createTextNode(result.numberOfFollowing);
  favs.appendChild(favsText);
  tweets.appendChild(tweetsText);
  followers.appendChild(followersText);
  following.appendChild(followingText);
  tweetsBtn.appendChild(tweets);
  tweetsBtn.appendChild(numOfTweets);
  followersBtn.appendChild(followers);
  followersBtn.appendChild(numOfFollowers);
  followingBtn.appendChild(following);
  followingBtn.appendChild(numOfFollowing);
  favsBtn.appendChild(favs);
  favsBtn.appendChild(numOfFavs);
  tweetsLi.appendChild(tweetsBtn);
  followersLi.appendChild(followersBtn);
  followingLi.appendChild(followingBtn);
  favsLi.appendChild(favsBtn);
  selectedNav.appendChild(tweetsLi);
  selectedNav.appendChild(followersLi);
  selectedNav.appendChild(followingLi);
  selectedNav.appendChild(favsLi);
  getSuggestions(userSuggestions);
  callback(result);
}

function getSelectedTimeline(result){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/getSelectedTimeline', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var myData = {
    handle: result.handle
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      var toSort = [];
      for(var i = 0; i< response.length; i++){
        var a = response[i].tweets;
        for(var z = 0; z< a.length; z++){
          toSort.push(a[z])
        }
      }
      var followingTweets = _.sortBy(toSort, 'date').reverse();
      appendUserTimeline(followingTweets, selectedTimeline);
    }
  }
}

function getFollowers(result){
  var array = result.followers;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendFollowers(answer);
    }
  }
}

function getFollowing(result){
  var array = result.following;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendFollowing(answer);
    }
  }
}

function getMessages(){
  followersInfo.length = 0
  var array = myUser.following;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      followersInfo = answer;
      appendMessages(answer);
    }
  }
}

function appendMessages(result){
  showMessagesContainer();
  messagesDiv.className="row-fluid"
  removeMessages();
  removeMessageList();
  removeMessageInfo();
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('width', 75);
    picture.setAttribute('height', 75);
    picture.setAttribute('data-id', 'thumbnailProfile');
    picture.className = "img-rounded margin"
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center low-margin";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center small";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var messageBtn = document.createElement('btn');
    messageBtn.setAttribute('data-id', 'message')
    messageBtn.className="btn blue-background white"
    var messageText = document.createTextNode('Message');
    messageText.className="text-muted small text-center";
    messageBtn.appendChild(messageText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(messageBtn);
    if(myUser.handle == result[i].handle){
      caption.removeChild(caption.lastChild);
    }
    caption.appendChild(br);
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    messagesDiv.appendChild(col)
  }
}

function getMessageList(target){
  var parent = target.parentNode;
  var theParent = parent.getElementsByTagName('h1')[0];
  var messageHandle = theParent.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/messageList', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    userHandle:myUser.handle,
    messageHandle:messageHandle
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      var result = JSON.parse(xhr.responseText);
      appendMessageList(messageHandle,result);
    }
  }
}

function getMessageList1(target){
  var messageHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/messageList', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    userHandle:myUser.handle,
    messageHandle:messageHandle
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      var result = JSON.parse(xhr.responseText);
      showMessagesContainer();
      appendMessageList(messageHandle,result);
    }
  }
}

function appendMessageList(messageHandle,result){
  removeMessageList();
  removeMessageInfo();
  showMessages();
  for (var w = 0; w<followersInfo.length; w ++){
    if(followersInfo[w].handle== messageHandle){
      var info = followersInfo[w]
      var thumbnail = document.createElement('div')
      thumbnail.className ="thumbnail"
      var caption = document.createElement('div')
      caption.className="caption text-center"
      var picture = document.createElement('img');
      picture.setAttribute('src', info.picture);
      picture.setAttribute('alt', "Profile Pic")
      picture.setAttribute('class', "img-rounded margin")
      picture.setAttribute('width', 150);
      picture.setAttribute('height', 150);
      picture.setAttribute('data-id', 'thumbnailProfile')
      var userName = document.createElement('h1');
      userName.className ="text-center margin";
      userName.setAttribute('data-id', info.handle)
      var userHandle = document.createElement('p');
      userHandle.className = "text-center";
      var userText = document.createElement('p');
      userText.className = "small text-center";
      var userNameText = document.createTextNode(captilizeFirstLetter(info.name));
      var userHandleText = document.createTextNode('@'+info.handle);
      var userTextNode = document.createTextNode(captilizeFirstLetter(info.text));
      userName.appendChild(userNameText);
      userHandle.appendChild(userHandleText);
      userText.appendChild(userTextNode);
      caption.appendChild(userName);
      caption.appendChild(userHandle);
      caption.appendChild(userText);
      thumbnail.appendChild(picture);
      thumbnail.appendChild(caption);
      messagesInfo.appendChild(thumbnail);
    }
  }
  var reverse = result[0].messageList.reverse();
  for(var i = 0; i<reverse.length; i ++){
    var panel = document.createElement('div');
    panel.className = "panel panel-default"
    var panelBody = document.createElement('div');
    panelBody.className = "panel-body";
    var panelHeading = document.createElement('div');
    panelHeading.className = "panel-heading grey-background"
    var h5 = document.createElement('h5');
    h5.className="low-top"
    var smallp = document.createElement('p');
    smallp.className = "small low-margin";
    var p = document.createElement('p');
    p.className="lower-padding"
    var date1 = reverse[i].date
    var x = date1.toLocaleString();
    var handle = document.createTextNode("From: @" + reverse[i].handle);
    var text = document.createTextNode(reverse[i].text);
    if (reverse[i].handle == myUser.handle) {
      panelHeading.className = "panel-heading blue-background";
      h5.className = "white low-top ";
      smallp.className = "small white low-margin";
    }
    var date = document.createTextNode(x);
    h5.appendChild(handle);
    smallp.appendChild(date);
    p.appendChild(text);
    panelHeading.appendChild(h5);
    panelHeading.appendChild(smallp);
    panelBody.appendChild(p);
    panel.appendChild(panelHeading);
    panel.appendChild(panelBody);
    messageList.appendChild(panel);
  }
};

function sendMessage(target){
  var text = messageBox.value;
  var userHandle = myUser.handle;
  var parent = target.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.nextElementSibling.firstChild.nextSibling.lastChild.getElementsByTagName('h1')[0]
  var messageHandle = parent.dataset.id;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'updateMessage', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var date = new Date();
  var x = date.toLocaleString();
  var myData ={
    userHandle:userHandle,
    text:text,
    messageHandle:messageHandle,
    date: x
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      updateMessages(messageHandle);
    }
  }
}

function updateMessages(messageHandle){
  var messageHandle = messageHandle
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/messageList', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    userHandle:myUser.handle,
    messageHandle:messageHandle
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      var result = JSON.parse(xhr.responseText)
      appendMessageList(messageHandle,result);
    }
  }
}

function getFavs(result){
  var array = result.favs;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/favs', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var response = JSON.parse(xhr.responseText);
      var toSort = [];
      for(var i = 0; i< response.length; i++){
        var a = response[i].tweets;
        for(var z = 0; z< a.length; z++){
          toSort.push(a[z])
        }
      }
      var answer = _.sortBy(toSort, 'date').reverse();
      appendFavs(answer);
    }
  }
}

function appendFollowers(result){
  removeSelectedTimline();
  removeSelectedSuggestions();
  hideSelectedSuggestions();
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('width', 60);
    picture.setAttribute('height', 60);
    picture.setAttribute('data-id', 'thumbnailProfile')
    picture.className = 'img-rounded margin'
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center low-margin";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var followingBtn = document.createElement('button');
    followingBtn.setAttribute('data-id', 'unfollow')
    followingBtn.className="btn"
    var followingText = document.createTextNode('Unfollow');
    followingText.className="text-muted white small text-center";
    var followBtn = document.createElement('button');
    followBtn.setAttribute('data-id', 'follow')
    followBtn.className = "btn btn-primary"
    var followText = document.createTextNode('Follow');
    followText.className="text-muted white small text-center";
    followBtn.appendChild(followText)
    followingBtn.appendChild(followingText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(br);
    caption.appendChild(followBtn);
    var loop = myUser.following
    for(var z =0; z< loop.length; z++){
      if(loop[z].handle == result[i].handle){
        caption.removeChild(caption.lastChild);
        caption.appendChild(followingBtn);
        break;
      }
    }
    if(myUser.handle == result[i].handle){
      caption.removeChild(caption.lastChild);
    }
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    selectedTimeline.appendChild(col)
  }
}

function appendFollowing(result){
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
  getSuggestions(userSuggestions);
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('width', 60);
    picture.setAttribute('height', 60);
    picture.setAttribute('data-id', 'thumbnailProfile');
    picture.className = 'img-rounded margin'
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center low-margin";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var followingBtn = document.createElement('button');
    followingBtn.setAttribute('data-id', 'unfollow')
    followingBtn.className="btn"
    var followingText = document.createTextNode('Unfollow');
    followingText.className="text-muted white small text-center";
    followingBtn.appendChild(followingText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(followingBtn);
    if(myUser.handle == result[i].handle){
      caption.removeChild(caption.lastChild);
    }
    caption.appendChild(br);
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    selectedTimeline.appendChild(col)
  }
}

function appendFavs(body){
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
  getSuggestions(userSuggestions);
  for(var i = 0; i <body.length; i++){
    var panel = document.createElement('div');
    panel.className = "panel panel-default no-bottom-margin"
    var panelBody = document.createElement('div');
    panelBody.className = "panel-body";
    var media = document.createElement('div');
    media.className = "media";
    var mediaLeft = document.createElement('div');
    mediaLeft.className = "media-left";
    var mediaBody = document.createElement('div');
    mediaBody.className = "media-body"
    var picture = document.createElement('img')
    picture.setAttribute('src', body[i].picture);
    picture.setAttribute('alt', "Profile Pic");
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', "48");
    picture.setAttribute('height', "48");
    picture.setAttribute('data-id', 'profile')
    var h5 = document.createElement('h5');
    h5.setAttribute('data-id', body[i].handle)
    h5.className="media-heading margin-bottom"
    var p2 = document.createElement('p');
    p2.setAttribute('data-id', body[i].number)
    p2.setAttribute('data-tweet', body[i].text)
    var handle = document.createTextNode('@' + body[i].handle);
    var tweet = document.createTextNode(body[i].text);
    var favIcon = document.createElement('i');
    favIcon.className="fa fa-heart red";
    favIcon.setAttribute('data-id', 'unfavorite')
    var retweetIcon = document.createElement('i');
    retweetIcon.className = "fa fa-retweet";
    retweetIcon.setAttribute('data-id', 'addRetweet');
    if(body[i].re == 1 && body[i].retweeter == myUser.handle ){
      retweetIcon.className = "fa fa-retweet blue";
      retweetIcon.setAttribute('data-id', 'removeRetweet');
      handle = document.createTextNode('You retweeted '+'@' + body[i].handle);
    } else if(body[i].re == 1){
      handle = document.createTextNode('@'+ body[i].retweeter + ' retweeted '+'@' + body[i].handle);
      retweetIcon.className = "fa fa-retweet";
      retweetIcon.setAttribute('data-id', 'cant');
    }
    var fav = document.createElement('li');
    fav.setAttribute('role', 'button');
    var numberOfFavsp = document.createElement('a');
    var numberOfFavs = document.createTextNode(' ' +body[i].numberOfFavs);
    numberOfFavsp.setAttribute('data-id', 'getfavorites' )
    var numberOfRetweetsp = document.createElement('a');
    var numberOfRetweets = document.createTextNode(' ' +body[i].numberOfRetweets + "           ");
    numberOfRetweetsp.setAttribute('data-id', 'getRetweets' )
    var br = document.createElement('br');
    var br2 = document.createElement('br');
    var ul = document.createElement('ul')
    ul.className = 'list-inline'
    var retweet = document.createElement('li');
    retweet.setAttribute('role', 'button');
    numberOfRetweetsp.appendChild(numberOfRetweets);
    retweet.appendChild(retweetIcon);
    retweet.appendChild(numberOfRetweetsp);
    numberOfFavsp.appendChild(numberOfFavs)
    fav.appendChild(favIcon);
    fav.appendChild(numberOfFavsp);
    p2.appendChild(tweet);
    p2.appendChild(br)
    h5.appendChild(handle);
    mediaBody.appendChild(h5);
    mediaBody.appendChild(p2);
    ul.appendChild(retweet);
    ul.appendChild(fav);
    mediaBody.appendChild(ul);
    mediaLeft.appendChild(picture);
    media.appendChild(mediaLeft);
    media.appendChild(mediaBody);
    panelBody.appendChild(media);
    panel.appendChild(panelBody);
    selectedTimeline.appendChild(panel);
  }
}

function search(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/search', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var search = searchBar.value;
  var people = [];
  var people2 = []
  var tags = [];
  var split  = search.split(/\s\w*/);
  for(var i = 0; i<split.length; i++){
    if(split[i].indexOf('@') !== -1){
      people.push(split[i]);
    } else if(split[i].indexOf('#') !== -1){
      tags.push(split[i]);
    }
  }
  for(var z =0; z < people.length; z++){
    people2.push(people[z].split(/\@/));
    people2[z].splice(0,1);
  }
  people.length = 0;
  for(var y = 0; y < people2.length; y++){
    people.push(people2[y][0]);
  }
  var myData = {
    tags: tags,
    people: people
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ==200){
      document.getElementById('userNavSearch').reset();
      var response = JSON.parse(xhr.responseText);
      showSearchContainer();
      removePeople();
      removeTweets();
      appendPeople(response.users);
      appendTweets(response.tweets)
    }
  }
}

function appendPeople(response){
  if(response.length == 0){
    var div = document.createElement('div');
    var h4 = document.createElement('h4');
    h4.className="text-center"
    var text = document.createTextNode('Sorry but no people could be found!');
    h4.appendChild(text);
    div.appendChild(h4);
    searchResultsPeople.appendChild(div);
  }else{
    for(var i=0; i< response.length; i++){
      var col = document.createElement('div');
      col.className="col-xs-6 col-md-4"
      var thumbnail = document.createElement('div')
      thumbnail.className ="thumbnail"
      var caption = document.createElement('div')
      caption.className="caption text-center"
      var picture = document.createElement('img');
      picture.setAttribute('src', response[i].picture);
      picture.setAttribute('alt', "Profile Pic")
      picture.setAttribute('width', 60);
      picture.setAttribute('height', 60);
      picture.setAttribute('data-id', 'thumbnailProfile')
      picture.className = 'img-rounded margin'
      var br = document.createElement('br');
      var userName = document.createElement('h1');
      userName.className ="text-center low-margin";
      var userHandle = document.createElement('p');
      userName.setAttribute('data-id', response[i].handle)
      userHandle.className = "text-center";
      var userText = document.createElement('p');
      userText.className = "small text-center";
      var userNameText = document.createTextNode(captilizeFirstLetter(response[i].name));
      var userHandleText = document.createTextNode('@'+response[i].handle);
      var userTextNode = document.createTextNode(captilizeFirstLetter(response[i].text));
      var followingBtn = document.createElement('button');
      followingBtn.setAttribute('data-id', 'unfollow')
      followingBtn.className="btn"
      var followingText = document.createTextNode('Unfollow');
      followingText.className="text-muted white small text-center";
      var followBtn = document.createElement('button');
      followBtn.setAttribute('data-id', 'follow')
      followBtn.className = "btn btn-primary"
      var followText = document.createTextNode('Follow');
      followText.className="text-muted white small text-center";
      followBtn.appendChild(followText)
      followingBtn.appendChild(followingText)
      userName.appendChild(userNameText);
      userHandle.appendChild(userHandleText);
      userText.appendChild(userTextNode);
      caption.appendChild(userName);
      caption.appendChild(userHandle);
      caption.appendChild(userText);
      caption.appendChild(br);
      caption.appendChild(followBtn);
      var loop = myUser.following
      for(var z =0; z< loop.length; z++){
        if(loop[z].handle == response[i].handle){
          caption.removeChild(caption.lastChild);
          caption.appendChild(followingBtn);
          break;
        }
      }
      if(myUser.handle == response[i].handle){
        caption.removeChild(caption.lastChild);
      }
      thumbnail.appendChild(picture);
      thumbnail.appendChild(caption);
      col.appendChild(thumbnail)
      searchResultsPeople.appendChild(col)
    }
  }
}

function appendTweets(response){
  if(response.length == 0){
    var div = document.createElement('div');
    var h4 = document.createElement('h4');
    h4.className="text-center"
    var text = document.createTextNode('Sorry but no tweets could be found!');
    h4.appendChild(text);
    div.appendChild(h4);
    searchResultsTweets.appendChild(div);
  }else{
    for(var z = 0; z <response.length; z++){
      var panel = document.createElement('div');
      panel.className = "panel panel-default no-bottom-margin"
      var panelBody = document.createElement('div');
      panelBody.className = "panel-body";
      var media = document.createElement('div');
      media.className = "media";
      var mediaLeft = document.createElement('div');
      mediaLeft.className = "media-left";
      var mediaBody = document.createElement('div');
      mediaBody.className = "media-body"
      var picture = document.createElement('img')
      picture.setAttribute('src', response[z].picture);
      picture.setAttribute('alt', "Profile Pic");
      picture.setAttribute('class', "img-rounded")
      picture.setAttribute('width', "48");
      picture.setAttribute('height', "48");
      picture.setAttribute('data-id', 'profile')
      var h5 = document.createElement('h5');
      h5.setAttribute('data-id', response[z].handle)
      h5.className="media-heading margin-bottom"
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      p2.setAttribute('data-id', response[z].number)
      p2.setAttribute('data-tweet', response[z].text)
      var handle = document.createTextNode('@' + response[z].handle)
      var tweet = document.createTextNode(response[z].text);
      var favIcon = document.createElement('i');
      favIcon.className ="fa fa-heart-o";
      favIcon.setAttribute('data-id', 'addfavorite');
      if(myUser.favs.length != undefined){
        for(var y = 0; y < myUser.favs.length; y++){
          if (myUser.favs[y].number == response[z].number && myUser.favs[y].handle == response[z].handle){
            favIcon.className="fa fa-heart red";
            favIcon.setAttribute('data-id', 'unfavorite')
          }
        }
      }
      var retweetIcon = document.createElement('i');
      retweetIcon.className = "fa fa-retweet";
      retweetIcon.setAttribute('data-id', 'addRetweet');
      if(response[z].re == 1 && response[z].retweeter == myUser.handle ){
        retweetIcon.className = "fa fa-retweet blue";
        retweetIcon.setAttribute('data-id', 'removeRetweet');
      }
      var fav = document.createElement('li');
      fav.setAttribute('role', 'button');
      var numberOfFavsp = document.createElement('a');
      var numberOfFavs = document.createTextNode(' ' +response[z].numberOfFavs);
      numberOfFavsp.setAttribute('data-id', 'getfavorites' )
      var numberOfRetweetsp = document.createElement('a');
      var numberOfRetweets = document.createTextNode(' ' +response[z].numberOfRetweets + "           ");
      numberOfRetweetsp.setAttribute('data-id', 'getRetweets' )
      var br = document.createElement('br');
      var br2 = document.createElement('br');
      var ul = document.createElement('ul')
      ul.className = 'list-inline'
      var retweet = document.createElement('li');
      retweet.setAttribute('role', 'button');
      numberOfRetweetsp.appendChild(numberOfRetweets);
      retweet.appendChild(retweetIcon);
      retweet.appendChild(numberOfRetweetsp);
      numberOfFavsp.appendChild(numberOfFavs)
      fav.appendChild(favIcon);
      fav.appendChild(numberOfFavsp);
      p2.appendChild(tweet);
      p2.appendChild(br)
      h5.appendChild(handle);
      mediaBody.appendChild(h5);
      mediaBody.appendChild(p2);
      ul.appendChild(retweet);
      ul.appendChild(fav);
      mediaBody.appendChild(ul);
      mediaLeft.appendChild(picture);
      media.appendChild(mediaLeft);
      media.appendChild(mediaBody);
      panelBody.appendChild(media);
      panel.appendChild(panelBody);
      searchResultsTweets.appendChild(panel);
      if(response[z].retweets.length != undefined){
        for (var q = 0; q < response[z].retweets.length; q++){
          if (response[z].retweets[q].handle == myUser.handle){
            searchResultsTweets.removeChild(searchResultsTweets.lastChild);
          }
        }
      }
    }
  }
}

function removePeople(){
  var element = searchResultsPeople;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function removeTweets(){
  var element = searchResultsTweets;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function showSearchedPeople(){
  searchResultsPeople.className ="row-fluid"
}

function hideSearchedPeople(){
  searchResultsPeople.className ="hidden row-fluid"
}

function showSearchedTweets(){
  searchResultsTweets.className = "row-fluid"
}

function hideSearchedTweets(){
  searchResultsTweets.className = "hidden row-fluid"
}

function logout(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", '/logout', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      goToLanding();
    }
  }
};

function goToLanding(){
  removeTimeline();
  removeUserInfo();
  removeMessages();
  removeSuggestions();
  removeSelectedInfo();
  removeSelectedTimline();
  removeSelectedSuggestions();
  removeMessageList();
  removeMessageInfo();
  removeNotifcations();
  hideNotifcationsContainer();
  hideSearchContainer();
  dashboard.className = "hidden";
  selectedProfile.className = "container-fluid hidden"
  userProfile.className = "container-fluid well";
  messagesContainer.className ="container-fluid hidden"
  landingPage.className = "row-fluid";
}

function removeMessageList(){
  var element = messageList;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function removeMessageInfo(){
  var element = messagesInfo;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function appendNotifications(){
  showNotifcationsContainer();
  removeNotifcations();
  notificationNumber.textContent = 0;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/notifications');
  xhr.send();
  xhr.onload = function(){
    if(xhr.status ===200){
      var reverse = myUser.notifications.reverse();
      for(var i = 0; i <reverse.length; i++){
        var x = reverse[i];
        var panel = document.createElement('div');
        panel.className = "panel panel-default"
        var panelBody = document.createElement('div');
        panelBody.className = "panel-body";
        var panelHeading = document.createElement('div');
        panelHeading.className = "panel-heading grey-background"
        var pic = document.createElement('img')
        pic.setAttribute('src', x.picture);
        pic.setAttribute('data-id', 'selectNotification');
        pic.setAttribute('data-name', x.handle);
        pic.setAttribute('height', 30);
        pic.setAttribute('width', 30);
        pic.className = "img-rounded float-left"
        var h5 = document.createElement('h5');
        h5.className=""
        var p = document.createElement('p');
        var handle = document.createTextNode(" From: @" + x.handle);
        var text = document.createTextNode('@'+x.handle+ ' ' + "favorited your tweet " + "'" + x.text + "'");
        if(x.retweet ==1){
          var text = document.createTextNode('@'+x.handle+ ' ' + "retweeted your tweet " + "'" + x.text + "'");
        }else if(x.mess == 1){
          var text = document.createTextNode('@'+x.handle+ ' ' + "messaged you " + "'" + x.text + "'");
          pic.setAttribute('src', 'https://abs.twimg.com/sticky/default_profile_images/default_profile_0_200x200.png')
        } else if(x.men == 1){
          var text = document.createTextNode('@'+x.handle+ ' ' + "mentioned you in " + "'" + x.text + "'");
        }else if (x.fol == 1){
          var text = document.createTextNode('@'+x.handle+ ' ' + "followed you.");
          pic.setAttribute('src', 'https://abs.twimg.com/sticky/default_profile_images/default_profile_0_200x200.png')
        }
        h5.appendChild(pic);
        h5.appendChild(handle);
        p.appendChild(text);
        panelHeading.appendChild(h5);
        panelBody.appendChild(p);
        panel.appendChild(panelHeading);
        panel.appendChild(panelBody);
        notifications.appendChild(panel)
      }
    }
  }
}

function myTarget(event){
  var ev = event;
  var target = ev.target;
  var id = target.id
  var handle;
  var theTarget = target.dataset.id;
  if (theTarget == 'follow'){
    addFollower(target);
  }else if(id == 'submitTweet'){
    makeTweet();
  }else if(theTarget == 'userTweets'){
    var data = myUser.handle;
    getSelectedProfile(data, getSelectedTimeline);
  }else if(theTarget == 'userFollowers'){
    var data = myUser.handle;
    getSelectedProfile(data, getFollowers);
  }else if(theTarget == 'userFollowing'){
    var data = myUser.handle;
    getSelectedProfile(data, getFollowing);
  } else if(theTarget == 'selectTweets'){
    var data = findNavParent(target);
    getSelectedProfile(data, getSelectedTimeline);
  } else if(theTarget == 'selectFollowing'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFollowing);
  }else if(theTarget == 'selectFollowers'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFollowers);
  } else if(theTarget == 'profile') {
    var data = target.parentNode.nextSibling.getElementsByTagName('h5')[0].dataset.id;
    getSelectedProfile(data, getSelectedTimeline);
  }else if(theTarget == 'thumbnailProfile') {
    var data = target.nextSibling.firstChild.dataset.id;
    getSelectedProfile(data, getSelectedTimeline);
  } else if(id == 'userHome'){
    removeSelectedInfo();
    removeSelectedTimline();
    removeSelectedSuggestions();
    getUpdatedUser();
  } else if(theTarget == 'addfavorite'){
    addFavorite(target);
  } else if(theTarget == 'selectFavs'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFavs);
  }else if(theTarget == 'unfavorite'){
    unFavorite(target);
  } else if(theTarget == 'unfollow'){
    removeFollower(target);
  }else if(theTarget == 'addRetweet'){
    addRetweet(target);
  }else if(theTarget == 'removeRetweet'){
    removeRetweet(target);
  }else if(id == 'userMessages'){
    getMessages();
  }else if(theTarget == 'message'){
    getMessageList(target);
  }else if(id == 'close'){
    $('#logoutIcon').popover('hide')
    logout();
  }else if(id == 'submitMessage'){
    sendMessage(target);
    document.getElementById('form4').reset();
  }else if(id == "userNotifications"){
    appendNotifications();
  }else if(theTarget == 'follow1'){
    addFollower1(target);
  }else if(theTarget == 'message1'){
    getMessages();
    getMessageList1(target);
  }else if(theTarget == 'tweet1'){
    $('#tweetAt').modal('show')
    handle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
    modaltext.value = ('@'+handle);
  }else if(id == 'modaltweet'){
    makeTweet1();
  }else if(id=='navTweet'){
    $('#tweetAt').modal('show');
  }else if(id=="userNavSearchBtn"){
    search();
  }else if(id == 'searchPeople'){
    searchPeople.parentElement.className = "active";
    searchTweets.parentElement.className = ""
    showSearchedPeople();
    hideSearchedTweets();
  }else if(id == 'searchTweets'){
    searchPeople.parentElement.className =""
    searchTweets.parentElement.className = "active";
    hideSearchedPeople();
    showSearchedTweets();
  }else if(theTarget == 'selectNotification'){
    console.log(target);
    getSelectedProfile(target.dataset.name, getSelectedTimeline);
  }
}

function findNavParent(target){
  var parent = target.parentNode;
  var theParent = parent.parentNode.parentNode.parentNode.parentNode.previousElementSibling.firstChild.nextSibling.firstChild.getElementsByTagName('h1')[0]
  var handle = theParent.dataset.id;
  return handle;
}

function updateTimeline(){
  userProfile.className = 'container-fluid well'
  selectedProfile.className ="hidden container-fluid well"
  hideNotifcationsContainer();
  removeTimeline();
  removeUserInfo();
  removeSuggestions();
  appendUserInfo();
  getUserTimeline();
  getSuggestions(suggestions);
  hideMessagesContainer();
  hideSearchContainer();
}

function showSelctedSuggestions(){
  userSuggestions.className = "";
}

function removeTimeline(){
  var element = timeline;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function removeUserInfo(){
  var element = userInfo;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function showMessagesContainer(){
  landingPage.className = "hidden";
  userProfile.className="hidden";
  selectedProfile.className = "hidden"
  notificationContainer.className="hidden"
  hideSearchContainer();
  messagesContainer.className="container-fluid well";
}

function showNotifcationsContainer(){
  selectedProfile.className="hidden";
  userProfile.className = "hidden";
  messagesContainer.className = "hidden"
  hideSearchContainer();
  notificationContainer.className = "container-fluid"
}

function showSearchContainer(){
  selectedProfile.className="hidden";
  userProfile.className = "hidden";
  messagesContainer.className = "hidden"
  notificationContainer.className = "hidden"
  searchContainer.className = "container-fluid well"
}

function hideNotifcationsContainer(){
  notificationContainer.className = "hidden container-fluid"
}

function hideSearchContainer(){
  searchContainer.className = "hidden container-fluid"
}

function removeNotifcations(){
  var element = notifications;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function hideMessagesContainer(){
  messagesContainer.className = "hidden"
}

function removeMessages(){
  var element = messagesDiv;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  messages.className = "hidden";
}

function showMessages(){
  messages.className = "row-fluid";
  messagesDiv.className=" hidden";
}

function removeSuggestions(){
  var element = suggestions;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function removeSelectedInfo(){
  var element = selectedInfo;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  var element2 = selectedNav;
  while(element2.firstChild){
    element2.removeChild(element2.firstChild);
  }
};

function removeSelectedSuggestions(){
  var element = userSuggestions;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
};

function hideSelectedSuggestions(){
  userSuggestions.className="hidden"
}

function removeSelectedTimline(){
  var element = selectedTimeline;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
};

function captilizeFirstLetter(string){
  if(typeof(string.charAt(0) !== undefined)){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

document.body.addEventListener('click', myTarget)
