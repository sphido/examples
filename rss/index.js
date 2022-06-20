#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile, readFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';
import {frontmatter} from '@sphido/frontmatter';
import {Feed} from 'feed';

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

const pages = await getPages({path: 'content'},
	frontmatter,
	async (page, dirent) => {
		if (dirent.isFile()) {
			page.content = marked(await readFile(page.path));
			page.title = page.content.match(/(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i)?.pop();
			page.slug = slugify(page.name) + '.html';
			page.link = join('/', relative('content', dirname(page.path)), page.slug);
			page.id = 'https://sphido.org' + page.link;
			page.output = join('public', page.link);
			page.date = new Date();
		}
	},
);

const feed = new Feed({
	title: 'Example feed',
	generator: 'Sphido CMS',
	link: 'https://sphido.org/rss.xml',
	description: 'Example feed',
});

for (const page of allPages(pages)) {
	feed.addItem(page);
	await writeFile(page.output, getHtml(page));
}

await writeFile('public/rss.xml', feed.rss2());