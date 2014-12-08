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
        
        SetupLinks();
        
        SetupToc();
        
        SetupPagination();
    });

}(jQuery));


/**
 * Create pagination links
 * 
 * From: https://gist.github.com/jyek/5141bc6166b01419d43f
 * 
 * Fuck Ghost, making us have to parse RSS client side.
 */
var SetupPagination = function() {
    var NextPrevLinksModule = function(){
    var curr,
        $prevLink,
        $nextLink;
 
    return {
      init: function(){
        curr = $('#curr-post-uuid').html();
        $prevLink = $('.prev-post');
        $nextLink = $('.next-post');
 
        $prevLink.hide();
        $nextLink.hide();
 
        this.parseRss();
      },
      // creates previous and next links
      createLinks: function(items){
        for (var i = 0; i < items.length; i++){
          var uuid = $(items[i]).find('guid').text();
          if (uuid === curr){
            if (i < items.length-1){
              $prevLink
                .attr('href', $(items[i+1]).find('link').text())
                .attr('title', $(items[i+1]).find('title').text());
              $prevLink.show(); 
            }
            if (i > 0){
              $nextLink
                .attr('href', $(items[i-1]).find('link').text())
                .attr('title', $(items[i-1]).find('title').text());;
              $nextLink.show();
            }
          }
        }
      },
      // iteratively parses rss feeds to generate posts object
      parseRss: function(page, items, lastId){
        self = this;
        page = page || 1;
        items = items || undefined;
        lastId = lastId || '';
        $.get('/rss/' + page, function(data){
          var posts = $(data).find('item');
          var currId;
          if (posts.length > 0) currId = $(posts[0]).find('guid').text();
 
          if (currId === lastId){
            // if this page has already been parsed, create links
            self.createLinks(items);
          } else {
            // if not, continue parsing posts
            items = items ? items.add(posts) : posts;
            lastId = currId;
            self.parseRss(page+1, items, lastId);
          }
        });
      }
    };
  }();
 
  NextPrevLinksModule.init();
};

var SetupLinks = function() {
    $('.post-content h2, .post-content h3')
        .html(function(i, current) {
            return $('<a href=#' + $(this).attr('id') +'>' + current + '</a>')
        });
};

/**
 * Render the table of contents.
 * 
 * Seriously Ghost WTF!
 */
var SetupToc = function() {
  $('.post-content').prepend($("<nav class='toc'></nav>"));
    
    $('.toc').toc({
        container: '.post-content',
        'smoothScrolling': false
    });
    
   $(window).scroll(function() {
           
       var headerH = $('.post-content').offset().top; console.log(headerH);
       var scrollVal = $(this).scrollTop();
       $('.toc').css({'position': scrollVal > headerH ? 'fixed' : 'static', 'top' :'0'});
    });
};