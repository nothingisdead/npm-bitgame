Bitgame
===========

Bitgame makes it easy to create a multiplayer game using BTC as a betting currency.

Example Usage:

```javascript
var BitGame     = require('bitgame');
var buy_in      = 20000; // in satoshi
var num_players = 1;
var fee         = 0.1;

var game = new BitGame({
	guid      : '<guid>',
	password  : '<password>'
	password2 : '<password2>' // optional
}, buy_in, num_players, fee);

game.on('ready', function(addresses) {
	console.log('Awaiting Buy-ins', addresses);
});

game.on('received', function(address, amount) {
	console.log('Received Payment', address, amount);
});

game.on('received_all', function(endGame, balances) {
	var winners = [
		'<winner_address>',
	];

	endGame(winners);
});

game.on('payout_error', function(error) {
	console.log('Failed to send payouts!', error);
});

game.on('payouts_sent', function(payouts) {
	console.log('Sent Payouts', payouts);
});

game.on('consolidated', function(result) {
	console.log('Consolidated Wallets', result);
});

game.on('completed', function() {
	console.log('The game is over.');
});

```

Feeling generous? Send me a fraction of a bitcoin!

12mDARddJ3fGVncReJvFWNGj5wsSQ2ZNTs