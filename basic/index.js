#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {frontmatter} from '@sphido/frontmatter';
import {markdown} from '@sphido/markdown';

function getHtml({title, content, path, date}) {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${title} | Sphido Example page</title>	
</head>
<body class="prose mx-auto my-6">
	<header class="border-b text-2xl py-2 mb-4">Sphido Example website</header>
	<main>${content}</main>
	<footer class="border-t text-sm text-gray-500 pt-1 mt-1 text-right">Created: ${date?.toLocaleDateString()}</footer>
</body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

// frontmatter loads page.content and reads the YAML block, markdown() renders
// the rest to HTML — it goes last, after every extender that wants markdown
const pages = await getPages({path: 'content'}, frontmatter, markdown());

for (const page of allPages(pages)) {
	page.slug = slugify(page.name) + '.html';
	page.output = join('public', relative('content', dirname(page.path)), page.slug);

	// save HTML file
	await writeFile(page.output, getHtml(page));
}