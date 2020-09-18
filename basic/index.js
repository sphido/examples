import {join} from "path";
import globby from "globby";
import {getPages} from "@sphido/core";
import frontmatter from "@sphido/frontmatter";
import meta from "@sphido/meta";
import {outputFile} from "fs-extra";
import {markdown} from "@sphido/markdown";

(async () => {

	// 1. get list of pages

	const pages = await getPages(
		await globby('content/**/*.{md,html}'),
		...[

			frontmatter,
			markdown,
			meta,

			// add custom page extender
			(page) => {
				page.toFile = join(
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
		],
	);

	// 2. save pages

	pages.forEach(page => outputFile(page.toFile, page.getHtml()))

})();