var Twitter = require('twitter');
var fs = require('fs');
var url = require('url');
var keyjson = 'key.json';
var userjson = 'user.json';
var tweetjson = 'tweet.json';
var imgwgetsh = 'imgwget.sh';
var indexName = 'twitter-clone'; 

var key = fs.readFileSync(keyjson, 'utf8');
var client = new Twitter(JSON.parse(key));


var tweets = []

var getTimeline = function(maxId, callback) {
  var params = {count: 200}
  if (maxId != -1) params.maxId = maxId;
  client.get('statuses/home_timeline', params, function(error, rawTweets, response){
    if (!error) {
      callback(rawTweets);
    }
  });
};


getTimeline(-1, function (rawTweets) {
  tweets = tweets.concat(rawTweets);
  getTimeline(rawTweets[rawTweets.length-1].id, function() {
    tweets = tweets.concat(rawTweets);
    getTimeline(rawTweets[rawTweets.length-1].id, function() {
      tweets = tweets.concat(rawTweets);
      getTimeline(rawTweets[rawTweets.length-1].id, function() {
        tweets = tweets.concat(rawTweets);
        getTimeline(rawTweets[rawTweets.length-1].id, function() {
          tweets = tweets.concat(rawTweets);
          getTimeline(rawTweets[rawTweets.length-1].id, function() {
            tweets = tweets.concat(rawTweets);
            getTimeline(rawTweets[rawTweets.length-1].id, function() {
              tweets = tweets.concat(rawTweets);
              saveData(tweets);
            });
          });
        });
      });
    });
  });
})



var saveData = function(tweets) {
  //fs.writeFile(tweetjson, JSON.stringify(tweets));
  var addedUserIds = {};
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];

    if (addedUserIds[tweet.user.id] != true) {
      // user first-line
      var toJson = {};
      toJson.index = {}
      toJson.index._index = indexName;
      toJson.index._type = 'user';
      fs.appendFile(userjson, JSON.stringify(toJson) + '\n');

      // user second-line
      var toJson = {};
      toJson.id = tweet.user.id;
      toJson.screen_name = tweet.user.screen_name;
      toJson.name = tweet.user.name;
      toJson.description = tweet.user.description;
      var path = url.parse(tweet.user.profile_image_url).pathname;
      toJson.profile_image_url = 'img' + path;
      toJson.follow = [];
      toJson.follower = [];
      fs.appendFile(userjson, JSON.stringify(toJson) + '\n');

      addedUserIds[tweet.user.id] = true;
    }

    // tweet first-line
    var toJson = {};
    toJson.index = {}
    toJson.index._index = indexName;
    toJson.index._type = 'tweet';
    fs.appendFile(tweetjson, JSON.stringify(toJson) + '\n');

    // tweet second-line
    var toJson = {};
    toJson.id = tweet.id;
    toJson.user_id = tweet.user.id;
    toJson.created_at = tweet.created_at;
    toJson.text = tweet.text
    toJson.retweet_count = tweet.retweet_count;
    toJson.favorite_count = tweet.favorite_count;
    fs.appendFile(tweetjson, JSON.stringify(toJson) + '\n');
  }

  var imgwgettext = '';
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    imgwgettext += 'wget -x ' + tweet.user.profile_image_url + '\n';
  }
  fs.writeFile(imgwgetsh, imgwgettext);
};

