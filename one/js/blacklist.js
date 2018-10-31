;
! function() {
    var table = layui.table,
        layer = layui.layer,
        $ = layui.$;
    (function() {
        $.ajax({
            type: "get",
            url: ' http://192.168.0.71:8080/blacklist/list?pageNum=1&pageSize=10',
            success: function(data) {
                console.log(data);
                var count = data.result.total;
                console.log(count);
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
                        table.reload('blacklist', {
                                url: 'http://192.168.0.71:8080/blacklist/list?status=2&pageNum=' + curr + '&pageSize=10'
                            })
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
    // 表格

    table.render({
        elem: '#blacklist',
        skin: 'line',
        url: 'http://192.168.0.71:8080/blacklist/list?pageNum=1&pageSize=10',
        parseData: function(res) { //res 即为原始返回的数据
            console.log(res);
            return {
                "code": 0, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.result.total, //解析数据长度
                "data": res.result.list //解析数据列表
            };
        },
        cols: [
            [ //表头
                {
                    field: 'visitor',
                    title: '用户名称',
                    unresize: true
                }, {
                    field: 'ip',
                    title: '用户IP',
                    templet: '#ip',
                    unresize: true
                }, {
                    field: 'createTime',
                    title: '访问时间',
                    unresize: true
                }, {
                    field: 'as',
                    title: '操作',
                    toolbar: '#remove',
                    unresize: true
                }
            ]
        ],
    });

    // 移除事件
    table.on('tool(blacklist)', function(obj) { //注：tool是工具条事件名，blacklist是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var name = obj.data.visitor;
        var id = obj.data.blacklistId;
        $("#blackname").html(name);
        console.log(id);
        if (layEvent === 'remove') { //查看
            layer.open({
                type: 1,
                area: ['480px', '360px'],
                title: ['', "background:#fff;border:0"], //'在线调试',
                content: $("#removeblacklist"),
                shade: [0.2, '#393D49'],
                skin: 'removeblacklist',
                shadeClose: true,
                btnAlign: 'c', //按钮居中显示
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    $.ajax({
                        type: 'get',
                        url: 'http://192.168.0.71:8080/blacklist/remove/' + id,
                        success: function(data) {
                            console.log(data);
                            layer.close(index);
                            table.reload('blacklist');
                        },
                        error: function(err) {
                            console.log(err);
                            // alert("删除失败");
                        }
                    });
                }
            });
        }
    });
    // button搜索事件
    $("button.search").click(function() {
        var keyWord = $("input.search").val();
        console.log(keyWord);
        $.ajax({
            type: 'get',
            url: '',
            success: function() {
                table.reload('blacklist');
            },
            error: function() {}
        });
    });
}();