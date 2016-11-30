$(document).ready(function() {
	var path = window.location.pathname;

	//Find the current active page and set it active, then scroll to it
	$('.sidebar li a').each(function() {
		var href = this.href;
		if (_endsWith(href, path)) {
			$(this).parent().addClass('active');
			$('.sidebar').scrollTop($(this).offset().top - 68);
		}
	});

	//Register the click on the first load, each additional pages will call the function theirselves
	_registerAnchorClick();
});

$('.sidebar li a').on('click', function(e) {
	$('.sidebar li.active').each(function() {
		$(this).removeClass('active');
	});

	$('base').attr('href', $(this).attr('href'));
	$(this).parent().addClass('active');
});

function _endsWith(item, suffix) {
	return item.indexOf(suffix, item.length - suffix.length) !== -1;
}

function _registerAnchorClick() {
	$('#content article a').on('click', function(e) {
		var goingToHref = $(this).attr('href');
		console.log('goingToHref');

		//Remove all currently active classes
		$('.sidebar li.active').each(function() {
			$(this).removeClass('active');
		});

		//Find the list item anchor that matches where they're going 
		$('.sidebar li a').each(function() {
			if($(this).attr('href') === goingToHref) {
				$(this).parent().addClass('active');
			}
		});


		$('base').attr('href', goingToHref);
	});
};
