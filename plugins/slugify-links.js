var extname = require('path').extname;
var async = require('async');
var cheerio = require('cheerio');
var slug = require('./rocketchat-slug.js');

module.exports = slugifyLinks;

function slugifyLinks(rootPath) {
	var self = this;
	return function(files, metalsmith, done) {
		async.each(Object.keys(files), function(file, cb) {
			if (extname(file) !== '.html') {
				return cb();
			}
			var data = files[file];
			var contents = data.contents.toString();
			var $ = cheerio.load(contents);

			$('a').each(function() {
				if (!$(this).attr('href').match(/(^https?:\/\/|\/\/)/)) {
					var old = decodeURIComponent($(this).attr('href'));

					if (old.match(/^[\.0-9a-zA-Z]+/)) {
						old = parseRelative(old, file);
					}

					var newHref = slug(old, null, true);

					if (old.match(/^\//)) {
						$(this).attr('href', rootPath+'/'+newHref.replace(/(^|\/)[0-9\-]+/g, '$1')+(old.match(/\/$/) ? '/' : ''));
					} else {
						$(this).attr('href', newHref.replace(/(^|\/)[0-9\-]+/g, '$1')+(old.match(/\/$/) ? '/' : ''));
					}
				}
			});

			data.contents = new Buffer($.html());
			cb();
		}, function() {
			done();
		});
	};
}

function parseRelative(link, file) {
	var fileParts = file.split('/');
	var linkParts = link.split('/');

	var parentCount;
	if (linkParts.indexOf('/') === -1) {
		parentCount = fileParts.length - 1;
	} else {
		parentCount = linkParts.length;
	}

	var relativeLink = [];

	for (var i = 0, total = linkParts.length; i < total; i++) {
		if (linkParts[i] === '..') {
			parentCount--;
		} else if (linkParts[i] !== '.') {
			relativeLink.push(linkParts[i]);
		}
	}

	return '/' + fileParts.slice(0, parentCount).join('/') + '/' + relativeLink.join('/');
}
