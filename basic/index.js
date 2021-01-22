import globby from "globby";
import fs from "fs-extra";
import path from "path";

import {getPages} from "@sphido/core";
import {frontmatter} from "@sphido/frontmatter";
import {meta} from "@sphido/meta";
import {markdown} from "@sphido/markdown";

(async () => {

	// 1. prepare list of pages

	const pages = await getPages(
		await globby('content/**/*.{md,html}'),
		frontmatter,
		markdown,
		meta,

		// add custom page extender
		(page) => {
			page.toFile = path.join(
				page.dir.replace('content', 'public'),
				page.slug,
				'index.html'
			);
		},

		// add custom page function
		{
			getHtml: function () {
				return `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><title>${this.title}</title></head><body>${this.content}</body></html>`
			}
		}
	);

	// 2. save pages

	for (const page of pages) {
		await fs.outputFile(page.toFile, page.getHtml());
	}

})()