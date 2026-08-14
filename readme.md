# Sphido examples

Here are some examples of how to use [Sphido](https://sphido.org/), a rocket 🚀 fast, 
💭 light-weight and flexible static site 🤖 generator.

## [Basic usage](https://github.com/sphido/examples/tree/main/basic)

This example shows how to use Sphido for processing Markdown files to HTML with the
[`@sphido/markdown`](https://github.com/sphido/sphido/tree/main/packages/sphido-markdown) extender.

## [Extenders](https://github.com/sphido/examples/tree/main/extenders)

Every page can be enriched with other properties or
functions - this example shows how to use **custom extenders**.

## [JSON](https://github.com/sphido/examples/tree/main/json)

JSON from Markdown can be handy. This example shows how to
generate JSON files based on Markdown files using Sphido.

## [Incremental builds](https://github.com/sphido/examples/tree/main/cache)

Rebuilds should cost what changed, not what the site contains. This example
uses **`@sphido/cache`** to skip untouched pages — run it twice and the second
run writes nothing.

## [sitemap.xml](https://github.com/sphido/examples/tree/main/sitemap)

Sitemaps are an easy way for webmasters to inform search engines about 
pages on their sites that are available for crawling. This example shows
how to generate them.

## [RSS](https://github.com/sphido/examples/tree/main/rss)

This example shows how to generate an RSS feed from pages.