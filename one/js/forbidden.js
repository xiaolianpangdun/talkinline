;
! function() {
    // 分页器
    var laypage = layui.laypage,
        layer = layui.layer,
        $ = layui.$;
    // $(".content").bind('input propertychange', function() {
    //     console.log($(this).val().length);
    // });

    //判断有无违禁词
    (function() {
        var a = 0;
        if (a) {
            $(".none").hide();
            $(".had").show();
        } else {
            $(".none").show();
            $(".had").hide();
        }
    })();
    // 添加违禁词弹框
    $(".addforbidword").click(function() {
        layer.open({
            type: 1,
            area: ['650px', '320px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#addforbidword"),
            shade: [0.2, '#393D49'],
            skin: 'addforbidword',
            shadeClose: true,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var word = $(".content").val();
                if (word == "") {
                    layer.close(index);
                    return;
                }
                var html = $(".forbidwords").html();
                // $(".forbidwords").html(html + `<div class="left">
                //         <span>${word}</span>
                //             <img class="del" src="../../img/del.png" alt="">
                //         </div>`);
                $(".content").val("");
                layer.close(index);
                $(".none").hide();
                $(".had").show();
            }
        });
    });
    // 删掉一个违禁词
    $("img.del").click(function() {
        layer.open({
            type: 1,
            area: ['480px', '360px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#delforbidword"),
            shade: [0.2, '#393D49'],
            skin: 'addforbidword',
            shadeClose: true,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {

                layer.close(index);
            }
        });
    });
    //执行一个laypage实例
    laypage.render({
        elem: 'forbidpage',
        count: 50,
        prev: "<<上一页",
        next: "下一页>>",
        theme: '#4597E0'
    });
}()