var tape = require('../..');

tape('test 1 runs', function (t) {
    t.pass('yes 1');
    t.end();
});

tape('test 2 runs', function (t) {
    t.pass('yes 2');
    t.pass('yes 3');
    t.end();
});

tape('test 3 runs', function (t) {
    t.pass('yes 4');
    t.end();
});
