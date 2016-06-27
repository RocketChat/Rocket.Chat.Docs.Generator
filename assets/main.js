$(function() {
	var $link = $('.menu .active');

	// Scroll to the current active element in the sidebar/menu (make sure to subtract the 60 px of the navbar + 10 px of the padding => 70 px)
	if ($link.length > 0) {
		$('.sidebar').scrollTop($link.offset().top - 70);
	}
});

