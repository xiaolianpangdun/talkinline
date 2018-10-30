;
! function() {
    var $ = layui.$;
    // $("label").click(function() {
    //     $(".ddd").removeClass("checked");
    //     $(this).child("").addClass("checked");
    // });
    // 点击弹出结束访谈弹框
    $(".endtalk").click(function() {
        console.log(123);
        alert(12);
    });
    // 点击添加嘉宾
    $("button.addguest").click(function() {
        layer.open({
            type: 1,
            area: ['480px', '360px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#addguest"),
            shade: [0.8, '#393D49'],
            skin: 'addguest',
            shadeClose: true,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var name = $("input.guestname").val();
                var html = "";
                $(".html").html($('.html').html() + html);
                $("input.guestname").val("");
                layer.close(index);
            }
        });
    });
    // 点击弹出新建访谈弹框
    $(".addtalk").click(function() {
        layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: '<div class="addtype">请选择所要新建的类型</div>',
            shade: [0.2, '#393D49'],
            skin: 'addkind',
            shadeClose: true,
            btnAlign: 'c', //按钮居中显示
            btn: ['在线访谈', '在线预告'],
            yes: function(index, layero) {
                //按钮【按钮一】的回调
                layer.close(index);
                layer.open({
                    type: 1,
                    area: ['700px', '600px'],
                    title: ['', "background:#fff;border:0"], //'在线调试',
                    content: $("#addinlinetalk"),
                    shade: [0.2, '#393D49'],
                    skin: 'addkind1',
                    shadeClose: true,
                    btnAlign: 'c', //按钮居中显示
                    btn: ['确定'],
                    yes: function(index, layero) {}
                });
            },
            btn2: function(index, layero) {
                layer.open({
                    type: 1,
                    area: ['700px', '600px'],
                    title: ['', "background:#fff;border:0"], //'在线调试',
                    content: $("#addadvance"),
                    shade: [0.2, '#393D49'],
                    skin: 'addkind1',
                    shadeClose: true,
                    btnAlign: 'c', //按钮居中显示
                    btn: ['确定'],
                    yes: function(index, layero) {}
                });
                //按钮【按钮二】的回调

                //return false 开启该代码可禁止点击该按钮关闭
            },
            cancel: function() {
                //右上角关闭回调

                //return false 开启该代码可禁止点击该按钮关闭
            },
            end: function() {
                // 无论是确认还是取消，只要层被销毁了，end都会执行，不携带任何参数。
            }
        });
    });
    // 新建访谈开始与时间
    var laydate = layui.laydate;
    laydate.render({
        elem: '#starttime',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endtime',
        type: 'datetime'
    });
    // 表格
    var table = layui.table;
    table.render({
        elem: '#test',
        skin: 'line',
        url: '../data.json',
        cols: [
            [ //表头
                {
                    field: 'number',
                    title: '序号',
                    width: 100,
                    unresize: true
                }, {
                    field: 'name',
                    title: '访谈名称',
                    unresize: true
                }, {
                    field: 'status',
                    title: '访谈状态',
                    width: 120,
                    templet: '#talk',
                    unresize: true
                }, {
                    field: 'kind',
                    title: '类型',
                    wdith: 150,
                    unresize: true
                }, {
                    field: 'as',
                    title: '操作',
                    width: 360,
                    toolbar: '#handle',
                    unresize: true
                }
            ]
        ],
    });
    // 表格点击事件
    table.on('tool(test)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'endtalk') { //查看
            layer.open({
                type: 1,
                area: ['480px', '360px'],
                title: ['', "background:#fff;border:0"], //'在线调试',
                content: $("#endtalkpopup"),
                shade: [0.2, '#393D49'],
                skin: 'end',
                shadeClose: true,
                btnAlign: 'c', //按钮居中显示
                btn: ['确定', '取消'],
                yes: function(index, layero) {}
            });
        } else if (layEvent === 'delete') { //删除
            console.log(data);
            if (data.status == "正在访谈") {
                layer.open({
                    type: 1,
                    area: ['480px', '360px'],
                    title: ['', "background:#fff;border:0"], //'在线调试',
                    content: $("#cannotdel"),
                    shade: [0.2, '#393D49'],
                    skin: 'end',
                    shadeClose: true,
                    btnAlign: 'c', //按钮居中显示
                    btn: [],
                    yes: function(index, layero) {}
                });
            } else {
                layer.open({
                    type: 1,
                    area: ['480px', '360px'],
                    title: ['', "background:#fff;border:0"], //'在线调试',
                    content: $("#candel"),
                    shade: [0.2, '#393D49'],
                    skin: 'end',
                    shadeClose: true,
                    btnAlign: 'c', //按钮居中显示
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {}
                });
            }
        } else if (layEvent === 'talkdetail') { //编辑
            //do something
            window.localStorage.setItem("link", "two");
            parent.location.reload();
            //同步更新缓存对应的值
            // obj.update({
            //     username: '123',
            //     title: 'xxx'
            // });
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

    // 点击切换视频 图片
    $("input[name='selectadvance']").click(function() {
        var val = $("input[name='selectadvance']:checked").val();
        console.log(val);
        if (val == "图文预告") {
            $("img.upimg").show();
            $("img.upvideo").hide();
            // $(this).next().children(".ddd").addClass("checked");
        } else {
            // $(".ddd").removeClass("checked");
            $("img.upimg").hide();
            $("img.upvideo").show();
        }
    });
    // radio标签改变样式
    $("input[type='radio']").click(function() {
        $(".ddd").removeClass("checked");
        $(this).next().children(".ddd").addClass("checked");
    });
}();