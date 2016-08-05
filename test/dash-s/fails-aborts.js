var tape = require('../..');

tape('test 1', function (t) {
    t.pass('yes 1');
    t.end();
});

tape('test 2', function (t) {
    t.fail('not 2');
    t.pass('yes 3');
    t.end();
});

tape('test 3', function (t) {
    t.pass('yes 4');
    t.fail('not 5');
    t.end();
});

tape('test 4', function (t) {
    t.pass('yes 6');
    t.end();
});
