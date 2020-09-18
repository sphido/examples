import {join} from "path";
import globby from "globby";
import {getPages} from "@sphido/core";
import frontmatter from "@sphido/frontmatter";
import meta from "@sphido/meta";
import {outputFile} from "fs-extra";
import {markdown} from "@sphido/markdown";
import feed from "@sphido/feed"

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
	await outputFile(
		join(__dirname, 'content', 'rss.xml'),
		feed(pages, {
				title: 'Untitled RSS',
				link: 'https://example.com/',
				description: 'This is basic rss example',
			},
			'https://example.com/rss.xml'
		)
	);

})();
