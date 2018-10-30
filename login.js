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
        $.ajax({
            type: "post",
            dataType: "jsonp",
            jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            url: ' http://192.168.0.71:8080/user/login',
            data: { username: username, password: password },
            success: function() {
                alert("提交成功");
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