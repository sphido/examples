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
			page => {
				page.author = 'John Appleseed';
				page.title += ' | add this all titles';
				page.toFile = join(page.dir.replace('content', 'public'), page.slug + '.html',)
			},

			// add custom page function
			{
				footer: function () {
					return `<footer>${this.author}</footer>`
				},

				head: function () {
					return `<head><meta charset="UTF-8"><title>${this.title}</title></head>`
				},

				body: function () {
					return `<body>${this.content}</body>`
				},

				getHtml: function () {
					return `<!DOCTYPE html><html lang="en" dir="ltr">${this.head()}${this.body()}${this.footer()}</html>`
				}
			}
		],
	);

	// 2. save pages

	pages.forEach(page => outputFile(page.toFile, page.getHtml()))

})();
