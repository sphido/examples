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
			page.author = 'roman@omdesign.cz'
		}
	);

	// 2. Save rss.xml
	await outputFile(
		join(__dirname, 'content', 'rss.xml'),
		feed(pages, {
				title: 'Untitled RSS',
				link: 'https://example.com/',
				description: 'This is basic rss example',
			},
			'https://example.com/rss.xml'
		)
	);

})();
