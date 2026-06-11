#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {pagesToSitemap, writeSitemap} from '@sphido/sitemap';

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.slug = join('/', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	page.url = new URL(page.slug, 'https://sphido.org/').toString();
	page.priority = page.name === 'index' ? 1 : 0.8;

	// you should save pages here...
}

// map pages to sitemap XML (defaults apply to every entry)
const xml = pagesToSitemap(pages, {
	baseUrl: 'https://sphido.org/',
	defaults: {changefreq: 'daily', lastmod: new Date()},
});

await writeSitemap('public/sitemap.xml', xml);
