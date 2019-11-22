#!/usr/bin/env node

const {join} = require('path');
const globby = require('globby');
const {getPages} = require('@sphido/core');
const {save} = require('@sphido/nunjucks');

(async () => {
	// 1. Get list of pages...
	const pages = await getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
			{save},
		],
	);

	// 2. save them (with default template)
	for await (const page of pages) {
		await page.save(
			page.dir.replace('content', 'public')
		);
	}

})();
