import './../css/modal.css'
import './../css/loading.css'
import './../css/waterfall.css'
// import './../css/bucket.css'


require('./500px');

_500px.init({
	sdk_key: 'b68e60cff4c929bedea36ca978830c5caca790c3'
});

var Application = require('./app');
var Waterfall = require('./waterfall');

var col = 2;
if(innerWidth > 1200) col = 5;
else if(innerWidth > 992) col = 4;
else if(innerWidth > 768) col = 3;

new Application(new Waterfall($('#gallery'), col));


// var Bucket = require('./bucket');

// new Application(new Bucket($('#gallery')))