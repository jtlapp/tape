# tapeo

`tape`-based test harness with command line options

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

`tapeo` is an alternative to the executable `tape` command that comes with the [`tape` module](https://github.com/substack/tape). This alternative is identical to `tape` except that it also supports the following command line options:

- `-nN` - Runs only test number `N`
- `-s` - Stops after the first test in which assertions fail (coming soon)

To use `tapeo`, the tests themselves must specify `var test = require('tapeo')` until `tape` supports the hooks that `tapeo` makes available to `tape`.

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

It is not possible to use `-n` to run a test that is being skipped via `skip` or for not being the selected `only` test within the set of all run tests. `skip` and `only` reduce the selection of numbered tests available.

*IMPORTANT*: When using `tapeo` to glob across many test files, the test numbers depend on the order in which the files load. This order should be consistent from run-to-run on the same machine, at least until files are added, deleted, or renamed. Test number order may not be consistent from machine to machine, depending on the file system and the order in which the test files occur in the file system.

### Stop after first failed test (`-s`)

Not yet implemented. Coming soon.

# license

MIT
