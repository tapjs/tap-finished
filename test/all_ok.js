'use strict';

var test = require('tape');
var finished = require('../');
var lines = [
	'TAP version 13',
	'# wait',
	'ok 1 (unnamed assert)',
	'ok 2 should be equal',
	'1..2',
	'# tests 2',
	'# pass  2'
];

test(function (t) {
	t.plan(2);
	var done = false;

	var stream = finished({ wait: 0 }, function (results) {
		t.equal(done, false);

		t.deepLooseEqual(results, {
			ok: true,
			count: 2,
			pass: 2,
			fail: 0,
			bailout: false,
			todo: 0,
			skip: 0,
			plan: { // FinalPlan instance
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
			asserts: [ // Result instances
				{ ok: true, id: 1, name: '(unnamed assert)', fullname: '(unnamed assert)',
					diag: null, buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, time: null, closingTestPoint: false
				},
				{ ok: true, id: 2, name: 'should be equal', fullname: 'should be equal',
					diag: null, buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, time: null, closingTestPoint: false
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
