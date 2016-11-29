$(document).ready(function() {
	var path = window.location.pathname.replace(/\/\s*$/, '');

	//Find the current active page and set it active, then scroll to it
	$('.sidebar li a').each(function() {
		var href = this.href;
		if (_endsWith(href, path)) {
			$(this).parent().addClass('active');
			$('.sidebar').scrollTop($(this).offset().top - 68);
		}
	});
});

$('.sidebar li a').on('click', function(e) {
	$('.sidebar li.active').each(function() {
		$(this).removeClass('active');
	});

	$(this).parent().addClass('active');
});

function _endsWith(item, suffix) {
	return item.indexOf(suffix, item.length - suffix.length) !== -1;
}
