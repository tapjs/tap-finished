'use strict';

var test = require('tape');
var finished = require('../');
var lines = [
	'TAP version 13',
	'1..3',
	'ok 1 first',
	'ok 2 what',
	'ok 3 third base',
	'',
	'# weeeee'
];

test(function (t) {
	t.plan(2);
	var done = false;

	var stream = finished({ wait: 0 }, function (results) {
		t.equal(done, false);

		t.deepLooseEqual(results, {
			ok: true,
			count: 3,
			pass: 3,
			fail: 0,
			bailout: false,
			todo: 0,
			skip: 0,
			plan: { // FinalPlan instance
				start: 1,
				end: 3,
				skipAll: false,
				skipReason: '',
				comment: ''
			},
			failures: [],
			asserts: [ // Result instances
				{ ok: true, id: 1, name: 'first' },
				{ ok: true, id: 2, name: 'second' },
				{ ok: true, id: 2, name: 'third base' }
			]
		}, 'results object');
	});

	var iv = setInterval(function () {
		if (lines.length === 0) {
			clearInterval(iv);
			done = true;
			return;
		}

		var line = lines.shift();
		console.log('# write: ' + line);
		stream.write(line + '\n');
	}, 25);
});
