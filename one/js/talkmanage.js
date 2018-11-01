;
! function() {
    var $ = layui.$;
    (function() {
        $.ajax({
            type: "get",
            // dataType: "json",
            url: ' http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10',
            // data: { username: username, password: password },
            success: function(data) {
                // alert("提交成功");
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
                        table.reload('tbtalkmanage', {
                                url: 'http://192.168.0.71:8080/interview/list?currentPage=' + curr + '&pageSize=10'
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

    // 点击添加嘉宾弹框
    $("button.addguest").click(function() {
        var that = $(this);
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
                html += "<div class='left guest'>";
                html += "<span class='guestlists'>" + name + "</span>";
                html += "&nbsp;&nbsp;<img src='../../img/cancel_02.png'>";
                html += "</div>";
                if (that.hasClass("tkil")) {
                    $("#addinlinetalk .guestlist").html($('#addinlinetalk .guestlist').html() + html);
                } else {
                    $("#addadvance .guestlist").html($('#addadvance .guestlist').html() + html);
                }
                $("input.guestname").val("");
                layer.close(index);
            }
        });
    });
    // 点击弹出新建访谈弹框
    $(".addtalk").click(function() {
        $(".guestlist").html(""); //清空添加嘉宾内容
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
                //点击添加在线访谈弹框
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
                    yes: function(index, layero) {
                        var status = 1;
                        var type = parseInt($("input[name='selecttype']:checked").val());
                        console.log(type);
                        var name = $("#addinlinetalk input.talkname").val();
                        var beginTime = $("#addinlinetalk #starttime").val();
                        var endTime = $("#addinlinetalk #endtime").val();
                        var compere = $("#addinlinetalk input.compere").val();
                        var description = $("#addinlinetalk .talkintro").val();
                        var guests = document.getElementsByClassName("guestlists");
                        var speakername = [];
                        for (var i = 0; i < guests.length; i++) {
                            speakername.push(guests[i].innerHTML);
                        }
                        $.ajax({
                            type: 'post',
                            // contentType: 'application/form-data;charset=utf-8',
                            url: 'http://192.168.0.71:8080/interview/create',
                            traditional: true,
                            data: {
                                name: name,
                                speakername: speakername,
                                status: status,
                                type: type,
                                beginTime: beginTime,
                                endTime: endTime,
                                compere: compere,
                                description: description
                            },
                            success: function(data) {
                                console.log(data);
                            },
                            error: function(err) {
                                alert("修改失败");
                            }
                        });
                    }
                });
            },
            btn2: function(index, layero) {
                // 点击添加在线预告弹框
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
                    yes: function(index, layero) {
                        var status = 0;
                        var type = parseInt($("input[name='selectadvance']:checked").val());
                        var compere = $("#addadvance input.compere").val();
                        var description = $("#addadvance .talkintro").val();
                        var guests = document.getElementsByClassName("guestlists");
                        var speakername = [];
                        for (var i = 0; i < guests.length; i++) {
                            speakername.push(guests[i].innerHTML);
                        }
                        var file = $("#addadvance #fileUp").val();
                        console.log(file);
                        $("#afterfileUp").change(function() {
                            var file = $(this).val();
                            alert(111);
                            $(".afterupcon").hide();
                            $("beforeup").show();
                            //alert(file);
                            // if (file.length > 0) {
                            //     var suffix = file.substr(file.lastIndexOf("\\") + 1);
                            //     //alert(suffix);
                            //     $("#fake_btn").hide();
                            //     $("#fake_btn").after($("<span id='fileName'>" + suffix + "</span>"));
                            //     var w = $("#fileName").width();
                            //     var top = parseInt($('.dataTables_filter').offsetTop); //.css("right"));
                            //     $('.dataTables_filter').css({ 'right': (top - 20 + w) + 'px' });
                            // }
                        });
                        $.ajax({
                            type: 'post',
                            // contentType: 'application/form-data;charset=utf-8',
                            url: 'http://192.168.0.71:8080/interview/create',
                            traditional: true,
                            data: {
                                name: 'aaa',
                                speakername: speakername,
                                status: status,
                                type: type,
                                compere: compere,
                                description: description,
                                file: file
                            },
                            success: function(data) {
                                console.log(data);
                            },
                            error: function(err) {
                                alert("修改失败");
                            }
                        });
                    }
                });
                //按钮【按钮二】的回调

                //return false 开启该代码可禁止点击该按钮关闭
            },
            success: function(layero, index) {
                // console.log(window);
                // var mask = $(".layui-layer-shade");
                // mask.appendTo(parent.window.document.body);
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
        elem: '#tbtalkmanage',
        skin: 'line',
        url: 'http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10',
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
                    width: 100,
                    unresize: true
                }, {
                    field: 'name',
                    title: '访谈名称',
                    unresize: true
                }, {
                    field: 'status',
                    title: '访谈状态',
                    width: 150,
                    templet: '#talk',
                    unresize: true
                }, {
                    field: 'type',
                    title: '类型',
                    width: 150,
                    templet: '#talktype',
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
    table.on('tool(tbtalkmanage)', function(obj) { //注：tool是工具条事件名，tbtalkmanage是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var interviewId = obj.data.interviewId;
        // console.log(interviewId);
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
                yes: function(index, layero) {
                    $.ajax({
                        type: 'post',
                        url: 'http://192.168.0.71:8080/interview/edit',
                        data: { interviewId: interviewId, status: 2 },
                        success: function() {
                            table.reload('tbtalkmanage');
                            layer.close(index);
                        },
                        error: function() {
                            alert("修改失败");
                        }
                    });
                }
            });
        } else if (layEvent === 'delete') { //删除
            // console.log(data);
            if (data.status == "1") {
                layer.open({
                    type: 1,
                    area: ['480px', '360px'],
                    title: ['', "background:#fff;border:0"], //'在线调试',
                    content: $("#cannotdel"),
                    shade: [0.2, '#393D49'],
                    skin: 'end',
                    shadeClose: true,
                    time: 2000,
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
                    yes: function(index, layero) {
                        $.ajax({
                            type: 'else',
                            url: 'http://192.168.0.71:8080/interview/remove?id=' + interviewId,
                            success: function() {
                                table.reload('tbtalkmanage');
                                layer.close(index);
                            },
                            error: function() {
                                alert("修改失败");
                            }
                        });
                    }
                });
            }
        } else if (layEvent === 'talkdetail') { //编辑
            //do something
            window.localStorage.setItem("link", "two");
            window.localStorage.setItem("interviewId", interviewId);
            // console.log(window.localStorage.getItem("interviewId"));
            parent.location.reload();
            //同步更新缓存对应的值
            // obj.update({
            //     username: '123',
            //     title: 'xxx'
            // });
        }
    });


    // 点击切换视频 图片
    $("input[name='selectadvance']").click(function() {
        var val = $("input[name='selectadvance']:checked").val();
        console.log(val);
        if (val == "1") {
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
    //实时显示剩余可输入的字数
    $(".freewordevent").keyup(function() {
        var t = $(this);
        var txt = $(t).val().length;
        var len = $(t).next().children('.maxleng').html() - txt;
        if (len >= 0) {
            $(t).next().children('.freespace').html(len);
        } else {
            $(t).val($(t).val().substring(0, $(t).next().children('.maxleng').text()));
        }
    });
}();