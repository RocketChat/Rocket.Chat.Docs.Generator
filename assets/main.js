$(document).ready(function() {
	setActiveMenu(window.location.pathname, false);

	var app = new senna.App();
	app.setBasePath('/docs');
	app.addSurfaces('content');
	app.addRoutes(new senna.Route(/.*/, senna.HtmlScreen));

	app.on('startNavigate', function(event) {
		setActiveMenu(event.path, true);
	});

	app.on('endNavigate', function(event) {
		scrollContent(event.path);
	});
});

function scrollContent(path) {
	var hashPosition = path.indexOf('#');

	if (hashPosition !== -1) {
		location.hash = path.substr(hashPosition);
	} else {
		$('#content').scrollTop(0);
	}
}

function _endsWith(item, suffix) {
	return item.indexOf(suffix, item.length - suffix.length) !== -1;
}

function _registerAnchorClick() {
	$('#content article a').on('click', function(e) {
		var goingToHref = $(this).attr('href');

		//Remove all currently active classes
		$('.sidebar li.active').each(function() {
			$(this).removeClass('active');
		});
	});
};

function setActiveMenu(path, animate) {
	var hashPosition = path.indexOf('#');

	if (hashPosition !== -1) {
		path = path.substr(0, hashPosition);
	}

	$('.sidebar li.active').removeClass('active');

	//Find the current active page and set it active, then scroll to it
	$('.sidebar li a').each(function() {
		var href = this.href;
		// if (_endsWith(href, path)) {
		if (_endsWith(href, path) || _endsWith(href, path + '/')) {
			$(this).parent().addClass('active');

			if (!isElementInViewport($(this).parent())) {
				var position = $('.sidebar').scrollTop() + $(this).offset().top - 68;
				if (animate) {
					$('.sidebar').stop().animate({ scrollTop: position }, 500);
				} else {
					$('.sidebar').scrollTop(position);
				}
			}
		}
	});
}

function isElementInViewport(el) {

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	var rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
}

