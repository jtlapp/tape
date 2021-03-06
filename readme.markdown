# tapeo

`tape`-based test runner with command line options and extra hooks

## IMPORTANT NOTICE

This module only lived a few days before I decided that the [`tape`](https://github.com/substack/tape) module was too fragile a dependency. `tapeo` is now defunct.

My [`subtap`](https://github.com/jtlapp/subtap) tool replaces it. It was inspired by [`faucet`](https://github.com/substack/faucet) but written for [`tap`](https://github.com/tapjs/node-tap).

## Overview

`tapeo` numbers all named tests and has a command line option for specifying the number of a test to run. There is also an option that halts testing after a specified number of failed tests. `tapeo` provides hooks for preprocessing the set of all tests, for postprocessing each test, and for aborting the test suite with a TAP "Bail out!" notice.

## Installation

You'll want to install the `tapeo` command globally:

```
sudo npm install -g tapeo
```

Then install it in the module you'll be testing:

```
npm install tapeo --save-dev
```

## Command Options

`tapeo` is an alternative to the executable `tape` command that comes with the [`tape` module](https://github.com/substack/tape). This alternative is equivalent to `tape` except that it also supports the following command line options:

- `-nN` - Runs only test number `N`
- `-s` - Stops after the 1st test in which assertions fail
- `-sN` - Stops after the Nth test in which assertions fail

To use `tapeo`, the tests themselves must specify `test = require('tapeo')` until `tape` supports the hooks that `tapeo` provides.

### Run a test number (`-nN`)

The underlying `tape` module distinguishes between "tests" and "assertions". A test is a named group of assertions that provides a reference to a test `t`. The test invokes assertions on `t`, as in `t.equal(actual, expected)`. The `tapeo` command numbers all the tests independently of the assertions.

For example, here is what it might look like to run `tapeo test.js`:

```
TAP version 13
# [1] unrecognized protocol
ok 1 abort required
ok 2 check file not found
# [2] non-resolving domain name
ok 3 abort required
ok 4 check file not found
# [3] valid URL
ok 5 download required
ok 6 file found
```

The bracketed numbers are test numbers. You can run just one test by using its test number in the `-nN` argument.

For example, `tapeo -n2 test.js` would then output the following:

```
TAP version 13
# [2] non-resolving domain name
ok 1 abort required
ok 2 check file not found
```

It is not possible to use `-n` to run a test that is skipped via `skip` or that is excluded by `.only` on another test. `skip` and `only` reduce the selection of numbered tests available.

*IMPORTANT*: When using `tapeo` to glob across many test files, the test numbers depend on the order in which the files load. This order should be consistent from run-to-run on the same machine, at least until files are added, deleted, or renamed. Test number order may not be consistent from machine to machine, depending on the file system and the order in which the test files occur in the file system.

### Stop after Nth failed test (`-s` or `-sN`)

The `-s` option tells `tapeo` to stop running tests after the first test that contains at least one failing test assertion. The entire test with the failed assertion still runs, but no further tests will run.

The `-sN` option tells `tapeo` to stop running tests after the Nth test that contains at least one failing test assertion.

If a test run aborts in this manner, `tapeo` will still output a summary of the passing and failing assertions that it did run. The last line of the test will be a TAP `Bail out!` notice line, which TAP parsers recognize.

## Hooks

`tapeo` supports the following hooks:

### tapeo.onStart(fn)

The onStart hook is called before any tape tests have begun running. The callback `fn` is passed an array of test objects. onStart may rename tests via the `t.name` attribute, remove tests from the array, or otherwise validate the tests before allowing the tests to run. The callback may not employ the methods that are available to the test during its run, except for `tapeo.abort()`.

### tapeo.onTest(fn)

The onTest hook is called after a test completes. A test completes when `t.end()` is called or the test has reached the planned assertion count. The callback `fn` is passed a reference to the test object that just completed. The callback may examine the test object for `t.name`, `t.assertCount`, and `t.failCount`. `assertCount` is the number of assertions in the test, and `failCount` is the number of assertions that failed. `t.comment()` and `tapeo.abort()` are also available.

### tapeo.onFinish(fn)

The onFinish hook will get invoked when ALL tape tests have finished
right before tape is about to print the test summary.

### tapeo.abort(msg)

The `abort` method halts testing after the current test. Calling it produces the output of a summary of all tests that did run, followed by a TAP "Bail out!" notice line. The provided `msg` is tacked onto the notice line to indicate the reason for the abort. This method may be called at any time during testing, including within the onTest hook.

# license

MIT
