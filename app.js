var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Twitter = require('twitter');
var env = require('var');
var app = express();
var jsonParser = bodyParser.json();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/user'
const EventEmitter = require('events');
const myEvent = new EventEmitter();

var users= [];
var globalUsers =[]
var tweets= [];
var userNumber = 0;

function User(user){
  this.name = user.name;
  this.pass = user.pass;
  this.handle = user.id;
  this.caption = '';
  this.tweets = [];
  this.numberOfTweets = 0;
  this.followers = [];
  this.following = [];
  this.numberOfFollowers = 0;
  this.numberOfFollowing = 0;
  this.settingColor = 'blue';
  this.notifications = [];
  this.messages =[];
  this.numberOfNotifications = 0;
  this.numberOfMessages = 0;
}
function Tweet(tweet){
  this.name = tweet.name
  this.date = new Date(Date.now);
  this.text = tweet.text;
  this.handle = tweet.handle;
  this.favs = [];
  this.numberOfFavs = 0
  this.retweets = [];
  this.numberOfRetweets = 0;
  this.tags = tweet.tag;
  this.mentions = tweet.mentions;
}

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/*client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
});
stream.on('error', function(error) {
    throw error;
  });
});*/
function checkLogin(check){
  for(var i= 0; i< users.length; i++){
    if( check.id == users[i].handle && check.pass == users[i].pass){
      return users[i];
    }
  }
};

function findUser(payload, b){
  var payload = payload;
  var findUsers = function(db, callback) {
  var myData = {
    handle:payload.id
  }
   var cursor = db.collection('users').find(myData);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        users.push(doc)
      } else {
        callback();
    }
 });
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('finding a user');
    findUsers(db,function(){
      db.close();
      myEvent.emit(b)
    })
  })
};

function findUserUpdate(payload, b){
  var payload = payload;
  var findUsers = function(db, callback) {
  var myData = {
    handle:payload.user
  }
   var cursor = db.collection('users').find(myData);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        users.push(doc)
      } else {
        callback();
    }
 });
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('finding updated user info');
    findUsers(db,function(){
      db.close();
      myEvent.emit(b)
    })
  })
};

function newUser(user, a){
 var neophite = new User(user);
 users.push(neophite);
 userNumber ++;
 var insertUser = function(db,callback){
   db.collection('users').insertOne(neophite, function(err, result) {
   assert.equal(err, null);
   callback();
  })
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I added a new user to the database');
    insertUser(db,function(){
      db.close();
      myEvent.emit(a, neophite)
    })
  })
};

function makeTweet(tweet, a){
  var chirp = new Tweet(tweet);
  var handle = {
    handle:chirp.handle
  }
  var myData ={
    tweets: chirp
  }
  var insertTweet = function(db,callback){
    db.collection('users').update(handle,{ $push: mydata })
  }
   MongoClient.connect(url, function(err,db){
     assert.equal(null,err);
     console.log('I added a new user to the database');
     insertTweet(db,function(){
       db.close();
       myEvent.emit(a)
     })
   })
};

function findTweets(b){
  var findTweets = function(db, callback) {
    var cursor = db.collection('tweets').find();
    cursor.each(function(err, doc) {
       assert.equal(err, null);
       if (doc != null) {
         tweets.push(doc)
       } else {
         callback();
     }
   });
  }
    MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding tweets in the database');
    findTweets(db,function(){
      db.close();
      myEvent.emit(b)
    })
  })
};

function updateFindTweets(a){
  var updateTweets = []
  var upTweets = function(db, callback) {
    var cursor = db.collection('tweets').find();
    cursor.each(function(err, doc) {
       assert.equal(err, null);
       if (doc != null) {
         updateTweets.push(doc)
       } else {
         callback();
     }
   });
  }
    MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding updated tweets in the database');
    upTweets(db,function(){
      db.close();
      myEvent.emit(a, updateTweets)
    })
  })
};


function checkFollowingTweets(user){
  var payload = []
  var user = user;
  for(var i = 0; i<user.length; i++){
    var follow = user[i].handle;
    for(var y = 0; y <tweets.length; y++){
      if (follow == tweets[y].handle){
      var a = tweets[y];
      payload.push(a);
      }
    }
  }
  return payload;
};

function updateFollowingTweets(user, something){
  var payload = []
  var something = something;
  for(var i = 0; i<user.length; i++){
    var follow = user[i].handle;
    for(var y = 0; y <something.length; y++){
      if (follow == something[y].handle){
      var a = something[y];
      payload.push(a);
      }
    }
  }
  return payload;
};

function findSuggestions(a){
  var suggestions = [];
  var findUsers = function(db, callback) {
   var cursor = db.collection('users').find().limit(9);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        suggestions.push(doc)
      } else {
        callback();
    }
 });
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding suggestions');
    findUsers(db,function(){
      db.close();
      myEvent.emit(a, suggestions)
    })
  })
};

function checkSuggestions(user, suggestions){
  var suggestions = suggestions;
  var name = user.handle;
  for (var z = 0; z<suggestions.length; z++){
    if (name == suggestions[z].handle){
      suggestions.splice(z,1);
    }
  }
  for(var i = 0; i<user.following.length; i++){
    var follow = user.following[i].handle;
    for(var y = 0; y <suggestions.length; y++){
      if (follow == suggestions[y].handle){
        suggestions.splice(y,1);
      }
    }
  }
  return suggestions;
};

function addFollower(user, a){
  var handle = {
    handle:user.user
  }
  var handle2 = {
    handle:user.follow
  }
  var myData = {
    following:handle2
  }
  var myData2 = {
    followers:handle
  }
   MongoClient.connect(url, function(err,db){
     assert.equal(null,err);
     console.log('I am updating followers');
     var bulk = db.collection('users').initializeUnorderedBulkOp();
     bulk.find(handle).update({ $push: myData });
     bulk.find(handle).update({$inc:{"numberOfFollowing" : 1}});
     bulk.find(handle2).update({ $push: myData2 });
     bulk.find(handle2).update({ $inc: {"numberOfFollowers": 1}});
    bulk.execute();
    myEvent.emit(a);
   })
}

app.use(express.static('./public/'));

app.get('/home', cookieParser(), function(req,res){
  if(req.cookies.remember == 'true'){
    findUser(req.cookies, 'cookie');
    myEvent.on('cookie', function(){
      for(var i= 0; i< users.length; i++){
        if( req.cookies.user == users[i]._id && req.cookies.id == users[i].handle){
           res.json(users[i]);
           res.end();
        }
      }
    })
  } else{
    console.log('no cookies');
  }
})

/*app.get('/userTimeline', cookieParser(), function(req, res) {
  for(var i= 0; i< users.length; i++){
    if(req.cookies.id == users[i].handle){
      var user = users[i].following;
       findFollowingTweets(users[i].following, 'followingTweets');
       myEvent.on('followingTweets', function(body){
         var payload = checkFollowing(user,body);
         res.json(payload);
         res.end()
      })
    }
  }
});*/

app.post('/tweet', jsonParser,function(req, res) {
  makeTweet(req.body, 'tweet');
  myEvent.on('tweet', function(){
    res.send(req.body);
    res.end()
  })
});

/*app.post('/signup', jsonParser, function(req,res){
  newUser(req.body, 'signup');
  myEvent.on('signup', function(result){
    res.cookie('user', result._id);
    res.cookie('id', result.handle);
    res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
    res.json(result);
    console.log('We have a new user!' + ' Total number of users: ' + userNumber );
  })
});*/


/*app.get('/suggestions', cookieParser(), function(req, res) {
  for(var i= 0; i< users.length; i++){
    if(req.cookies.id == users[i].handle){
      var user = users[i];
      findSuggestions('suggestions');
       myEvent.on('suggestions', function(body){
        var payload = checkSuggestions(user, body);
        res.json(payload);
        res.end()
      })
    }
  }
});*/
/*app.post('/addFollower', jsonParser, function(req, res) {
  console.log(req.body);
  addFollower(req.body, 'addFollower');
  myEvent.on('addFollower', function(){
    console.log('hello');
    res.sendStatus(200);
    res.end()
  })
});*/

io.on('connection', function(socket){
  socket.on('login', function(body){
    users = []
    findUser(body, 'send');
    myEvent.on('send', function(){
      var result = checkLogin(body);
      socket.emit('goDash', result);
    })
  })
  socket.on('signup', function(body){
    newUser(body, 'newsignup');
    myEvent.on('snewignup', function(result){
      socket.emit('goDash', result)
    })
  })
  socket.on('userTimeline', function(body){
    for(var i= 0; i< users.length; i++){
      if(body.handle == users[i].handle){
        var user = users[i].following;
        tweets = [];
         findTweets('followingTweets');
         myEvent.on('followingTweets', function(a){
           var payload = checkFollowingTweets(user,a);
           socket.emit('sendUserTimeline', payload)
        })
      }
    }
  })
  socket.on('suggestions', function(body){
    for(var i= 0; i< users.length; i++){
      if(body.handle == users[i].handle){
        var user = users[i];
        findSuggestions('evsuggestions');
         myEvent.on('evsuggestions', function(a){
          var payload = checkSuggestions(user, a);
          socket.emit('sendSuggestions', payload)
        })
      }
    }
  })
  socket.on('addFollower', function(body){
    var user = body;
    addFollower(body, 'evaddFollower');
    myEvent.on('evaddFollower', function(){
      users = [];
    findUserUpdate(user, 'updateUser')
      myEvent.on('updateUser', function(){
        for (var i = 0; i<users.length; i++){
          if(user.user == users[i].handle){
            var payload = users[i];
            socket.emit('sendNewInfo', payload);
          }
        }
      })
    })
  })
  socket.on('updateTimeline', function(body){
    var user = body.following;
    updateFindTweets('updateTweets');
    myEvent.on('updateTweets', function(something){
      var payload = updateFollowingTweets(user,something);
      socket.emit('sendUpdateTweets', payload)
    })
  })
  socket.on('updateSuggestions', function(body){
    var user = body;
    findSuggestions('newSuggestions');
    myEvent.on('newSuggestions', function(something){
      var payload = checkSuggestions(user,something);
      socket.emit('sendNewSuggestions', payload)
    })
  })
})
/*app.post('/login', jsonParser, function(req, res) {
  findUser(req.body, 'send')
  myEvent.on('send', function(){
    var result = checkLogin(req.body);
    res.cookie('user', result._id);
    res.cookie('id', result.handle);
    res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
    res.json(result);
    res.end()
    console.log("I sent settings for: " + req.body.id);
  })
});*/

server.listen(3000);
