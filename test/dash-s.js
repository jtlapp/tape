var tap = require('tap');
var spawn = require('child_process').spawn;
var trim = require('string.prototype.trim');

tap.test('-s with no fails', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, [
            'TAP version 13',
            '[1] test 1 runs',
            { id: 1, ok: true, name: 'yes 1' },
            '[2] test 2 runs',
            { id: 2, ok: true, name: 'yes 2' },
            { id: 3, ok: true, name: 'yes 3' },
            '[3] test 3 runs',
            { id: 4, ok: true, name: 'yes 4' },
            'assertions 4',
            'pass  4',
            'ok'
        ]);
    });
    
    var ps = tape('-s dash-s/passes-finishes.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('-s with fail', function (t) {
    t.plan(3);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, [
            'TAP version 13',
            '[1] test 1',
            { id: 1, ok: true, name: 'yes 1' },
            '[2] test 2',
            { id: 2, ok: false, name: 'not 2' },
            { id: 3, ok: true, name: 'yes 3' },
            'assertions 3',
            'pass  2',
            'fail  1'
        ]);
    });
    tc.on('bailout', function (msg) {
        t.equal(msg, 'Aborted after 1 failed test(s)');
    });
    
    var ps = tape('-s dash-s/fails-aborts.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 1);
    });
});

tap.test('-s2 with fail', function (t) {
    t.plan(3);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, [
            'TAP version 13',
            '[1] test 1',
            { id: 1, ok: true, name: 'yes 1' },
            '[2] test 2',
            { id: 2, ok: false, name: 'not 2' },
            { id: 3, ok: true, name: 'yes 3' },
            '[3] test 3',
            { id: 4, ok: true, name: 'yes 4' },
            { id: 5, ok: false, name: 'not 5' },
            'assertions 5',
            'pass  3',
            'fail  2'
        ]);
    });
    tc.on('bailout', function (msg) {
        t.equal(msg, 'Aborted after 2 failed test(s)');
    });
    
    var ps = tape('-s2 dash-s/fails-aborts.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 1);
    });
});

function tape(args) {
  var proc = require('child_process')
  var bin = __dirname + '/../bin/tapeo'

  return proc.spawn(bin, args.split(' '), { cwd: __dirname })
}
