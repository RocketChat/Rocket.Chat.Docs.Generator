var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var each = require('metalsmith-each');
var assets = require('metalsmith-assets');
var parseGitHubLinks = require('./plugins/parse-github-links.js');
var generateMenu = require('./plugins/generate-menu.js');
var slugifyFiles = require('./plugins/slugify-files.js');
var slugifyLinks = require('./plugins/slugify-links.js');
var hljs = require("highlight.js");
var slug = require('metalsmith-slug');
var ignore = require('metalsmith-ignore');
var headingsidentifier = require("metalsmith-headings-identifier");
var markdown = require('metalsmith-markdown');
var drafts = require('metalsmith-drafts');
var Handlebars = require('handlebars');

var rootDir = '';
if (process.argv[2]) {
	rootDir = process.argv[2];
}

Handlebars.registerHelper('equal', function(v1, v2, options) {
	if (v1 != v2) {
		return options.inverse(this);
	} else {
		return options.fn(this);
	}
});

Metalsmith(__dirname)
	.metadata({
		title: "Rocket.Chat Docs",
		description: "Rocket.Chat Docs",
		generator: "Metalsmith",
		url: "http://www.metalsmith.io/"
	})
	.source('./src')
	.destination('./build' + rootDir)
	.clean(true)
	.use(ignore([
		'.git/**/*',
		'.git*',
		'.travis/**/*',
		'.travis*'
	]))
	.use(drafts())
	.use(parseGitHubLinks())
	.use(slugifyFiles())
	.use(generateMenu(rootDir))
	.use(markdown({
		smartypants: true,
		gfm: true,
		tables: true,
		highlight: function(str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(lang, str).value;
				} catch (__) {}
			}

			return str; // use external default escaping
		}
	}))
	.use(function(files, metalsmith, done) {
		Object.keys(files).forEach(function(file) {
			var data = files[file];

			data.rootPath = rootDir;
		});
		done();
	})
	.use(layouts({
		engine: 'handlebars',
		default: 'layout.html',
		partials: 'layouts/partials'
	}))
	.use(slugifyLinks(rootDir))
	.use(headingsidentifier({
		linkTemplate: '<a class="header-link" href="#%s"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>'
	}))
	.use(assets({
		source: './assets', // relative to the working directory
		destination: './assets' // relative to the build directory
	}))
	.build(function(err, files) {
		if (err) {
			throw err;
		}
	});

