var simplemde;
$(document).ready(function () {
  //加载markdown编辑器
  simplemde = new SimpleMDE({
    autofocus: true,
    autoDownloadFontAwesome: true,
    spellChecker: false,
    placeholder: 'Enjoy Writing!'
  });
  //默认双屏
  simplemde.toggleSideBySide();
  //加载post.content(如果有)
  simplemde.value($('.tmp-content').text());
  $('.tmp-content').text('');
  //隐藏全屏按钮
  $(".fa.fa-arrows-alt").hide();
  //调整title输入框
  let $inputTitle = $("#input-title");
  inputTitleResize($inputTitle);
  //加载publish逻辑
  publishPrepare(simplemde, $inputTitle);
  //加载图片按钮逻辑
  drawImage();
});


/* *****************分块处理***************************************** */


/**
 *对edit页面中的inputTitle大小进行resize
 *
 */
function inputTitleResize($inputTitle) {
  $inputTitle.width(($inputTitle.val().length + 5) * 16 + 'px');
  $inputTitle.keyup(function (e) {
    let $this = $(this);
    $this.width(($this.val().length + 5) * 18 + 'px');

  });
  $(window).resize(function () {
    $inputTitle.css('max-width', $(window).width() - 300 + 'px');
  });
}


/**
 *处理publish逻辑
 *
 */
function publishPrepare(simplemde, $inputTitle) {
  let $btnPublish = $("#btn-publish");
  let $modalDailog = $("#modal-frame");
  let $modalMessage = $('#modal-message');
  let $labelFramePublish = $(".label-frame.publish");
  $btnPublish.click(function (e) {
    e.preventDefault();
    if (!$inputTitle.val()) {
      $modalMessage.text("title and article required.");
      $labelFramePublish.hide();
      $modalDailog.modal();
    } else {
      //可上传
      //弹出modal
      $modalMessage.text("You are almost here.");
      $labelFramePublish.show();
      $modalDailog.modal();
    }
  });
  let $labels = $("#input-labels");
  let $category = $("#input-category");
  //准备上传
  $("#submit-btn").on('click', function (e) {
    e.preventDefault();

    //加锁,防止多次点击    
    $("#submit-btn").attr('disabled', "true");

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
      })
      .success(function () {
        alert('success!');
        $("#submit-btn").removeAttr("disabled");
        $modalDailog.modal("hide");

      })
    return;
  });
}

/**
 *重新绑定DrawImage:click,发起图片上传处理
 *
 */
function drawImage() {
  //解绑所有绑定在按钮上的event
  document.getElementsByClassName("fa-picture-o")[0].onclick = null;
  let $drawImage = $(".fa-picture-o");
  let $modalDailogUpload = $('#modal-frame-upload');
  let $modalMessageUpload = $("#modal-message-upload");
  let $fileBroswer = $(".file-browser");
  let $fileNameText = $(".file-name-text");
  let $uploadFile = $("#upload-file");
  let $uploadBtn = $("#upload-btn");

  //新btn模拟click file-upload
  $fileBroswer.click(function () {
    $uploadFile.click();
  });
  //当file发生变化,取名字到text
  $uploadFile.change(function () {
    if ($uploadFile.prop("files")[0]) {
      $fileNameText.val($uploadFile.prop("files")[0].name);
    }
  })

  //重绑定drawImage图标逻辑,弹出modal
  $drawImage.click(function (e) {
    e.preventDefault();
    $modalMessageUpload.text("Upload image.")
    $modalDailogUpload.modal();
  })

  $uploadBtn.click(function (e) {
    e.preventDefault();
    let file = $uploadFile.prop("files")[0] || null;
    if (!file) return;
    else {
      //禁止点击upload,锁
      $uploadBtn.attr('disabled', "true");
      $fileBroswer.attr('disabled', "true");
      let data = new FormData();
      data.append('file', file)
      $.ajax({
        type: "POST",
        url: "/upload",
        data: data,
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {    
          $modalDailogUpload.modal("hide");
          //添加字段到文档中
          console.log(response);
          let path = response.path;
          if(path){
            path = `![](${window.origin}${path})`;
            simplemde.value(simplemde.value() + path );
          } 
          
        },
        error: function (response) {
          alert('error');
          
        },
        complete: function () {
          //当失败或成功时
          //解锁
          $uploadBtn.removeAttr("disabled");
          $fileBroswer.removeAttr("disabled");
          $uploadFile.val('');
          $fileNameText.val('');
          
        }

      });
    }
  });
}
