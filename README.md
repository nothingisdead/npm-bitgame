Bitgame
===========

Bitgame makes it easy to create a multiplayer game using BTC as a betting currency.

Example Usage:

```javascript

var BitGame     = require('bitgame');
var buy_in      = 500; // in satoshi
var num_players = 1;
var fee         = 1;

var game = new BitGame({
	guid      : '<guid>',
	password  : '<password>'
	password2 : '<password2>' // optional
}, buy_in, num_players, fee);

test.on('ready', function(data) {
	console.log('Awaiting Buy-ins', data);
});

test.on('received', function(data) {
	console.log('received payment', data);
});

test.on('received_all', function(data) {
	var winners = [
		'winner1_address',
		'winner2_address'
	];

	test.end(winners);
});

```

Feeling generous? Send me a fraction of a bitcoin!

12X8GyUpfYxEP7sh1QaU4ngWYpzXJByQn5