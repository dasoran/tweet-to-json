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

var params = {count: 200};
client.get('statuses/home_timeline', params, function(error, tweets, response){
  if (!error) {
    //fs.writeFile(tweetjson, JSON.stringify(tweets));
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];

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
      imgwgettext += 'wget ' + tweet.user.profile_image_url + '\n';
    }
    fs.writeFile(imgwgetsh, imgwgettext);
  }
});
