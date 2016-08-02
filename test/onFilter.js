var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('test onFilter retitling', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# [1] first test',
            'ok 1 dummy assertion',
            '# [3] third test',
            'ok 2 dummy assertion',
            '',
            '1..2',
            '# tests 2',
            '# pass  2',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    var counter = new TestCounter();
    tapeTest.onFilter(counter.filter.bind(counter));
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("dummy assertion");
        t.end();
    });
    
    tapeTest('second test', {skip: true}, function (t) {
        t.pass("dummy assertion");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.pass("dummy assertion");
        t.end();
    });
});

tap.test('test onFilter skip scheduling', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test +tag',
            'ok 1 dummy assertion',
            '# third test +tag',
            'ok 2 dummy assertion',
            '# would exit with error here',
            '',
            '1..2',
            '# tests 2',
            '# pass  2',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onFilter(function (testName, skipping, skipIt) {
        if (!/[+]tag/.test(testName)) {
            return null;
        }
        return (skipping ? "would exit with error here" : testName);
    });
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test +tag', function (t) {
        t.pass("dummy assertion");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        t.fail("dummy assertion");
        t.end();
    });

    tapeTest('third test +tag', function (t) {
        t.pass("dummy assertion");
        t.end();
    });

    tapeTest('fourth test +tag', {skip: true}, function (t) {
        t.fail("dummy assertion");
        t.end();
    });

});

tap.test('test onFilter only scheduling', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# [1] second test',
            'ok 1 dummy assertion',
            '',
            '1..1',
            '# tests 1',
            '# pass  1',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    var counter = new TestCounter();
    tapeTest.onFilter(counter.filter.bind(counter));
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.fail("dummy assertion");
        t.end();
    });
    
    tapeTest.only('second test', function (t) {
        t.pass("dummy assertion");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.fail("dummy assertion");
        t.end();
    });
});

function TestCounter() {
    this.testCount = 0;
}

TestCounter.prototype.filter = function (testName, skipping, skipIt) {
    ++ this.testCount;
    return (skipping ? null : '['+ this.testCount +'] '+ testName);
};
