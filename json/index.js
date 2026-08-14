#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {frontmatter} from '@sphido/frontmatter';
import {markdown} from '@sphido/markdown';

const pages = await getPages({path: 'content'}, frontmatter, markdown());

for (const page of allPages(pages)) {
	page.slug = slugify(page.name) + '.json';
	const output = join('public', relative('content', dirname(page.path)), page.slug);

	// save JSON file with the rendered HTML in page.content
	await writeFile(output, JSON.stringify(page));
}