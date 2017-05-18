var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit');
var port = process.env.PORT || 3000;

var bot = new Twit({
  consumer_key: process.env.egghead_twitter_bot_consumer_key,
  consumer_secret: process.env.egghead_twitter_bot_consumer_secret,
  access_token: process.env.egghead_twitter_bot_consumer_access_token,
  access_token_secret: process.env.egghead_twitter_bot_consumer_access_token_secret,
  timeout_ms: 60 * 1000
});

// CHFE 18.05.2017 - add the static image directory to the front end and serve dat shit
app.use(express.static(__dirname + '/img'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});

var stream = bot.stream('statuses/filter', {track: ':), :('});
stream.on('tweet', function(tweet) {
  if (tweet.text.includes("RT @")) {
    return; // we don't want retweets, just originals
  }
  if (tweet.text.includes(":)")) {
    io.emit('happy', tweet.text + '\n');
  } else {
    io.emit('sad', tweet.text + '\n');
  }
});
