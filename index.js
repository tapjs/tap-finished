'use strict';

var parser = require('tap-parser');

module.exports = function (opts, cb) {
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}
	if (!opts) { opts = {}; }
	if (opts.wait === undefined) { opts.wait = 1000; }

	var p = parser();
	var seen = { plan: null, asserts: 0 };
	var finished = false;
	var ended = false;

	function finish() {
		finished = true;

		p.on('results', cb);
		if (opts.wait && !ended) {
			setTimeout(function () { p.end(); }, opts.wait);
		} else { p.end(); }
	}

	function check() {
		if (finished) { return; }
		if (seen.plan === null || seen.asserts < seen.plan) { return; }
		finish();
	}

	p.on('end', function () { ended = true; });

	p.on('assert', function () {
		seen.asserts++;
		check();
	});

	p.on('plan', function (plan) {
		seen.plan = plan.end - plan.start;
		check();
	});

	p.on('results', function () {
		if (finished) { return; }
		finish();
	});

	return p;
};
