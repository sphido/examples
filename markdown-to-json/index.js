import fs from "fs-extra";
import path from "path";
import globby from "globby";
import {getPages} from "@sphido/core";
import {frontmatter} from "@sphido/frontmatter";
import {meta} from "@sphido/meta";
import {markdown} from "@sphido/markdown";

(async () => {

	// 1. get list of pages

	const pages = await getPages(
		await globby('content/**/*.{md,html}'),
		...[
			frontmatter,
			markdown,
			meta,
			{
				getJson: function () {
					return JSON.stringify(this, (key, value) => value instanceof Set ? [...value] : value, 2)
				}
			}
		],
	);

	// 2. save pages

	for (const page of pages) {
		await fs.outputFile(path.join(page.dir, page.slug + '.json'), page.getJson());
	}

})();
