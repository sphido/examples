#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';
import {frontmatter} from '@sphido/frontmatter';

const pages = await getPages({path: 'content'}, frontmatter);

for (const page of allPages(pages)) {
	page.slug = slugify(page.name) + '.json';
	const output = join('public', relative('content', dirname(page.path)), page.slug);
	page.content = marked(page.content);

	// save JSON file
	await writeFile(output, JSON.stringify(page));
}