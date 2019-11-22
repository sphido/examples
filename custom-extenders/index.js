#!/usr/bin/env node

const {join} = require('path');
const globby = require('globby');
const {outputFile} = require('fs-extra');
const {getPages} = require('@sphido/core');

(async () => {
	// 1. Get list of pages...
	const pages = await getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
		],
		page => {
			page.author = 'John Appleseed';
			page.title += ' | add this all titles';
		},
		{
			customFunction() {
				return '// call custom function on ' + this.base + this.ext;
			}
		}
	);

	// 2. Save page to HTML
	for await (const page of pages) {
		await outputFile(
			join(page.dir.replace('content', 'public'), page.slug + '.html'),
			`<!DOCTYPE html>/n<html lang="cs" dir="ltr">/n<head>/n<meta charset="UTF-8">/n` +
			`<title>${page.title}</title>/n` +
			`</head>/n<body>/n` +
			`<article>/n` +
			`<h1>${page.title}</h1>/n` +

			// author
			`<strong>Author: ${page.author}</strong>/n` +
			`${page.content}` +

			// call custom function
			`<pre>${page.customFunction()}</pre>/n` +
			`</article>/n` +
			`</body>/n</html>/n`
		);
	}

})();
