var parser = require('tap-parser');
var through = require('through');

module.exports = function (cb) {
    var p = parser();
    var seen = { plan: null, asserts: 0 };
    var seenEverything = false;
    
    p.on('assert', function (a) {
        seen.asserts ++;
        check();
    });
    
    p.on('plan', function (plan) {
        seen.plan = plan.end - plan.start;
        check();
    });
    
    p.on('results', function () {
        seenEverything = true;
        cb(p.results);
    });
    
    return p;
    
    function check () {
        if (seenEverything) return;
        if (seen.plan !== null || seen.asserts < seen.plan) return;
        
        seenEverything = true;
        cb(p.results);
    }
};
