;
! function() {
    // 表格
    var table = layui.table,
        $ = layui.$,
        layer = layui.layer;
    table.render({
        elem: '#blacklist',
        skin: 'line',
        url: '../blacklist.json',
        cols: [
            [ //表头
                {
                    field: 'uname',
                    title: '用户名称',
                    unresize: true
                }, {
                    field: 'ip',
                    title: '用户IP',
                    templet: '#ip',
                    unresize: true
                }, {
                    field: 'time',
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
    table.on('tool(test)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

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
                yes: function(index, layero) {}
            });
        }
    });
    // 分页器
    var laypage = layui.laypage;

    //执行一个laypage实例
    laypage.render({
        elem: 'page',
        count: 50,
        prev: "<<上一页",
        next: "下一页>>",
        theme: '#4597E0'
    });
}();