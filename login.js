;
! function() {
    var $ = layui.$,
        form = layui.form;
    $(".uname,.upwd").focus(function(event) {
        $(this).css({
            "border-bottom": "1px solid #4F93FE"
        });
    }).blur(function(event) {
        $(this).css({
            "border-bottom": "1px solid #eee"
        });
    });
    // radio标签改变样式
    $("input[type='checkbox']").click(function() {
        var val = $("input[type='checkbox']:checked").val();
        console.log(val);
        if (val == "123") {
            $(".ddd").addClass("checked");
        } else {
            $(".ddd").removeClass("checked");
        }
    });
    // 登录
    $(".loginsubmit").click(function() {
        var username = $(".uname").val();
        var password = $(".upwd").val();
        console.log(username);
        console.log(password);
        $.ajax({
            type: "post",
            // dataType: "json",
            url: ' http://192.168.0.71:8080/user/login',
            data: { username: username, password: password },
            success: function(data) {
                alert("提交成功");
                console.log(data);
            },
            error: function() {
                alert("抱歉");
            }
        });
    });
    // form.on('submit(formDemo)', function(data) {
    //     console.log(data);
    // });
}();