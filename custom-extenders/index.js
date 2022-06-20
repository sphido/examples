#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile, readFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';


function metadata(page, dirent) {
	if (dirent.isFile()) {
		page.slug = slugify(page.name) + '.html';
		page.dir = join('public', relative('content', dirname(page.path)));
	}
}

function author(page) {
	page.author = 'Roman Ožana';
}

async function getContent() {
	return marked(await readFile(this.path));
}

const pages = await getPages({path: 'content'},

	// callback extender
	metadata,
	author,
	(page) => {
		page.date = new Date();
	},

	// Object extenders
	{
		getContent,
		getFooter: function () {
			return `<footer class="border-t text-sm text-gray-500 pt-1 mt-1 text-right">Generated from file ${this.path}</footer>`;
		},

		getTitle: function () {
			return this.name + ' | Sphido example website';
		},

		getHtml: async function () {
			return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${this.getTitle()}</title>	
</head>
<body class="prose mx-auto my-6">
	<header class="border-b text-2xl py-2 mb-4">Sphido Example website</header>
	<main>${await this.getContent()}</main> 
	${this.getFooter()}	
</body>
</html>`;
		},

		save: async function () {
			await writeFile(join(this.dir, this.slug), await this.getHtml());
		},
	},
);

for (const page of allPages(pages)) {
	await page.save();
}