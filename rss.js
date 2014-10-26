var http = require('http');

var cache = {};

function serveDelayed(request, response, interval, delay) {

	// See if cache exists
	if (request.hostname in cache) {

		// See if we have enough of a delay built-up
		var size = (delay * 60) / interval;
		if (cache[request.hostname].length > size) {
			// Pop off the oldest entry and return it
			var entry = cache[request.hostname].shift();
			response.writeHead(200);
			response.end(entry);
			console.log("Action taken:   sent " + delay + " hour old reply");
			console.log("Reason:         feed requested");
		} else {
			// If we don't have any data to provide, return a blank feed
			response.writeHead(200);
			response.end('<rss version="2.0" />');
			var when = (size - cache[request.hostname].length) * interval;
			console.log("Action taken:   sent blank feed");
			console.log("Reason:         cache isn't old enough, needs " + when + " more minutes");
		}
	
		// Grab a new entry for the cache
		http.get(request.href, function(res) {
			res.setEncoding('utf8');
			
			var feed = "";
			
			res.on("data", function(chunk) {
				feed += chunk;
			});
			
			res.on("end", function() {
				cache[request.hostname].push(feed);
			});
		}).on('error', function(e) {
			console.log("Error while trying to get feed: " + e.message);
		});
	
	}
	else {
		// Start a cache and use the same logic as above
		cache[request.hostname] = [];
		serveDelayed(request, response, interval, delay);
	}

}

exports.serveDelayed = serveDelayed;