var async = require('async');
var slug = require('./rocketchat-slug.js');

slugifyFiles = function() {
	var self = this;
	return function(files, metalsmith, done) {
		async.each(Object.keys(files), function(file, cb) {
			var data = files[file];

			var slugPath = slug(file, data);

			data.originalName = file;

			delete files[file];
			files[slugPath] = data;

			cb();
		}, function() {
			done();
		});
	};
}

module.exports = slugifyFiles;
