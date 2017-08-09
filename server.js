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
var tracker1 = ':)',
    tracker2 = ':(';

// // send initial state of trackers - make it an interval because while the app is starting up the socket in Meter.js won't hear it
// var iPollInterval = setInterval(function() {
//
// },1000);

var sTrackString = [tracker1, tracker2].join(', '); // join two strings with a comma, required by track param in stream function
// var stream = bot.stream('statuses/filter', {track: sTrackString});

// stream.on('error', function(oError) {
// 	console.log(oError)
// });

// need to register the socket.on in here, otherwise it wont' work
io.sockets.on('connection', function (socket) {
		io.emit('initialTrackers', {tracker1: tracker1, tracker2: tracker2} );
		// socket.on('initializedTrackers', function(){
		// 	console.log('deleting interval');
		// 	clearInterval(iPollInterval);
		// });
		// handle new trackers
		socket.on('updateTrackers', function(trackers) {
			sTrackString = [trackers.tracker1, trackers.tracker2].join(', ');
			console.log("new track string is:");
			console.log(" ");
			console.log(" ");
			console.log(" ");
			console.log(" ");
			console.log(" ");
			console.log(" ");
			
			console.log(sTrackString);
			bot.stream('statuses/filter', getTrackObj()).on('tweet', function(tweet) {
				console.log(tweet.text);
			  if (tweet.text.includes('RT @')) {
			    return; // we don't want retweets, just originals
			  }
			  if (tweet.text.includes(tracker1)) {
			    io.emit('tracker1', tweet.text + '\n');
			  } else {
			    io.emit('tracker2', tweet.text + '\n');
			  }
			});
			// bot.stream().stop();
			// bot.stream('statuses/filter', {track: sTrackString}).on('tweet', function(tweet) {
			// 	console.log(tweet.text);
			// 	console.log(tracker1);
			// 	console.log(tracker2);
			//   if (tweet.text.includes('RT @')) {
			//     return; // we don't want retweets, just originals
			//   }
			//   if (tweet.text.includes(tracker1)) {
			//     io.emit('tracker1', tweet.text + '\n');
			//   } else {
			//     io.emit('tracker2', tweet.text + '\n');
			//   }
			// }); // update stream variable
			// stream.on('disconnect', function (disconnectMessage) { // once stream is truly stopped
			// 	stream = bot.stream('statuses/filter', {track: sTrackString}); // update stream variable
			// 	stream.on('tweet', function(tweet) {
			// 		console.log(tweet.text);
			// 		console.log(tracker1);
			// 		console.log(tracker2);
			// 		if (tweet.text.includes('RT @')) {
			// 			return; // we don't want retweets, just originals
			// 		}
			// 		if (tweet.text.includes(tracker1)) {
			// 			io.emit('tracker1', tweet.text + '\n');
			// 		} else {
			// 			io.emit('tracker2', tweet.text + '\n');
			// 		}
			// 	});
			// 	stream.start();
			// });


			//io.emit('updatedTrackers'); // send back to client that the trackers have been updated
		});
});


// TODO: can we stream in parallel from multiple locations? then we are truly getting a global view
// READ SOURCE of this library, maybe we can get a better idea
function getTrackObj() {
	console.log('in get track string');
	console.log(sTrackString);
	return {track: sTrackString}
}

bot.stream('statuses/filter', getTrackObj()).on('tweet', function(tweet) {
	console.log(tweet.text);
  if (tweet.text.includes('RT @')) {
    return; // we don't want retweets, just originals
  }
  if (tweet.text.includes(tracker1)) {
    io.emit('tracker1', tweet.text + '\n');
  } else {
    io.emit('tracker2', tweet.text + '\n');
  }
});
