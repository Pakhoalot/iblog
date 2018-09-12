$('.index-sidebar').affix({
    offset: {
      top: function(){
        return (this.top = 40 + $(".navbar.navbar-fix-top").outerHeight(true));
      },
      bottom: function(){
          return (this.bottom = 40)
      },
    }
})

