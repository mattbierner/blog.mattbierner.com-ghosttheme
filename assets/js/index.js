/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        // On the home page, move the blog icon inside the header 
        // for better relative/absolute positioning.

        //$("#blog-logo").prependTo("#site-head-content");
        
        // Add caption to imgs
        // https://ghost.org/forum/using-ghost/2797-image-captions/
        $(".post-content img").each(function() {
            if ($(this).attr("alt"))
              $(this)
                  .wrap('<figure class="image"></figure>')
                  .after('<figcaption>' + $(this).attr("alt") + '</figcaption>');
        });
    });

}(jQuery));