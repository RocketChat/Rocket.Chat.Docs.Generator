var _ = require('underscore');
var slugifyPath = require('slugify-path').default;
var path = require('path');

function createTree(fileTree, items, order) {
	var item = items.splice(0, 1);

	if (items.length > 0) {
		if (!fileTree[item]) {
			fileTree[item] = {
				order: order,
				children: {}
			};
		}
		createTree(fileTree[item].children, items, order);
	} else {
		fileTree[item] = {
			order: order,
			children: {}
		};
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
		if (item === 'README.md' || (_.isEmpty(fileTree[item].children) && !item.match(/\.md$/))) {
			return;
		}

		if (item.match(/\.md$/)) {
			linkClass = 'guide-sub-nav-item';
		} else {
			linkClass = 'guide-nav-item';
		}

		var order = item.match(/^([0-9]+)\. /);
		var defaultSort = '0';
		if (order) {
			defaultSort = order[1];
		}
		var itemOrder = (fileTree[item].order || defaultSort);
		itemOrder = ('000000' + itemOrder).substr(-6);

		var title = item.replace(/^[0-9]+\. /, '').replace(/\.md$/, '');
		folders.push({
			label: title,
			sortTitle: initialItem + '-' + (item.match(/\.md$/) ? '' : itemOrder + '+' + item),
			link: initialPath + '/' + slugifyPath(title) + (item.match(/\.md$/) ? '' : '/'),
			class: linkClass + levelClass
		});

		folders = folders.concat(createMenu(fileTree[item].children, initialItem + '-' + (item.match(/\.md$/) ? '' : itemOrder + '+' + item), initialPath + '/' + slugifyPath(title), level + 1));
	});

	return folders;
}

function generateMenu() {
	return function(files, metalsmith, done) {
		var fileTree = {};

		Object.keys(files).forEach(function(file) {
			var data = files[file];
			var fileParts = data.originalName.split(path.sep);
			var totalParts = fileParts.length;

			createTree(fileTree, fileParts, data.order || null);
		});

		var folders = createMenu(fileTree, '', '', 1);

		var newFolders = _.sortBy(folders, 'sortTitle');
		for (var file in files) {
			files[file].path = '/' + file.replace(/(\/[^/]+)\.md/, '$1').replace(/\/index$/, '/');
			files[file].mainNav = newFolders;
		}

		done();
	}
}

module.exports = generateMenu;

