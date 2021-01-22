import fs from "fs-extra";
import path from 'path';
import globby from "globby";
import {getPages} from "@sphido/core";

import {fileURLToPath} from 'url'
import {frontmatter} from "@sphido/frontmatter";
import {meta} from "@sphido/meta";
import {markdown} from "@sphido/markdown";
import {sitemap} from "@sphido/sitemap"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {

	// 1. Get pages from directory
	const pages = await getPages(
		await globby('content/**/*.{md,html}'),
		...[
			frontmatter,
			markdown,
			meta
		],
		page => {
			page.link = 'https://example.com/example/' + page.base;
		}
	);

	// 2. Save sitemap.xml
	await fs.outputFile(
		path.join(__dirname, 'content', 'sitemap.xml'),
		sitemap(pages, 'https://example.com')
	);

})();

