#!/usr/bin/env node

const {join} = require('path');
const globby = require('globby');
const Sphido = require('packages/sphido-core/src');
const extenders = require('packages/sphido-extenders/src');

(async () => {
	// 1. Get list of pages...
	const pages = await Sphido.getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...extenders
	);

	// 2. Save pages... (with default HTML template)
	for await (const [page] of pages) {
		await page.save(
			page.dir.replace('content', 'public')
		);
	}
})();
