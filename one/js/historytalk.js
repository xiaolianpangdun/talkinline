;
! function() {
    // 表格
    var table = layui.table;
    table.render({
        elem: '#historytalk',
        skin: 'line',
        url: '../historytalk.json',
        cols: [
            [ //表头
                {
                    field: 'number',
                    title: '序号',
                    width: 150,
                    unresize: true
                }, {
                    field: 'name',
                    title: '访谈名称',
                    unresize: true
                }, {
                    field: 'status',
                    title: '访问状态',
                    unresize: true
                }, {
                    field: 'kind',
                    title: '类型',
                    unresize: true
                }, {
                    field: 'as',
                    title: '操作',
                    templet: '#edit',
                    unresize: true
                }
            ]
        ],
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