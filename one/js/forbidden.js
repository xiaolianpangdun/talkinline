;
! function() {
    // 分页器
    var layer = layui.layer,
        keyWord = '',
        $ = layui.$;
    var update = function(num, keyWord) {
        $.ajax({
            type: "get",
            url: ' http://192.168.0.71:8080/prohibit/list?pageNum=' + num + '&pageSize=50&keyWord=' + keyWord + '',
            success: function(data) {
                console.log(data);
                var lists = data.result.list;
                if (lists.length > 0) {
                    $(".none").hide();
                    $(".had").show();
                    var html = '';
                    for (var i = 0; i < lists.length; i++) {
                        if (keyWord) {
                            var array = lists[i].word.split(keyWord);
                            var kw = "<span class='keyword'>" + keyWord + "</span>"
                            var word = array[0] + kw + array[1];
                        } else { word = lists[i].word }
                        html += " <div class='left'><span>" + word + "</span><img data-id='" + lists[i].wordId + "' class='del' src='../../img/del.png'></div>";
                    }
                    $(".forbidwords").html(html);
                } else {
                    $(".none").show();
                    $(".had").hide();
                }
            },
            error: function() {
                alert("抱歉");
            }
        });
    };

    var pagenum = window.localStorage.getItem("pagenm");
    if (pagenum != null) {
        var pagenm = pagenum;
    } else {
        window.localStorage.setItem("pagenm", 1);
        var pagenm = 1;
    }
    update(pagenm, keyWord);
    // 分页器
    var laypage = function(pagenm, keyWord) {
        $.ajax({
            type: "get",
            url: ' http://192.168.0.71:8080/prohibit/list?pageNum=' + pagenm + '&pageSize=50&keyWord=' + keyWord + '',
            success: function(data) {
                var count = data.result.total;
                var laypage = layui.laypage;
                //执行一个laypage实例
                
                laypage.render({
                    elem: 'forbidpage',
                    count: count,
                    prev: "<<上一页",
                    next: "下一页>>",
                    curr: location.hash.replace('#!pagenm=', pagenm),
                    hash: 'pagenm',
                    theme: '#4597E0',
                    limit: 50,
                    jump: function(obj, first) {
                        var curr = obj.curr;
                        //得到当前页，以便向服务端请求对应页的数据。
                        // limit = obj.limit; //得到每页显示的条数
                        window.localStorage.setItem("pagenm", curr);
                        update(curr, keyWord);
                    }
                });
            }
        });

    };
    laypage(pagenm, keyWord);
    // 利用冒泡写删除违禁词弹框
    $(".forbidwords").on('click', 'img.del', function(event) {
        var that = $(event.target);
        var name = that.prev().html();
        var id = that.attr("data-id");
        // console.log(id);
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
                var data = { "ids": id };
                $.ajax({
                    url: 'http://192.168.0.71:8080/prohibit/remove',
                    type: 'POST',
                    contentType: "application/json;charset=utf-8",
                    dataType: 'json',
                    async: true, //或false,是否异步
                    data: JSON.stringify({ "ids": id }),
                    success: function(data) {
                        var pagenm = window.localStorage.getItem("pagenm")
                        update(pagenm, keyWord);
                        layer.close(index);
                    },
                    error: function(xhr, textStatus) {},
                })
            }
        });
    });

    // 添加违禁词弹框
    $(".addforbidword").click(function() {
        layer.open({
            type: 1,
            area: ['660px', '320px'],
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
                $.ajax({
                    url: 'http://192.168.0.71:8080/prohibit/create',
                    type: 'POST',
                    contentType: "application/json;charset=utf-8",
                    // dataType: 'json',
                    async: true, //或false,是否异步
                    data: JSON.stringify({ "keyWord": word }),
                    success: function(data, textStatus, jqXHR) {
                        $(".content").val("");
                        var pagenm = window.localStorage.getItem("pagenm")
                        update(pagenm, keyWord);
                        // window.location.reload();
                        // console.log(data);
                        layer.close(index);
                    },
                    error: function(xhr, textStatus) {},
                })
                $(".content").val("");
                layer.close(index);
            }
        });
    });

    // 关键词搜索违禁词
    var searchforbid = function() {
        keyWord = $("input.search").val();
        update(pagenm, keyWord);
        laypage(pagenm, keyWord);

    }
    $("button.search").click(function() {
        searchforbid();
    });
    $("input.search").bind('keypress', function() {
        if (event.keyCode == "13") {
            searchforbid();
        }
    })
}()