'use strict';

var test = require('tape');

var finished = require('../');
var lines = [
	'TAP version 13',
	'# wait',
	'ok 1 first thing',
	'ok 2 second thing',
	'1..2',
	'# tests 2',
	'# pass  1',
	'# fail  1',
	'ok 3 third thing'
];

test(function (t) {
	t.plan(2);
	var done = false;

	var stream = finished({ wait: 250 }, function (results) {
		t.equal(done, true);

		t.deepLooseEqual(results, {
			ok: true,
			count: 2,
			pass: 2,
			fail: 0,
			bailout: false,
			todo: 0,
			skip: 0,
			plan: { // this is a FinalPlan instance
				start: 1,
				end: 2,
				skipAll: false,
				skipReason: '',
				comment: ''
			},
			failures: [],
			skips: [],
			todos: [],
			time: null,
			passes: undefined,
			asserts: [ // these are Result instances
				{ ok: true, id: 1, name: 'first thing', fullname: 'first thing',
					buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, diag: null, time: null, closingTestPoint: false
				},
				{ ok: true, id: 2, name: 'second thing', fullname: 'second thing',
					buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, diag: null, time: null, closingTestPoint: false
				}
			]
		}, 'results matches expected object');
	});

	var iv = setInterval(function () {
		if (lines.length === 0) {
			clearInterval(iv);
			done = true;
		}

		var line = lines.shift();
		stream.write(line + '\n');
	}, 25);
});
