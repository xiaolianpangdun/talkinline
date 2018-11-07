;
! function() {
    var $ = layui.$,
        form = layui.form;
    var name = window.localStorage.getItem("tkilname");
    var upwd = window.localStorage.getItem("tkilupwd");
    if (name)
        $(".uname").val(name);
    $(".upwd").val(upwd);
    if (upwd) {
        $("#color-cb").prop("checked", true);
        $(".ddd").addClass("checked");
    }
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
        if (val == "1") {
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
            contentType: "application/json;charset=utf-8",
            // dataType: "json",
            url: ' http://192.168.0.71:8080/user/login',
            data: JSON.stringify({ username: username, password: password }),
            success: function(data) {
                // alert("提交成功");
                if (data.code == "200") {
                    layer.msg("登录成功");
                    var val = $("input[type='checkbox']:checked").val();
                    if (val == "1") {
                        window.localStorage.setItem("tkilname", username);
                        window.localStorage.setItem("tkilupwd", password);
                    } else {
                        window.localStorage.setItem("tkilname", username);
                        window.localStorage.setItem("tkilupwd", "");
                    }
                    window.localStorage.setItem("isLogin", true);
                    window.location.href = "./one/index.html";
                } else {
                    layer.msg("用户名或密码错误");
                }
                // console.log(data);
            },
            error: function() {
                layer.msg("服务器繁忙，请稍后再试");
            }
        });
    });
    // form.on('submit(formDemo)', function(data) {
    //     console.log(data);
    // });
}();