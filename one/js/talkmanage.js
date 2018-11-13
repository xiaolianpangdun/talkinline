;
! function() {
    var
        upload = layui.upload;


    // 点击添加嘉宾弹框
    $(".addguest").click(function() {
        var that = $(this);
        layer.open({
            type: 1,
            area: ['480px', '360px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#addguest"),
            shade: [0.8, '#393D49'],
            skin: 'addguest',
            shadeClose: false,
            btnAlign: 'c', //按钮居中显示
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var name = $("input.guestname").val();
                name = name.replace(/(^\s*)|(\s*$)/g, '');
                if (name == "") {
                    layer.msg("嘉宾名称不能为空");
                    return;
                }
                if (name) {
                    var html = "";
                    html += "<div class='left guest'>";
                    html += "<span class='guestlists'>" + name + "</span>";
                    html += "&nbsp;&nbsp;<img class='deleteguest' src='../../img/cancel_02.png'>";
                    html += "</div>";
                    if (that.hasClass("tkil")) {
                        $("#addinlinetalk .guestlist").html($('#addinlinetalk .guestlist').html() + html);
                    } else {
                        $("#addadvance .guestlist").html($('#addadvance .guestlist').html() + html);
                    }
                }
                $("input.guestname").val("");
                $("#addguest").hide();
                layer.close(index);
            },
            end: function() {
                $("#addguest").hide();
            }
        });
    });

    // 点击删除嘉宾
    $(".guestlist").on("click", "img.deleteguest", function(event) {
        var that = $(event.target);
        that.parent().remove();
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
            shadeClose: false,
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
                    shadeClose: false,
                    btnAlign: 'c', //按钮居中显示
                    btn: ['确定'],
                    yes: function(index, layero) {
                        var status = 1;
                        var type = parseInt($("#addinlinetalk input[name='type']:checked").val());
                        var name = $("#addinlinetalk input.talkname").val();
                        var beginTime = $("#addinlinetalk #starttime").val();
                        var endTime = $("#addinlinetalk #endtime").val();
                        var compere = $("#addinlinetalk input.compere").val();
                        var description = $("#addinlinetalk .talkintro").val();
                        var guests = document.getElementsByClassName("guestlists");
                        var file1 = $("#addinlinetalk input[id='beforefileUp0']")[0].files[0];
                        var file2 = $("#addinlinetalk input[id='afterfileUp0']")[0].files[0];
                        var fileid = "beforefileUp0";
                        if (!file1) {
                            fileid = "afterfileUp0"
                        }
                        var speakername = [];
                        var length = guests.length;
                        console.log(length);
                        for (var i = 0; i < length; i++) {
                            speakername.push(guests[i].innerHTML);
                        }
                        if (!name) { layer.msg("请输入访谈名称"); return false; }
                        if (!beginTime) { layer.msg("请选择访谈开始时间"); return false; }
                        if (!endTime) { layer.msg("请选择访谈结束时间"); return false; }
                        if (length < 1) { layer.msg("请选择访谈嘉宾"); return false; }
                        if (!compere) { layer.msg("请输入访谈主持人"); return false; }
                        if (!description) { layer.msg("请输入访谈简介"); return false; }
                        if (isNaN(type)) { layer.msg("请选择访谈场景"); return false; }

                        if (type == 1 && !(!file1 && !file2)) {
                            if (file1) {
                                var filetype = file1.type;
                                var size = file1.size;
                            } else if (file2) {
                                var filetype = file2.type;
                                var size = file2.size;
                            }
                            if (filetype.indexOf("/") > 0) {
                                filetype = filetype.substring(filetype.lastIndexOf("/") + 1, filetype.length);
                            }
                            filetype = filetype.toLowerCase();
                            if (filetype != "jpg" && filetype != "jpeg" && filetype != "png" && filetype != "gif" && filetype != "bpm") {
                                layer.msg("请上传符合格式(jpg|jpeg|png|gif|bpm)的图片");
                                return false;
                            }
                            if (size / 1024 / 1024 > 10) {
                                layer.msg("您的图片文件超过10兆！");
                                return false;
                            }
                        }
                        var data = {
                            name: name,
                            speakername: speakername,
                            status: status,
                            type: type,
                            beginTime: beginTime,
                            endTime: endTime,
                            compere: compere,
                            description: description
                        };
                        $.ajaxFileUpload({
                            url: 'http://192.168.0.71:8080/interview/create',
                            secureuri: false, //一般设置为false
                            fileElementId: fileid, //文件上传空间的id属性
                            dataType: 'jsonp', //返回值类型 一般设置为json
                            data: data,
                            type: 'post',
                            success: function(data, status) //服务器成功响应处理函数
                                {
                                    console.log(data);
                                    if (status == "success") {
                                        layer.msg("上传成功");
                                        // var pagenum = window.localStorage.getItem("pagenum");
                                        pagecurrent(1);
                                        table.reload('tbtalkmanage', {
                                            url: 'http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10'
                                        })
                                        layer.close(index);
                                    } else {
                                        layer.msg("上传失败,请重试！");
                                        // layer.close(index);
                                    }
                                    $("#addinlinetalk input[type='file']").change(function(e) {
                                        console.log(111111);
                                        var that = $(this);
                                        $("#addinlinetalk .afterupcon").hide();
                                        $("#addinlinetalk .beforeup").show();
                                        var name = e.currentTarget.files[0].name;
                                        var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
                                        $("#addinlinetalk .filename").html(name);
                                        $("#addinlinetalk .filesize").html("(" + size + ")MB");
                                    });
                                    $("#addinlinetalk input[id='afterfileUp0']").change(function(e) {
                                        $("#beforefileUp0").val("");
                                    });
                                },
                            error: function(data, status, e) //服务器响应失败处理函数
                                {
                                    pagecurrent(1);
                                    table.reload('tbtalkmanage', {
                                        url: 'http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10'
                                    })
                                    layer.close(index);
                                }
                        });
                        // $.ajax({
                        //     type: 'post',
                        //     // contentType: 'application/form-data;charset=utf-8',
                        //     url: 'http://192.168.0.71:8080/interview/create',
                        //     traditional: true,
                        //     data: {
                        //         name: name,
                        //         speakername: speakername,
                        //         status: status,
                        //         type: type,
                        //         beginTime: beginTime,
                        //         endTime: endTime,
                        //         compere: compere,
                        //         description: description
                        //     },
                        //     success: function(data) {
                        //         console.log(data);
                        //     },
                        //     error: function(err) {
                        //         alert("修改失败");
                        //     }
                        // });
                    },
                    end: function() {
                        $("#addinlinetalk").hide();
                        $("#addinlinetalk input[type='text'],.talkintro").val("");
                        $("input[name='type']").prop("checked", false).next().find(".ddd").removeClass("checked");
                        $(".showfile").hide();
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
                    shadeClose: false,
                    btnAlign: 'c', //按钮居中显示
                    btn: ['确定'],
                    yes: function(index, layero) {
                        var status = 0;
                        var name = $("#addadvance .talkname").val();
                        var beginTime = $("#addadvance #starttime1").val();
                        var endTime = $("#addadvance #endtime1").val();
                        var type = parseInt($("#addadvance input[name='type']:checked").val());
                        var compere = $("#addadvance input.compere").val();
                        var description = $("#addadvance .talkintro").val();
                        var guests = document.getElementsByClassName("guestlists");
                        var length = guests.length;
                        var file1 = $("#addadvance input[id='beforefileUp']")[0].files[0];
                        var file2 = $("#addadvance input[id='afterfileUp']")[0].files[0];
                        var fileid = "beforefileUp";
                        if (!file1) {
                            fileid = "afterfileUp"
                        }
                        console.log(fileid);
                        var speakername = [];
                        for (var i = 0; i < length; i++) {
                            speakername.push(guests[i].innerHTML);
                        }
                        if (!name) { layer.msg("请输入访谈名称"); return false; }
                        if (!beginTime) { layer.msg("请选择访谈开始时间"); return false; }
                        if (!endTime) { layer.msg("请选择访谈结束时间"); return false; }
                        if (length < 1) { layer.msg("请选择访谈嘉宾"); return false; }
                        if (!compere) { layer.msg("请输入访谈主持人"); return false; }
                        if (!description) { layer.msg("请输入访谈简介"); return false; }
                        if (isNaN(type)) { layer.msg("请选择访谈场景"); return false; }
                        if (type == 0 && (!file1 && !file2)) { layer.msg("请上传访谈视频"); return false; }
                        if (type == 0) {
                            if (file1) {
                                var filetype = file1.type,
                                    size = file1.size;
                            } else {
                                var filetype = file2.type,
                                    size = file2.size;
                            }
                            if (filetype.indexOf("/") > 0) {
                                filetype = filetype.substring(filetype.lastIndexOf("/") + 1, filetype.length);
                            }
                            filetype = filetype.toLowerCase();
                            if (filetype != "mp4" && filetype != "mvp" && filetype != "mpeg" && filetype != "3gp" && filetype != "mov") {
                                layer.msg("请上传符合格式的视频");
                                return false;
                            }
                            if (size / 1024 / 1024 > 10) {
                                layer.msg("您的视频文件超过10兆！");
                                return false;
                            }
                        }
                        if (type == 1 && !(!file1 && !file2)) {
                            if (file1) {
                                var filetype = file1.type;
                                var size = file1.size;
                            } else if (file2) {
                                var filetype = file2.type;
                                var size = file2.size;
                            }
                            if (filetype.indexOf("/") > 0) {
                                filetype = filetype.substring(filetype.lastIndexOf("/") + 1, filetype.length);
                            }
                            filetype = filetype.toLowerCase();
                            if (filetype != "jpg" && filetype != "jpeg" && filetype != "png" && filetype != "gif" && filetype != "bpm") {
                                layer.msg("请上传符合格式的图片");
                                return false;
                            }
                            if (size / 1024 / 1024 > 10) {
                                layer.msg("您的图片文件超过10兆！");
                                return false;
                            }
                        }
                        var data = {
                            speakername: speakername,
                            status: status,
                            name: name,
                            beginTime: beginTime,
                            endTime: endTime,
                            type: type,
                            compere: compere,
                            description: description
                        };
                        // console.log(data);
                        $.ajaxFileUpload({
                            url: 'http://192.168.0.71:8080/interview/create',
                            secureuri: false, //一般设置为false
                            fileElementId: fileid, //文件上传空间的id属性
                            dataType: 'jsonp', //返回值类型 一般设置为json
                            data: data,
                            type: 'post',
                            success: function(data, status) //服务器成功响应处理函数
                                {
                                    console.log(data);
                                    if (status == "success") {
                                        layer.msg("上传成功");
                                        // var pagenum = window.localStorage.getItem("pagenum");
                                        // $("#addadvance").reload();
                                        layer.close(index);
                                        pagecurrent(1);
                                        table.reload('tbtalkmanage', {
                                            url: 'http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10'
                                        })
                                    } else {
                                        layer.msg("上传失败,请刷新重试");
                                        // layer.close(index);
                                    }
                                    $("#addadvance input[type='file']").change(function(e) {
                                        var that = $(this);
                                        $("#addadvance .afterupcon").hide();
                                        $("#addadvance .beforeup").show();
                                        var name = e.currentTarget.files[0].name;
                                        var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
                                        $("#addadvance .filename").html(name);
                                        $("#addadvance .filesize").html("(" + size + ")MB");
                                    });
                                    $("input[id='afterfileUp']").change(function(e) {
                                        $("#beforefileUp").val("");
                                    });
                                },
                            error: function(data, status, e) //服务器响应失败处理函数
                                {
                                    // console.log(data, status);
                                    pagecurrent(1);
                                    table.reload('tbtalkmanage', {
                                            url: 'http://192.168.0.71:8080/interview/list?currentPage=1&pageSize=10'
                                        })
                                        //     layer.msg("服务器繁忙，请刷新重试！");
                                    layer.close(index);
                                }
                        });
                        // $.ajax({
                        //     type: 'post',
                        //     // contentType: 'application/form-data;charset=utf-8',
                        //     url: 'http://192.168.0.71:8080/interview/create',
                        //     traditional: true,
                        //     contentType: 'multipart/form-data',
                        //     data: {
                        //         name: name,
                        //         speakername: speakername,
                        //         status: status,
                        //         type: type,
                        //         compere: compere,
                        //         description: description,
                        //         files: file
                        //     },
                        //     success: function(data) {
                        //         console.log(data);
                        //     },
                        //     error: function(err) {
                        //         alert("修改失败");
                        //     }
                        // });
                        // $.ajax({
                        //     type: 'post',
                        //     url: 'http://192.168.0.71:8080/interview/create',
                        //     // secureuri: false,
                        //     // fileElementId: 'fileup',
                        //     // dataType: 'JSON',
                        //     // contentType: false,
                        //     traditional: true,
                        //     // async: false,
                        //     // cache: false,
                        //     processData: false,
                        //     data: {
                        //         status: status,
                        //         name: name,
                        //         type: type,
                        //         compere: compere,
                        //         description: description,
                        //         files: file,
                        //         speakername: speakername
                        //     },
                        //     success: function(data) {
                        //         console.log(data);
                        //     },
                        //     error: function(err) {
                        //         alert("新增失败");
                        //     }
                        // });
                    },
                    end: function() {
                        $("#addadvance").hide();
                        $("#addadvance input[type='text'],.talkintro").val("");
                        $("input[name='type']").prop("checked", false).next().find(".ddd").removeClass("checked");
                        $(".showfile").hide();
                    }
                });
            },
            success: function(layero, index) {},
            end: function() {}
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
    laydate.render({
        elem: '#starttime1',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endtime1',
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
                    width: '10%',
                    unresize: true
                }, {
                    field: 'name',
                    title: '访谈名称',
                    width: '20%',
                    unresize: true
                }, {
                    field: 'status',
                    title: '访谈状态',
                    width: '15%',
                    templet: '#talk',
                    unresize: true
                }, {
                    field: 'type',
                    title: '类型',
                    width: '15%',
                    templet: '#talktype',
                    unresize: true
                }, {
                    field: 'as',
                    title: '操作',
                    // width: 360,
                    toolbar: '#handle',
                    unresize: true
                }
            ]
        ],
    });
    //分页
    function pagecurrent(pagenum) {
        $.ajax({
            type: "get",
            // dataType: "json",
            url: ' http://192.168.0.71:8080/interview/list?currentPage=' + pagenum + '&pageSize=10',
            // data: { username: username, password: password },
            success: function(data) {
                // alert("提交成功");
                // console.log(data);
                var count = data.result.total;
                // 分页器
                var laypage = layui.laypage;

                //执行一个laypage实例
                laypage.render({
                    elem: 'page',
                    count: count,
                    prev: "<<上一页",
                    next: "下一页>>",
                    curr: pagenum,
                    theme: '#4597E0',
                    limit: 10,
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        var curr = obj.curr, //得到当前页，以便向服务端请求对应页的数据。
                            limit = obj.limit; //得到每页显示的条数
                        window.localStorage.setItem("pagenum", curr);
                        if (!first)
                            table.reload('tbtalkmanage', {
                                url: 'http://192.168.0.71:8080/interview/list?currentPage=' + curr + '&pageSize=10'
                            })
                    }
                });
            },
            error: function() {
                layer.msg("服务器繁忙,请刷新重试！");
            }
        });
    };
    pagecurrent(1);
    // 表格点击事件
    table.on('tool(tbtalkmanage)', function(obj) { //注：tool是工具条事件名，tbtalkmanage是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data;
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var interviewId = obj.data.interviewId;
        var status = obj.data.status;
        // console.log(interviewId);
        if (layEvent === 'endtalk') { //查看
            layer.open({
                type: 1,
                area: ['480px', '360px'],
                title: ['', "background:#fff;border:0"], //'在线调试',
                content: $("#endtalkpopup"),
                shade: [0.2, '#393D49'],
                skin: 'end',
                shadeClose: false,
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
                },
                end: function() {
                    $("#endtalkpopup").hide();
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
                    shadeClose: false,
                    time: 2000,
                    btnAlign: 'c', //按钮居中显示
                    btn: [],
                    yes: function(index, layero) {},
                    end: function() {
                        $("#cannotdel").hide();
                    }
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
                                var pagenum = window.localStorage.getItem("pagenum");
                                pagecurrent(pagenum);
                                layer.msg("删除成功！");
                                layer.close(index);
                            },
                            error: function() {
                                alert("服务器繁忙。删除失败！");
                            }
                        });
                    },
                    end: function() {
                        $("#candel").hide();
                    }
                });
            }
        } else if (layEvent === 'talkdetail') { //编辑
            window.localStorage.setItem("link", "two");
            window.localStorage.setItem("interviewId", interviewId);
            window.localStorage.setItem("status", status);
            window.localStorage.setItem("kind", "talkmanage");
            parent.location.reload();
        }
    });

    // 点击切换访谈预告视频 图片
    $("#addadvance input[name='type']").click(function() {
        var val = $("#addadvance input[name='type']:checked").val();
        // console.log(val);
        $("#addadvance input[type='file']").val("");
        $("#addadvance .afterupcon").show();
        $(".showfile").show();
        $("#addadvance .beforeup").hide();
        if (val == "1") {
            $("#addadvance .upimg").show();
            $("#addadvance .deletefile").show();
            $("#addadvance .upvideo").hide();
            // $(this).next().children(".ddd").addClass("checked");
        } else {
            // $(".ddd").removeClass("checked");
            $("#addadvance .upimg").hide();
            $("#addadvance .upvideo").show();
            $("#addadvance .deletefile").hide();
        }
    });
    // 上传文件
    $("#addadvance input[type='file']").change(function(e) {
        var that = $(this);
        $("#addadvance .afterupcon").hide();
        $("#addadvance .beforeup").show();
        var name = e.currentTarget.files[0].name;
        var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
        $("#addadvance .filename").html(name);
        $("#addadvance .filesize").html("(" + size + ")MB");
    });
    $("input[id='afterfileUp']").change(function(e) {
        $("#beforefileUp").val("");
    });
    $("input[id='afterfileUp0']").change(function(e) {
        $("#beforefileUp0").val("");
    });
    $("#addinlinetalk input[type='file']").change(function(e) {
        var that = $(this);
        $("#addinlinetalk .afterupcon").hide();
        $("#addinlinetalk .beforeup").show();
        var name = e.currentTarget.files[0].name;
        var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
        $("#addinlinetalk .filename").html(name);
        $("#addinlinetalk .filesize").html("(" + size + ")MB");
    });
    $("#addinlinetalk input[name='type']").click(function() {
        var val = $("#addinlinetalk input[name='type']:checked").val();
        // console.log(val);
        $("#addinlinetalk input[type='file']").val("");
        $("#addinlinetalk .afterupcon").show();
        $("#addinlinetalk .beforeup").hide();
        if (val == "1") {
            $(".afterupcon").show();
            $(".showfile").show();
            $("#addinlinetalk .upimg").show();
            $("#addinlinetalk .deletefile").show();
            // $(this).next().children(".ddd").addClass("checked");
        } else {
            $("#addinlinetalk .afterupcon").hide();
            $("#addinlinetalk .upimg").hide();
        }
    });

    $(".deletefile").click(function() {
        $("input[type='file']").val("");
        $(".afterupcon").show();
        $(".beforeup").hide();
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