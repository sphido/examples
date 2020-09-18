import {join} from "path";
import globby from "globby";
import {getPages} from "@sphido/core";
import frontmatter from "@sphido/frontmatter";
import meta from "@sphido/meta";
import {outputFile} from "fs-extra";
import {markdown} from "@sphido/markdown";
import sitemap from "@sphido/sitemap"

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
	await outputFile(
		join(__dirname, 'content', 'sitemap.xml'),
		sitemap(pages, 'https://example.com')
	);


})();

