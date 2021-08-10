import path from "path";
import {fileURLToPath} from 'url'
import fs from "fs-extra";
import {globby} from "globby";

import {getPages} from "@sphido/core";
import {frontmatter} from "@sphido/frontmatter";
import {meta} from "@sphido/meta";
import {markdown} from "@sphido/markdown";
import {feed} from "@sphido/feed"

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
			page.author = 'roman@omdesign.cz'
		}
	);

	// 2. Save rss.xml
	await fs.outputFile(
		path.join(__dirname, 'content', 'rss.xml'),
		feed(pages, {
				title: 'Untitled RSS',
				link: 'https://example.com/',
				description: 'This is basic rss example',
			},
			'https://example.com/rss.xml'
		)
	);

})();
