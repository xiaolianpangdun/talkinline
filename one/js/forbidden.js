;
! function() {
    // 分页器
    var layer = layui.layer,
        upload = layui.upload,
        keyWord = '';
    // $ = layui.$;
    jQuery.support.cors = true;
    $.ajaxSetup({ cache: false });
    var url = window.localStorage.getItem("backstage");
    // 数据渲染
    var update = function(num, keyWord) {
        $.ajax({
            type: "post",
            cache: false,
            url: url + '/prohibit/list',
            data: {
                pageNum: num,
                pageSize: 50,
                keyWord: keyWord
            },
            success: function(data) {
                console.log(data);
                var lists = data.data.list;
                if (lists.length > 0) {
                    $(".none").hide();
                    $(".had").show();
                    var html = '';
                    for (var i = 0; i < lists.length; i++) {
                        if (keyWord) {
                            var array = lists[i].word.split(keyWord);
                            // console.log(array);
                            var word = array.join("<span class='keyword'>" + keyWord + "</span>");
                            // var word = array[0] + kw + array[1];
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
                layer.msg("服务器错误,请稍后重试");
            }
        });
    };


    // 分页器
    var laypage = function(pagenm, keyWord) {
        $.ajax({
            type: "post",
            cache: false,
            url: url + '/prohibit/list',
            data: {
                pageNum: pagenm,
                pageSize: 50,
                keyWord: keyWord
            },
            success: function(data) {
                var count = data.data.total;
                var laypage = layui.laypage;
                //执行一个laypage实例
                // console.log(data);
                laypage.render({
                    elem: 'forbidpage',
                    count: count,
                    prev: "<<上一页",
                    next: "下一页>>",
                    curr: pagenm, //location.hash.replace('#!fenye=', pagenm),
                    // hash: 'fenye',
                    theme: '#4597E0',
                    limit: 50,
                    jump: function(obj, first) {
                        // console.log(curr);
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
    // update(1, keyWord);
    laypage(1, keyWord);
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
            shadeClose: false,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var data = { "ids": id };
                $.ajax({
                    url: url + '/prohibit/remove',
                    type: 'POST',
                    contentType: "application/json;charset=utf-8",
                    dataType: 'json',
                    async: true, //或false,是否异步
                    cache: false,
                    data: JSON.stringify({ "ids": id }),
                    success: function(res) {
                        var pagenm = window.localStorage.getItem("pagenm")
                            // update(pagenm, keyWord);
                        laypage(pagenm, keyWord);
                        layer.msg(res.msg);
                        layer.close(index);
                    },
                    error: function(xhr, textStatus) {
                        layer.msg("服务器错误，请稍后重试");
                    },
                })
            },
            end: function() {
                $("#delforbidword").hide();
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
            shadeClose: false,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var word = $(".content").val();
                word = word.replace(/(^\s*)|(\s*$)/g, '');
                if (word == "") {
                    layer.msg("违禁词不能为空");
                    return;
                }
                $.ajax({
                    url: url + '/prohibit/create',
                    type: 'POST',
                    contentType: "application/json;charset=utf-8",
                    // dataType: 'json',
                    async: true, //或false,是否异步
                    cache: false,
                    data: JSON.stringify({ "keyWord": word }),
                    success: function(res, textStatus, jqXHR) {
                        $(".content").val("");
                        var pagenm = window.localStorage.getItem("pagenm");
                        // update(pagenm, keyWord);
                        laypage(pagenm, keyWord);
                        layer.msg(res.msg);
                        // window.location.reload();
                        // console.log(data);
                        layer.close(index);
                    },
                    error: function(xhr, textStatus) {},
                })
                $(".content").val("");
                layer.close(index);
            },
            end: function() {
                $(".content").val("");
                $("#addforbidword").hide();
            }
        });
    });

    // 关键词搜索违禁词
    var searchforbid = function() {
        keyWord = $("input.search").val();
        laypage(1, keyWord);
    }
    $("button.search").click(function() {
        searchforbid();
    });
    $("input.search").bind('keypress', function() {
        if (event.keyCode == "13") {
            searchforbid();
        }
    });
    // 批量导入违禁词
    $("#leadfile").click(function(e) {
        alert("请上传txt格式的文件,每个违禁词为一行！！！");
    });
    // jquery.form.js上传文件
    $("#leadfile").change(function() {
        $('#forbidfile').ajaxSubmit({
            forceSync: false,
            url: url + '/prohibit/batchImport',
            type: 'post',
            dataType: 'json',
            // data: reqServer,
            restForm: true,
            clearForm: true,
            success: function(res) {
                laypage(1, "");
                layer.msg(res.msg);
            },
            error: function(res) {
                laypage(1, "");
                // layer.msg("");   //ie8文件成功上传但进入error
            }

        })
        return false;
    });
}();