module.exports = parseGitHubLinks;

function parseGitHubLinks() {
	return function(files, metalsmith, done) {
		Object.keys(files).forEach(function(file) {
			var data = files[file];

			data.githubPath = 'https://github.com/RocketChat/Rocket.Chat.Docs/blob/master/' + file;
		});
		done();
	}
}
