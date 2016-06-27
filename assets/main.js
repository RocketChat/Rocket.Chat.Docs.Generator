$(function() {
  var slug = window.location.pathname,
      slug = slug.replace(/\/$/, ""),
      $link = $('a[href="' + slug + '"]');

  // Scroll to the current active element in the sidebar/menu (make sure to subtract the 60 px of the navbar + 10 px of the padding => 70 px)
  $('.sidebar').scrollTop( $link.offset().top - 70 );
});
