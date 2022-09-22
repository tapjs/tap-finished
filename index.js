'use strict';

var parser = require('tap-parser');
var assign = require('object.assign');

module.exports = function (opts, cb) {
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}
	if (!opts) { opts = {}; }
	if (opts.wait === undefined) { opts.wait = 1000; }

	var p = parser();
	var seen = { plan: null, asserts: [] };
	var finished = false;
	var ended = false;

	function finish() {
		finished = true;

		p.on('complete', function (finalResult) {
			cb(assign({}, finalResult, { asserts: seen.asserts }));
		});
		if (opts.wait && !ended) {
			setTimeout(function () { p.end(); }, opts.wait);
		} else { p.end(); }
	}

	function check() {
		if (finished) { return; }
		if (seen.plan === null || seen.asserts.length < seen.plan) { return; }
		finish();
	}

	p.on('end', function () { ended = true; });

	p.on('assert', function (result) {
		seen.asserts.push(result);
		check();
	});

	p.on('plan', function (plan) {
		seen.plan = plan.end - plan.start;
		check();
	});

	p.on('complete', function () {
		if (finished) { return; }
		finish();
	});

	return p;
};
