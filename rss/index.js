#!/usr/bin/env node

const {join} = require('path');
const {outputFile} = require('fs-extra');
const {statSync} = require('fs');
const {inspect} = require('util');

const globby = require('globby');
const {getPages} = require('@sphido/core');
const feed = require('@sphido/feed');


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


	// 3. Save rss.xml
	await outputFile(
		join(__dirname, 'content', 'sitemap.xml'),
		feed(pages, 'https://example.com')
	);


})();
