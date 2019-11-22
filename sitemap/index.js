#!/usr/bin/env node

const {join} = require('path');
const {outputFile} = require('fs-extra');

const globby = require('globby');
const {getPages} = require('@sphido/core');
const sitemap = require('@sphido/sitemap');

(async () => {

	// 1. Get pages from directory
	const pages = await getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta')

		],
		page => {
			page.link = 'https://example.com/example/' + page.base;
		}
	);

	// 2. Save sitemap.xml
	await outputFile(
		join(__dirname, 'content', 'sitemap.xml'),
		sitemap(pages, 'https://example.com')
	);

})();
