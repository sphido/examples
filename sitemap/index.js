#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {createSitemap} from '@sphido/sitemap';

const pages = await getPages({path: 'content'});
const map = await createSitemap('public/sitemap.xml');

for (const page of await allPages(pages)) {
	page.slug = join('/', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	page.url = new URL(page.slug, 'https://sphido.org/').toString();
	page.changefreq = 'daily';
	page.date = new Date();
	page.priority = page.name === 'index' ? 1 : 0.8;

	// you should save pages here...

	map.add(page);
}

map.end();