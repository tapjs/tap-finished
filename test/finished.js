'use strict';

var test = require('tape');
var finished = require('../');
var lines = [
	'TAP version 13',
	'# wait',
	'ok 1 (unnamed assert)',
	'not ok 2 should be equal',
	'  ---',
	'    operator: equal',
	'    expected: 5',
	'    actual:   4',
	'  ...',
	'',
	'1..2',
	'# tests 2',
	'# pass  1',
	'# fail  1'
];

test(function (t) {
	t.plan(2);
	var done = false;

	var stream = finished({ wait: 0 }, function (results) {
		t.equal(done, false);

		t.deepLooseEqual(results, {
			ok: false,
			count: 2,
			pass: 1,
			fail: 1,
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
			failures: [ // these are Result instances
				{ ok: false, id: 2, name: 'should be equal', fullname: 'should be equal',
					diag: { operator: 'equal', expected: 5, actual: 4 },
					buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, time: null, closingTestPoint: false
				}
			],
			skips: [],
			todos: [],
			time: null,
			passes: undefined,
			asserts: [ // these are Result instances
				{ ok: true, id: 1, name: '(unnamed assert)', fullname: '(unnamed assert)',
					diag: null, buffered: false, tapError: null, skip: false, todo: false,
					previous: null, plan: null, time: null, closingTestPoint: false
				},
				{ ok: false, id: 2, name: 'should be equal', fullname: 'should be equal',
					diag: { operator: 'equal', expected: 5, actual: 4 },
					buffered: false, tapError: null, skip: false, todo: false,
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
