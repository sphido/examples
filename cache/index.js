#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {frontmatter} from '@sphido/frontmatter';
import {markdown} from '@sphido/markdown';
import {changed, removed, writeCache} from '@sphido/cache';

function getHtml({title, content, path}) {
	return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${title ?? 'Sphido'} | Incremental build example</title>
</head>
<body class="prose mx-auto my-6"><main>${content}</main></body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

// The cache watches content, not templates: fold everything that shapes the
// output into one key, and a changed layout rebuilds every page
const version = createHash('sha1').update(await readFile(new URL(import.meta.url))).digest('hex');

const pages = await getPages({path: 'content'}, frontmatter, markdown());

let built = 0;
let skipped = 0;

for (const page of allPages(pages)) {
	page.slug = slugify(page.name) + '.html';
	page.output = join('public', relative('content', dirname(page.path)), page.slug);

	// page.output is set first, so a deleted public/ brings every page back
	if (!(await changed(page, {version}))) {
		skipped++;
		continue;
	}

	await writeFile(page.output, getHtml(page));
	built++;
}

// sources that disappeared since the last build still have their output around
for (const path of removed({version})) {
	console.log(`gone: ${path} — its output in public/ is now stale`);
}

await writeCache({version}); // last, so a failed build does not record success

console.log(`${built} page(s) built, ${skipped} skipped — run it again and nothing is built`);
