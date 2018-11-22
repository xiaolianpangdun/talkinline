;
! function() {
    var table = layui.table,
        layer = layui.layer;
    jQuery.support.cors = true;
    $.ajaxSetup({ cache: false });
    // $ = layui.$;
    var url = window.localStorage.getItem("backstage");

    function pagecurrent() {
        $.ajax({
            type: "get",
            cache: false,
            url: url + '/blacklist/list?pageNum=1&pageSize=10',
            success: function(data) {
                var count = data.count;
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
                        var curr = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                        tablerender(curr);
                    }
                });
            },
            error: function() {
                layer.msg("服务器繁忙,请稍后重试！");
            }
        });
    };
    pagecurrent();
    // 手写表格
    function tablerender(pageNum) {
        $.ajax({
            type: "get",
            cache: false,
            url: url + '/blacklist/list?pageNum=' + pageNum + '&pageSize=10',
            success: function(data) {
                var tbody = "";
                $.each(data.data, function(i, obj) {
                    tbody += '<tr>';
                    tbody += '<td>' + obj.visitor + '</td>';
                    tbody += '<td  class="table-ip">' + obj.ip + '</td>';
                    tbody += '<td>' + obj.createTime + '</td>';
                    tbody += '<td><span data-id="' + obj.blacklistId + '" data-name="' + obj.visitor + '"class="table-remove">移除</span></td>'
                    tbody += '</tr>'
                });
                $(".table-tbody").html(tbody);
            }
        });
    }
    // 手写删除
    $(".table-tbody").on("click", "span.table-remove", function(event) {
        var that = $(event.target);
        var id = that.attr("data-id");
        var name = that.attr("data-name");
        $("#blackname").html(name);
        layer.open({
            type: 1,
            area: ['480px', '360px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#removeblacklist"),
            shade: [0.2, '#393D49'],
            skin: 'removeblacklist',
            shadeClose: false,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                $.ajax({
                    type: 'get',
                    cache: false,
                    url: url + '/blacklist/remove/' + id,
                    success: function(res) {
                        // console.log(data);
                        layer.close(index);
                        pagecurrent();
                        layer.msg(res.msg);
                        // table.reload('blacklist');
                    },
                    error: function(err) {
                        layer.msg("服务器繁忙！请稍后重试！");
                        // alert("删除失败");
                    }
                });
            },
            end: function() {
                $("#removeblacklist").hide();
            }
        });
    });
}();