$(document).ready(function () {
  //加载markdown编辑器
  var simplemde = new SimpleMDE({
    autofocus: true,
    autoDownloadFontAwesome: true,
    spellChecker: false,
    placeholder: 'Enjoy Writing!'
  });
  //默认双屏
  simplemde.toggleSideBySide();
  //隐藏全屏按钮
  $(".fa.fa-arrows-alt").hide();
  //调整title输入框
  let $inputTitle = $("#input-title");
  $inputTitle.width(($inputTitle.val().length + 5) * 16 + 'px');
  $inputTitle.keyup(function (e) {
    let $this = $(this);
    $this.width(($this.val().length + 5) * 18 + 'px');

  });
  $(window).resize(function () {
    $inputTitle.css('max-width', $(window).width() - 300 + 'px');
  });
  //处理publish逻辑
  let $btnPublish = $("#btn-publish");
  let $modalDailog = $("#modal-frame");
  $btnPublish.click(function (e) {
    let $modalMessage = $('#modal-message');
    let $labelFrame = $modalDailog.find(".label-frame");
    e.preventDefault();
    if (!$inputTitle.val()) {
      $modalMessage.text("title and article required.");
      $labelFrame.hide();
      $modalDailog.modal();
    } else {
      //可上传
      //弹出codal
      $modalMessage.text("You are almost here.");
      $modalDailog.find(".label-frame").show();
      $modalDailog.modal();
    }
  });

  //准备上传
  $("#submit-btn").on('click', function (e) {
    e.preventDefault();
    console.log("in");
    
    //加锁,防止多次点击    
    $("#submit-btn").attr('disabled',"true");
    let $labels = $("#input-labels");
    let $category = $("#input-category");
    //var $simplemde has been declared;
    //$inputTitle has been declared;
    //发送ajax请求
    $.post("/api/post/create", {
        Title: $inputTitle.val(),
        Content: simplemde.value(),
        ContentType: "markdown",
        CategoryAlias: $category.val() || 'other',
        Labels: $labels.val(),
        IsDraft: false,
        IsActive: true,
      }
    )
    .success(function(){
        alert('success!');
        $("#submit-btn").attr('disabled',"false");  
    })
    return;
  });




});
