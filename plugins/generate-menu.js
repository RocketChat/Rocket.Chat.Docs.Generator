var _ = require('underscore');
var slugifyPath = require('slugify-path').default;

function createTree(fileTree, items) {
	var item = items.splice(0, 1);

	if (items.length > 0) {

		if (!fileTree[item]) {
			fileTree[item] = {};
		}
		createTree(fileTree[item], items);
	} else {
		fileTree[item] = {};
	}
}

function createMenu(fileTree, initialItem, initialPath, level) {
	var folders = [];

	var linkClass;
	var levelClass = '';

	if (level > 1) {
		levelClass = ' level-' + level;
	}

	Object.keys(fileTree).forEach(function(item) {
		if (item === 'README.md' || (_.isEmpty(fileTree[item]) && !item.match(/\.md$/))) {
			return;
		}

		if (item.match(/\.md$/)) {
			linkClass = 'guide-sub-nav-item';
		} else {
			linkClass = 'guide-nav-item';
		}

		var title = item.replace(/^[0-9]+\. /, '').replace(/\.md$/, '');
		folders.push({
			label: title,
			sortTitle: initialItem + '-' + (item.match(/\.md$/) ? '' : item),
			link: initialPath + '/' + slugifyPath(title),
			class: linkClass + levelClass
		});

		folders = folders.concat(createMenu(fileTree[item], initialItem + '-' + item, initialPath + '/' + slugifyPath(title), level + 1));
	});

	return folders;
}

function generateMenu() {
	return function(files, metalsmith, done) {
		var fileTree = {};

		Object.keys(files).forEach(function(file) {
			var data = files[file];

			var fileParts = data.originalName.split('/');
			var totalParts = fileParts.length;

			createTree(fileTree, fileParts);
		});

		var folders = createMenu(fileTree, '', '', 1);

		var newFolders = _.sortBy(folders, 'sortTitle');
		for (var file in files) {
			files[file].path = '/' + file.substr(0, file.lastIndexOf('/')).replace(/^[0-9]+\. /, '');
			files[file].mainNav = newFolders;
		}

		done();
	}
}

module.exports = generateMenu;

