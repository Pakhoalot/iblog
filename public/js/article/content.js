$(document).ready(function(){
    $(".article-content img").addClass('img-responsive');
    //渲染代码块
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

});