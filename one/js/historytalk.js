;
! function() {
    var $ = layui.$;
    var url = window.localStorage.getItem("backstage");
    (function() {
        $.ajax({
            type: "get",
            url: url + '/interview/list?status=2&currentPage=1&pageSize=10',
            success: function(data) {
                console.log(data);
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
                            table.reload('historytalk', {
                                url: url + '/interview/list?status=2&currentPage=' + curr + '&pageSize=10'
                            })
                        }
                    }
                });
            },
            error: function() {
                layer.msg("服务器繁忙，请刷新重试！");
            }
        });
    })();
    // 表格
    var table = layui.table;
    table.render({
        elem: '#historytalk',
        skin: 'line',
        url: url + '/interview/list?status=2&currentPage=1&pageSize=10',
        parseData: function(res) { //res 即为原始返回的数据
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
                    field: 'interviewId',
                    title: '序号',
                    width: 120,
                    unresize: true
                }, {
                    field: 'name',
                    // width: 200,
                    title: '访谈名称',
                    unresize: true
                }, {
                    field: 'status',
                    title: '访问状态',
                    templet: '#talk',
                    unresize: true
                }, {
                    field: 'type',
                    title: '类型',
                    templet: '#talktype',
                    unresize: true
                }, {
                    field: 'as',
                    title: '操作',
                    toolbar: '#edit',
                    unresize: true
                }
            ]
        ],
    });


    table.on('tool(historytalk)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var interviewId = obj.data.interviewId;
        var status = obj.data.status;
        if (layEvent === 'historytalkdetail') { //查看
            window.localStorage.setItem("link", "two");
            window.localStorage.setItem("interviewId", interviewId);
            window.localStorage.setItem("status", status);
            window.localStorage.setItem("kind", "history");
            parent.location.reload();
        }
    });
}();