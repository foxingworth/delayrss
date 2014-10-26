var http = require('http');
var url = require('url');
var rss = require('./rss');

function start(options) {

	function onRequest(request, response) {
		
		// Determine what was requested
		var requested = url.parse("http://" + request.url.substring(1));
		if (requested.href == 'http://favicon.ico/')
			return;
		
		console.log("\nRequest received: " + Date() + "\n" + requested.href);
	
		// See if there is logic for this request
		if (options[requested.hostname]) {
			if (~requested.pathname.indexOf(options[requested.hostname]['urls'])) {
				rss.serveDelayed(requested, response, options['interval'], 
					options[requested.hostname]['delay']);
			}
			else {
				console.log("Action taken:   pass-thru");
				console.log("Reason:         feed wasn't requested");
				response.writeHead(302, {
					'location': requested.href
				});
				response.end();
			}
		}
		else {
			console.log("Action taken:   pass-thru");
			console.log("Reason:         hostname unknown");
			response.writeHead(302, {
				'location': requested.href
			});
			response.end();
		}
	
	}
	
	http.createServer(onRequest).listen(options['port']);
	console.log('delayrss started. Listening on port ' + options['port']);
}

exports.start = start;