;
! function() {
    var upload = layui.upload;
    var url = window.localStorage.getItem("backstage");
    jQuery.support.cors = true;
    $.ajaxSetup({ cache: false });
    // 点击添加嘉宾弹框
    $(".addguest").click(function() {
        var that = $(this);
        layer.open({
            type: 1,
            area: ['480px', '360px'],
            title: ['', "background:#fff;border:0"], //'在线调试',
            content: $("#addguest"),
            shade: [0.2, '#393D49'],
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
                    html += "<input class='guestlists'value='" + name + "' name='speakername' style='display:none;'>";
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
                    // btn: ['确定'],
                    yes: function(index, layero) {
                        // $.ajax({
                        //     type: 'post',
                        //     // contentType: 'application/form-data;charset=utf-8',
                        //     url: url+'/interview/create',
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
                        $(".selecttype").children(".ddd").removeClass("checked");
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
                    yes: function(index, layero) {},
                    end: function() {
                        $("#addadvance").hide();
                        $("#addadvance input[type='text'],.talkintro").val("");
                        $(".selecttype").children(".ddd").removeClass("checked");
                        $(".showfile").hide();
                    }
                });
            },
            success: function(layero, index) {},
            end: function() {}
        });
    });
    // form表单新建访谈预告
    $(".sss").click(function() {
        var status = 0;
        var name = $("#addadvance .talkname").val();
        var beginTime = $("#addadvance #starttime1").val();
        var endTime = $("#addadvance #endtime1").val();
        var isvideo = $("#addadvance .checked").hasClass("talkvideo");
        if (isvideo) { type = 0 } else { type = 1 };
        var typecheck = $("#addadvance .ddd").hasClass("checked");
        var compere = $("#addadvance input.compere").val();
        var description = $("#addadvance .talkintro").val();
        var length = $(".guestlists").length;
        var file = $("#addadvance input[id='beforefileUp']");
        var filename = file.val();
        if (!name) { layer.msg("请输入访谈名称"); return false; }
        if (!beginTime) { layer.msg("请选择访谈开始时间"); return false; }
        if (!endTime) { layer.msg("请选择访谈结束时间"); return false; }
        if (length < 1) { layer.msg("请选择访谈嘉宾"); return false; }
        if (!compere) { layer.msg("请输入访谈主持人"); return false; }
        if (!description) { layer.msg("请输入访谈简介"); return false; }
        if (!typecheck) { layer.msg("请选择访谈场景"); return false; }
        // if (type == 0 && !file) { layer.msg("请上传访谈视频"); return false; }
        if (filename) {
            var filetype = filename.substring(filename.lastIndexOf(".") + 1);
            filetype = filetype.toLowerCase();
            if (type == 0) {
                if (filetype != "mp4" && filetype != "mvp" && filetype != "mpeg" && filetype != "3gp" && filetype != "mov") {
                    layer.msg("请上传符合格式的视频");
                    return false;
                }
                if (file[0].files)
                    if (file[0].files[0].size / 1024 / 1024 > 300) {
                        layer.msg("您的视频文件超过300兆！");
                        return false;
                    }
            } else {
                if (filetype != "jpg" && filetype != "jpeg" && filetype != "png" && filetype != "gif" && filetype != "bpm") {

                    layer.msg("请上传符合格式的图片");
                    return false;
                }
                if (file[0].files)
                    if (file[0].files[0].size / 1024 / 1024 > 10) {
                        layer.msg("您的图片文件超过10兆！");
                        return false;
                    }
            }

        }
        var reqServer = {
            "status": status,
            "type": type
        };
        $('#formfile').ajaxSubmit({
            forceSync: false,
            url: url + '/interview/create',
            type: 'post',
            dataType: 'json',
            data: reqServer,
            restForm: true,
            clearForm: true,
            success: function(res) {
                // var res = JSON.parse(res);
                console.log(res);
                // if (res.code == 0) {
                pagecurrent(1);
                layer.closeAll();
                // layer.msg("新增成功！");
                // } else {
                layer.msg(res.msg);
                // }
            },
            error: function(res) {
                pagecurrent(1);
                layer.closeAll();
                // layer.msg("");   //ie8文件成功上传但进入error
            }

        })
        return false;
    });
    // form表单新建访谈直播
    $(".sss1").click(function() {
        var status = 1;
        var name = $("#addinlinetalk .talkname").val();
        var beginTime = $("#addinlinetalk #starttime").val();
        var endTime = $("#addinlinetalk #endtime").val();
        var length = $(".guestlists").length;
        var isvideo = $("#addinlinetalk .checked").hasClass("talkvideo");
        var typecheck = $("#addinlinetalk .ddd").hasClass("checked");
        if (isvideo) { type = 0 } else { type = 1 }
        var compere = $("#addinlinetalk input.compere").val();
        var description = $("#addinlinetalk .talkintro").val();
        var file = $("#addinlinetalk input[id='beforefileUp0']");
        var filename = file.val();
        if (!name) { layer.msg("请输入访谈名称"); return false; }
        if (!beginTime) { layer.msg("请选择访谈开始时间"); return false; }
        if (!endTime) { layer.msg("请选择访谈结束时间"); return false; }
        if (length < 1) { layer.msg("请选择访谈嘉宾"); return false; }
        if (!compere) { layer.msg("请输入访谈主持人"); return false; }
        if (!description) { layer.msg("请输入访谈简介"); return false; }
        // console.log(type);
        if (!typecheck) { layer.msg("请选择访谈场景"); return false; }
        // if (type == 0 && (!file)) { layer.msg("请上传访谈视频"); return false; }
        if (filename) {
            var filetype = filename.substring(filename.lastIndexOf(".") + 1);
            filetype = filetype.toLowerCase();
            if (filetype != "jpg" && filetype != "jpeg" && filetype != "png" && filetype != "gif" && filetype != "bpm") {
                layer.msg("请上传符合格式的图片");
                return false;
            }
            if (file[0].files)
                if (file[0].files[0].size / 1024 / 1024 > 10) {
                    layer.msg("您的图片文件超过10兆！");
                    return false;
                }
        }
        var reqServer = {
            "status": status,
            "type": type
        };
        $('#formfile1').ajaxSubmit({
            forceSync: false,
            url: url + '/interview/create',
            type: 'post',
            dataType: 'json',
            data: reqServer,
            restForm: true,
            clearForm: true,
            success: function(res) {
                // console.log(res);
                // if (res.code == 0) {
                pagecurrent(1);
                layer.closeAll();
                // layer.msg("新建成功！");
                // } else {
                layer.msg(res.msg);
                // }
            },
            error: function(res) {
                pagecurrent(1);
                layer.closeAll();
                // layer.msg("");  //ie8进入error， 但是文件上传成功
            }
        })
        return false;
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
    // 手写表格
    function tablerender(pageNum) {
        $.ajax({
            type: "get",
            url: url + '/interview/list?currentPage=' + pageNum + '&pageSize=10',
            success: function(data) {
                var tbody = "";
                $.each(data.data, function(i, obj) {
                    tbody += '<tr>';
                    tbody += '<td>' + obj.interviewId + '</td>';
                    tbody += '<td>' + obj.name + '</td>';
                    if (obj.status == "0") {
                        tbody += '<td style="color:#FF9E00;">未开始</td>';
                        if (obj.type == "0")
                            tbody += '<td>视频预告</td>';
                        if (obj.type == "1")
                            tbody += '<td>图文预告</td>';
                    } else {
                        if (obj.status == "1") {
                            tbody += '<td style="color:#0EB65C;">进行中</td>';
                        } else {
                            tbody += '<td>已结束</td>';
                        }
                        if (obj.type == "0")
                            tbody += '<td>视频访谈</td>';
                        if (obj.type == "1")
                            tbody += '<td>图文访谈</td>';
                    }
                    tbody += '<td><span data-id="' + obj.interviewId + '" data-status="' + obj.status + '" class="table-edit"><img src="../../img/edit.png" alt="">设置访谈详情</span>';
                    if (obj.status == "1") {
                        tbody += '<span data-id="' + obj.interviewId + '" class="table-end">结束访谈</span>';
                    } else {
                        tbody += '<span class="table-end1">结束访谈</span>';
                    }
                    tbody += ' <span data-id="' + obj.interviewId + '" data-status="' + obj.status + '" class="table-remove"><img style="position:relative;top:-2px;" src="../../img/del2.png" alt="">删除</span>';
                    tbody += '</td></tr>';
                });
                $(".table-tbody").html(tbody);
            }
        });
    };
    // 设置访谈详情
    $(".table-tbody").on("click", "span.table-edit", function(event) {
        var that = $(event.target);
        var interviewId = that.attr("data-id");
        var status = that.attr("data-status");
        // console.log(interviewId, status);
        window.localStorage.setItem("link", "two");
        window.localStorage.setItem("interviewId", interviewId);
        window.localStorage.setItem("status", status);
        window.localStorage.setItem("kind", "talkmanage");
        parent.location.reload();
    });
    // 点击结束访谈
    $(".table-tbody").on("click", "span.table-end", function(event) {
        var that = $(event.target);
        var interviewId = that.attr("data-id");
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
                    url: url + '/interview/edit',
                    data: { interviewId: interviewId, status: 2 },
                    success: function(res) {
                        var pagenum = window.localStorage.getItem("pagenum");
                        pagecurrent(pagenum);
                        layer.close(index);
                        layer.msg(res.msg);
                    },
                    error: function(res) {
                        layer.msg("服务器繁忙，请稍后重试！");
                    }
                });
            },
            end: function() {
                $("#endtalkpopup").hide();
            }
        });
    });
    // 点击删除访谈
    $(".table-tbody").on("click", "span.table-remove", function(event) {
        var that = $(event.target);
        var interviewId = that.attr("data-id");
        var status = that.attr("data-status");
        if (status == "1") {
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
                        type: 'get',
                        url: url + '/interview/remove?id=' + interviewId,
                        success: function(res) {
                            var pagenum = window.localStorage.getItem("pagenum");
                            pagecurrent(pagenum);
                            layer.msg(res.msg);
                            layer.close(index);
                        },
                        error: function() {
                            layer.msg("服务器繁忙。删除失败！");
                        }
                    });
                },
                end: function() {
                    $("#candel").hide();
                }
            });
        }
    });
    //分页
    function pagecurrent(pagenum) {
        $.ajax({
            type: "get",
            // dataType: "json",
            url: url + '/interview/list?currentPage=' + pagenum + '&pageSize=10',
            // data: { username: username, password: password },
            success: function(data) {
                // alert("提交成功");
                // console.log(data);
                var count = data.count;
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
                        tablerender(curr);
                    }
                });
            },
            error: function() {
                layer.msg("服务器繁忙,请刷新重试！");
            }
        });
    };
    pagecurrent(1);
    // div标签改变选中样式
    $(".selecttype").click(function() {
        $(".ddd").removeClass("checked");
        $(this).children(".ddd").addClass("checked");
    });
    // 点击切换访谈预告视频 图片
    $("#addadvance .selecttype").click(function() {
        var val = $("#addadvance .selecttype .checked").hasClass("talkvideo");
        // console.log(val);
        $("#addadvance input[type='file']").val("");
        $(".showfile").show();
        $("#addadvance .afterupcon").show();
        $("#addadvance .beforeup").hide();
        $(".uptip").hide();
        if (val == false) {
            $("#addadvance .upfile").hide();
            $("#addadvance .upimg").show();
            // $("#addadvance .deletefile").show();
        } else {
            $("#addadvance .upfile").hide();
            $("#addadvance .upvideo").show();
            // $("#addadvance .deletefile").hide();
        }
    });
    // 上传文件
    $("#addadvance input[type='file']").change(function(e) {
        var val = $(this).val();
        var name = val.substring(val.lastIndexOf("\\") + 1);
        $("#addadvance .upfile").hide();
        $("#addadvance .reupload").show();
        $("#addadvance .beforeup").show();
        $("#addadvance .filename").html(name);
        // var name = e.currentTarget.files[0].name;
        if (e.currentTarget.files) {
            var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
            $("#addadvance .filesize").html("(" + size + "M)");
        }
    });
    // $("input[id='afterfileUp']").change(function(e) {
    //     $("#beforefileUp").val("");
    // });
    // $("input[id='afterfileUp0']").change(function(e) {
    //     $("#beforefileUp0").val("");
    // });
    $("#addinlinetalk input[type='file']").change(function(e) {
        var val = $(this).val();
        var name = val.substring(val.lastIndexOf("\\") + 1);
        $("#addinlinetalk .upfile").hide();
        $("#addinlinetalk .reupload").show();
        $("#addinlinetalk .beforeup").show();
        $("#addinlinetalk .filename").html(name);
        // var name = e.currentTarget.files[0].name;
        if (e.currentTarget.files) {
            var size = (e.currentTarget.files[0].size / 1024 / 1024).toFixed(2);
            $("#addinlinetalk .filesize").html("(" + size + "M)");
        }
    });
    $("#addinlinetalk .selecttype").click(function() {
        // var val = $("#addinlinetalk .selecttype").children(".talkimg").hasClass("checked");
        var val = $("#addinlinetalk .selecttype .checked").hasClass("talkvideo");
        $("#addinlinetalk input[type='file']").val("");
        $("#addinlinetalk .afterupcon").show();
        $("#addinlinetalk .beforeup").hide();
        if (val == false) {
            $(".afterupcon").show();
            $(".showfile").show();
            $("#addinlinetalk .upfile").hide();
            $("#addinlinetalk .upimg").show();
            // $("#addinlinetalk .deletefile").show();
            // $(this).next().children(".ddd").addClass("checked");
        } else {
            $("#addinlinetalk .afterupcon").hide();
            $("#addinlinetalk .upimg").hide();
        }
    });

    $(".deletefile").click(function() {
        $("input[type='file']").val("");
        $(".afterupcon").show();
        $(".upfile").hide();
        if ($("#addinlinetalk .talkimg").hasClass("checked")) {
            $("#addinlinetalk .upimg").show();
        }
        if ($("#addadvance .talkimg").hasClass("checked")) {
            $("#addadvance .upimg").show();
        }
        if ($("#addadvance .talkvideo").hasClass("checked")) {
            $("#addadvance .upvideo").show();
        }
        $(".beforeup").hide();
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