#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile, readFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';
import {renderFeed, writeFeed} from '@sphido/feed';

function getHtml({title, content, path, date}) {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${title} | Sphido Example page</title>
</head>
<body class="prose mx-auto my-6"><main>${content}</main></body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

const items = [];

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.slug = join('/', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	page.output = join('public', page.slug);

	page.url = new URL(page.slug, 'https://sphido.org/').toString();
	page.content = marked(await readFile(page.path));
	page.title = page.content.match(/(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i)?.pop();
	page.date = new Date();

	items.push({title: page.title, url: page.url, date: page.date});

	// save HTML file
	await writeFile(page.output, getHtml(page));
}

const xml = renderFeed({
	title: 'RSS example',
	link: 'https://sphido.org/',
	description: 'This is my personal feed!',
	feedUrl: 'https://sphido.org/rss.xml',
}, items);

await writeFeed('public/rss.xml', xml);
