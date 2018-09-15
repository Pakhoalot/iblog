$(document).ready(function(){
//   var $wrapper = $(".wrapper");
//   let color = ['red', 'yellow', 'green', 'purple', 'pink'];
//   let i = 0;
//   setInterval(function () {
//     $wrapper.css('box-shadow', `0px 0px 40px -5px ${color[(i++)%color.length]}`);
//   }, 2000);
    let md5 = SparkMD5.hash;
    let $usernameInput = $("#username-input");
    let $passwordInput = $("#password-input");
    $("#login-form").submit(function (e) { 
        // e.preventDefault();
        $passwordInput.val(md5($passwordInput.val()));
    });

    let $modalOnlyMessage = $("#modal-only-message");
    let $messageTmp = $('.message-tmp');
    if($messageTmp.text()){
        $modalOnlyMessage.find(".modal-title").text($messageTmp.text());
        $modalOnlyMessage.modal("show");
    }
    
});
