$('.sidebar').affix({
    offset: {
      top: function(){
        return (this.top = 20+$(".article-title").outerHeight(true) + $(".navbar.navbar-fix-top").outerHeight(true));
      },
    }
})