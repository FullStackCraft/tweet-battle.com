/*eslint no-console:0 */
'use strict';
require('dotenv').config();
require('core-js/fn/object/assign');

//const WebpackDevServer = require('webpack-dev-server');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); // server side of socket
const Twit = require('twit');
var port = process.env.PORT || 8000;
var server;

app.use(express.static('dist')); // statically server everything in the public folder
app.get('/', function (req,res) {
	res.sendFile(path.join(__dirname + '/dist/index.html')); // serve our static index.html
});
http.listen(port, function() {
  console.log('listening on *:' + port);
});

// create the twit bot
var bot = new Twit({
  consumer_key: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_KEY,
  consumer_secret: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_SECRET,
  access_token: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN,
  access_token_secret: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});
// stream the tweets from the bot; emit them with socket.io
var trackWord1, trackWord2;

// TODO: this section hear (declaring trackwords) should be coming from a FORM on the front end. tasty!
trackWord1 = ':)';
trackWord2 = ':(';

var sTrackString = [trackWord1, trackWord2].join(', '); // join two strings with a comma, required by track param in stream function
console.log(sTrackString);
var stream = bot.stream('statuses/filter', {track:  sTrackString});
console.log('streaming...');
stream.on('tweet', function(tweet) {
  if (tweet.text.includes('RT @')) {
    return; // we don't want retweets, just originals
  }
  if (tweet.text.includes(trackWord1)) {
    io.emit('happy', tweet.text + '\n');
  } else {
    io.emit('sad', tweet.text + '\n');
  }
});
