---
title: About
date: 2026-08-14
---

# About

A page that never changes, so every rebuild skips it. Touch it with `touch content/about.md`
and the default `mtime` strategy notices; switch to `{strategy: 'hash'}` in `index.js` and
it stays skipped, because the content is the same.
