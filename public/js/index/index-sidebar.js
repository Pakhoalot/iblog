$('.index-sidebar').affix({
    offset: {
      top: function(){
        return (this.top = 40 + $(".navbar.navbar-fix-top").outerHeight(true));
      },
      bottom: function(){
          return $(this).hasClass("affix-top") ? 0: (this.bottom = 40);
      },
    }
})

