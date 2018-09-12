$(document).ready(function () {
    //加载markdown编辑器
    var simplemde = new SimpleMDE({
        autofocus: true,
        autoDownloadFontAwesome: true,  
        spellChecker: false,
        placeholder: 'Enjoy Writing!'
    });
    simplemde.toggleSideBySide();
    
    let inputTitle = $("#input-title");
    inputTitle.width((inputTitle.val().length+5)*16+'px');
    $("#input-title").keyup(function (e) { 
        let $this = $(this);
        console.log($this.val());
        
        $this.width(($this.val().length+5)*18 + 'px');
    });

    //处理publish逻辑
    let $btnPublish = $("#btn-publish");
    $btnPublish.click(function (e) { 
        e.preventDefault();
        if(!inputTitle.val()) {
            
        }
    });
    
});

