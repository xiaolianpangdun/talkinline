;
! function() {
    // 分页器
    var laypage = layui.laypage,
        layer = layui.layer,
        $ = layui.$;
    // $(".content").bind('input propertychange', function() {
    //     console.log($(this).val().length);
    // });
    (function() {
        $.ajax({
            type: "get",
            url: ' http://192.168.0.71:8080/prohibit/list?pageNum=1&pageSize=20',
            success: function(data) {
                console.log(data);
                var lists = data.result.list;
                if (lists[0] != null) {
                    $(".none").hide();
                    $(".had").show();
                    var html = '';
                    for (var i = 0; i < lists.length; i++) {
                        html += " <div class='left'><span>" + lists[i].word + "</span><img data-id='" + lists[i].wordId + "' class='del' src='../../img/del.png'></div>";
                    }
                    $(".forbidwords").html(html);
                    // 删掉一个违禁词
                    $("img.del").click(function() {
                        var that = $(this);
                        var name = that.prev().html();
                        var id = that.attr("data-id");
                        console.log(id);
                        $("#wordname").html(name);
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
                                $.ajax({
                                    type: 'post',
                                    url: 'http://192.168.0.71:8080/prohibit/remove',
                                    data: { "ids": id },
                                    success: function(res) {
                                        window.location.reload();
                                        layer.close(index);
                                    }
                                });

                            }
                        });
                    });
                } else {
                    $(".none").show();
                    $(".had").hide();
                }
                console.log(lists);
                var count = data.result.total;
                // 分页器
                var laypage = layui.laypage;

                //执行一个laypage实例
                laypage.render({
                    elem: 'page',
                    count: count,
                    prev: "<<上一页",
                    next: "下一页>>",
                    theme: '#4597E0',
                    limit: 10,
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        var curr = obj.curr, //得到当前页，以便向服务端请求对应页的数据。
                            limit = obj.limit; //得到每页显示的条数
                        //首次不执行
                        if (!first) {
                            //do something
                        }
                    }
                });
            },
            error: function() {
                alert("抱歉");
            }
        });
    })();
    //判断有无违禁词
    // (function() {
    //     var a = 0;
    //     if (a) {
    //         $(".none").hide();
    //         $(".had").show();
    //     } else {
    //         $(".none").show();
    //         $(".had").hide();
    //     }
    // })();
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

}()