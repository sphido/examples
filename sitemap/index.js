#!/usr/bin/env node

const {join} = require('path');
const {outputFile} = require('fs-extra');
const {statSync} = require('fs');
const {inspect} = require('util');

const globby = require('globby');
const {getPages} = require('../../packages/sphido-core');
const SphidoSitemap = require('../../packages/sphido-sitemap');

const SphidoExtenders = [
	require('../../packages/sphido-frontmatter'),
	require('../../packages/sphido-marked'),
	page => {
		page.link = 'https://example.com/example/' + page.base;
		page.date = new Date(inspect(statSync(page.file).mtime));
	}
];

(async () => {

	// 1. Get pages from directory
	const pages = await getPages(await globby(join(__dirname, '/content/**/*.{md,html}')), ...SphidoExtenders);

	// 2. Save sitemap.xml
	await outputFile(
		join(__dirname, 'public', 'sitemap.xml'),
		SphidoSitemap(pages, 'https://example.com')
	);

})();
