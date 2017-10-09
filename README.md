# linter-patch-errors-singleline package [![Build Status][travis-badge]][travis]

Patches the [linter] package to make all errors singleline.

> Intimidated by all those red squigglies? No more!

| Before | After |
|--------|-------|
|![Several lines of unreachable code are highlighted in red.][image-before]|![Only the first line of unreachable code is highlighted in red.][image-after]|

## Installation

1. Install the [linter] package.

2. Install this package, either from the Settings View in Atom, or from the command line:

```bash
apm install linter-patch-errors-singleline
```

## Questions & Answers

### How does this work?

It's a hack.

This package `require()`:s a file in the [linter] package and monkey-patches a method on a class in there. The monkey-patched version of the method mutates all messages reported by linters, changing the range ends so that all errors and warnings appear to be singleline.

### Why hacking instead of forking?

#### Pros

You can always install the latest official versions without having to wait for me to update.

#### Cons

This package may break unexpectedly if [linter] is refactored. However, the monkey-patch is very small, so it should be easy to fix.

### Why not monkey-patch [linter-ui-default] instead?

It makes sense for [linter] to report the full ranges for errors, and leave it up to UI packages to decide how to display them. I tried to do this, but ended up having to mutate the ranges anyway. Then I could just as well monkey-patch [linter] itself, which was easier. It also means that this package works with any UI package.

### Why isn't this an option of the official packages?

See [steelbrain/linter-ui-default#398 (comment)][linter-ui-default-issue] and onwards.

[image-after]: images/after.png
[image-before]: images/before.png
[linter-ui-default-issue]: https://github.com/steelbrain/linter-ui-default/issues/398#issuecomment-331632791
[linter-ui-default]: https://github.com/steelbrain/linter-ui-default
[linter]: https://github.com/steelbrain/linter
[travis-badge]: https://travis-ci.org/lydell/linter-patch-errors-singleline.svg?branch=master
[travis]: https://travis-ci.org/lydell/linter-patch-errors-singleline
