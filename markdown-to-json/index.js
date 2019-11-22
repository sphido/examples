#!/usr/bin/env node

const {join} = require('path');
const {outputFile} = require('fs-extra');
const {getPages} = require('@sphido/core');
const globby = require('globby');


(async () => {
	// 1. Get list of pages...
	const pages = await getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta')
		]
	);

	// 2. Save pages... (with default HTML template)
	for await (const page of pages) {
		await outputFile(
			join(page.dir, page.slug + '.json'),
			JSON.stringify(page, null, 2)
		);

	}
})();
