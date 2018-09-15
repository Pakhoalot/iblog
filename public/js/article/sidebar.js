$('.sidebar').affix({
    offset: {
      top: function(){
        return (this.top = 70+$(".article-title").outerHeight(true) + $(".navbar.navbar-fix-top").outerHeight(true));
      },
      bottom: function(){
        return $(this).hasClass("affix") ? 0: (this.bottom = 40);
    },
    }
})