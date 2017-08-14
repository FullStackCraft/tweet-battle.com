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
  console.log('listening on port ' + port);
});

// stream the tweets from the bot; emit them with socket.io
var tracker1 = 'obama',
    tracker2 = 'trump';

var bot = new Twit({
  consumer_key: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_KEY,
  consumer_secret: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_SECRET,
  access_token: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN,
  access_token_secret: process.env.EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});
var stream;



// need to register the socket.on in here, otherwise it wont' work
io.sockets.on('connection', function (socket) {

		// TODO: global count number that is checked every 4 seconds - if it is 0, send event that creates temp message front extends
		// TODO: add functionality for geo location - can see what parts of the world are tweeting what! :)
		function track(tweet, tracker1, tracker2) {
			console.log(tracker1);
			console.log(tracker2);

			if (tweet.text.includes('RT @')) {
				console.log("is retweet, returning...")
				return; // we don't want retweets, just originals
			}
			if (tweet.text.includes(tracker1) && tweet.text.includes(tracker2)) {
				console.log("emitting both");
				io.emit('tracker1', tweet.text + '\n');
				io.emit('tracker2', tweet.text + '\n');
			} else if (tweet.text.includes(tracker1)) {
				console.log("emitting just tracker1");
				io.emit('tracker1', tweet.text + '\n');
			} else if (tweet.text.includes(tracker2)) {
				console.log("emitting just tracker2");
				io.emit('tracker2', tweet.text + '\n');
			}
		}

		io.emit('initialTrackers', {tracker1: tracker1, tracker2: tracker2} );

		stream = bot.stream('statuses/filter', {track: [tracker1, tracker2]})
								.on('tweet', (tweet) => track(tweet, tracker1, tracker2));

		socket.on('updateTrackers', function(trackers) {
			tracker1 = trackers.tracker1;
			tracker2 = trackers.tracker2;
			stream.stop();
			stream = bot.stream('statuses/filter', {track: [tracker1, tracker2]})
									.on('tweet', (tweet) => track(tweet,tracker1,tracker2));
		});
});
