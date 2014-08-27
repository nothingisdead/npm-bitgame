var BlockchainWallet = require('blockchain-wallet');
var EventEmitter     = require('events').EventEmitter;
var util             = require('util');
var balances         = {};

var BitGame = function(config, buy_in, num_players, fee, distribution) {
	fee          = fee || 0;
	distribution = distribution || [1];

	var self      = this;
	var wallet    = new BlockchainWallet(config.guid, config.password, config.password2);
	var addresses = [];

	function init() {
		var callback = function(error, result) {
			if(error) {
				throw new Error(error);
			}

			addresses.push(result.address);

			self.emit('address', result.address);

			if(addresses.length === num_players) {
				self.emit('ready', addresses);
			}
		};

		for(var i = 0; i < num_players; i++) {
			wallet.newAddress({}, callback);
		}
	}

	function checkPayments() {
		wallet.list(function(error, data) {
			if(error) {
				throw new Error(error);
			}

			var received_all = true;
			var tmp_balances = {};

			for(var i in data.addresses) {
				var address = data.addresses[i].address;
				var balance = data.addresses[i].balance;

				tmp_balances[address] =+balance;
			}

			for(var i in addresses) {
				var address = addresses[i];

				old_received = balances[address] >= buy_in;
				new_received = tmp_balances[address] >= buy_in;

				if(new_received && !old_received) {
					self.emit('received', address, tmp_balances[address]);
				}

				balances[address] = tmp_balances[address];

				if(!new_received) {
					received_all = false;
				}
			}

			if(received_all) {
				self.emit('received_all', end, balances);
			}
			else {
				setTimeout(checkPayments, 5000);
			}
		});
	}

	function end(positions) {
		if(typeof positions === 'string') {
			positions = [positions];
		}

		if(positions.length > distribution.length) {
			console.log("The number of distribution rules must be greater than or equal to the number of winning positions.");
		}

		var total = buy_in * num_players;

		if(fee < 1) {
			total *= (1 - fee);
		}
		else {
			total -= fee;
		}

		var payouts = {};

		for(var i in distribution) {
			var payout  = total * distribution[i];
			var address = positions[i];

			if(address) {
				payouts[address] = payout;
			}
		}

		wallet.sendMany(payouts, {}, function(error, result) {
			if(error) {
				self.emit('payout_error', error);
			}
			else {
				self.emit('payouts_sent', payouts);
			}

			wallet.autoConsolidate(1, function(error, result) {
				self.emit('consolidated', result);
				self.emit('completed');
			});
		});
	};

	init();

	this.on('ready', checkPayments);
};

util.inherits(BitGame, EventEmitter);

module.exports = BitGame;
