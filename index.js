var server = require("./server");

/***************************
 Options
 (Only change this part)
 **************************/
var options = {};
options['port'] = 18000;	// the port to listen for requests on
options['interval'] = 15;	// the number of minutes the NzbDrone RSS interval is set for
// Kickass options
options['kickass.to'] = {};
options['kickass.to']['delay'] = 72;	// in hours
options['kickass.to']['urls'] = ['/tv/1/'];
// ezRSS options
options['ezrss.it'] = {};
options['ezrss.it']['delay'] = 72;
options['ezrss.it']['urls'] = ['/feed/'];



// Start listening for requests
server.start(options);