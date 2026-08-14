---
title: Incremental build example
date: 2026-08-14
---

# Rebuild only what changed

This example builds with [`@sphido/cache`](https://github.com/sphido/sphido/tree/main/packages/sphido-cache).
Run it twice:

```bash
node index.js   # 3 page(s) built, 0 skipped
node index.js   # 0 page(s) built, 3 skipped
```

Then edit any file in `content/` and run it again — only that page is written.

- [about](/about.html)
- [hello world](/blog/hello-world.html)
