var tape = require('../..');

tape('test 1 w/o only', function (t) {
    t.fail('not 1');
    t.end();
});

tape.only('test 2 w/ only', function (t) {
    t.pass('yes 2');
    t.end();
});

tape('test 3 w/o only', function (t) {
    t.fail('not 3');
    t.end();
});
