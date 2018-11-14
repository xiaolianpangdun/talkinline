;
! function() {
    var $ = layui.$,
        form = layui.form;
    var name = window.localStorage.getItem("tkilname");
    var upwd = window.localStorage.getItem("tkilupwd");
    window.localStorage.setItem("backstage", "http://192.168.0.71:8080");
    if (name)
        $(".uname").val(name);
    $(".upwd").val(upwd);
    if (upwd) {
        $("#color-cb").prop("checked", true);
        $(".ddd").addClass("checked");
    }
    $(".uname,.upwd").focus(function(event) {
        $(this).css({
            "border-bottom": "1px solid #4F93FE"
        });
    }).blur(function(event) {
        $(this).css({
            "border-bottom": "1px solid #eee"
        });
    });
    // $(".uname").focus(function(event) {
    //     $(".cancel").show();
    // }).blur(function() {
    //     $(".cancel").hide();
    // });
    // $(".dddd").on("click", ".cancel", function() {
    //     $(".uname").val("").focus();
    // });
    // radio标签改变样式
    $("input[type='checkbox']").click(function() {
        var val = $("input[type='checkbox']:checked").val();
        console.log(val);
        if (val == "1") {
            $(".ddd").addClass("checked");
        } else {
            $(".ddd").removeClass("checked");
        }
    });
    $(".color-cb").click(function() {
        var val = $("input[type='checkbox']:checked").val();
        console.log(val);
    });
    // 登录
    var login = function() {
        var username = $(".uname").val();
        var password = $(".upwd").val();
        if (!username) { layer.msg("用户名不能为空"); return false; }
        if (!password) { layer.msg("密码不能为空"); return false; }
        var url = window.localStorage.getItem("backstage");
        $.ajax({
            type: "post",
            contentType: "application/json;charset=utf-8",
            // dataType: "json",
            url: url + '/user/login',
            data: JSON.stringify({ username: username, password: password }),
            success: function(data) {
                // alert("提交成功");
                console.log(data);
                if (data.code == "200") {
                    layer.msg("登录成功");
                    var val = $("input[type='checkbox']:checked").val();
                    if (val == "1") {
                        window.localStorage.setItem("tkilname", username);
                        window.localStorage.setItem("tkilupwd", password);
                    } else {
                        window.localStorage.setItem("tkilname", username);
                        window.localStorage.setItem("tkilupwd", "");
                    }
                    window.localStorage.setItem("isLogin", true);
                    window.localStorage.setItem("link", "talkmanage");
                    window.localStorage.setItem("adminname", data.result.name);
                    window.location.href = "./one/index.html";
                } else {
                    layer.msg("用户名或密码错误");
                }
                // console.log(data);
            },
            error: function() {
                layer.msg("服务器繁忙，请稍后再试");
            }
        });
    }
    $(".loginsubmit").click(function() { login() });
    $(".upwd").bind('keypress', function() {
        if (event.keyCode == "13") {
            login();
        }
    });
    // form.on('submit(formDemo)', function(data) {
    //     console.log(data);
    // });


    //ie8兼容placeholder

    (function() {
        //仅在不支持 placeholder 的时候执行
        if (!('placeholder' in document.createElement('input'))) {

            var listenerName = 'attachEvent';
            var listenerPrefix = 'on';
            if ('addEventListener' in window) {
                listenerName = 'addEventListener';
                listenerPrefix = '';
            }

            window[listenerName](listenerPrefix + 'load', function() {
                var placeholderListener = {
                    //添加输入项
                    add: function(tagName) {
                        var list = document.getElementsByTagName(tagName);
                        for (var i = 0; i < list.length; i++) {
                            this.render(list[i]);
                        }
                        return this;
                    },
                    //渲染
                    render: function(dom) {
                        var text = dom.getAttribute('placeholder');
                        if (!!text) {
                            this.attachEvent(dom, this.getDiv(dom, text));
                        }
                    },
                    //设置样式
                    getDiv: function(dom, text) {
                        var div = document.createElement('div');

                        div.style.position = 'absolute';
                        div.style.width = this.getPosition(dom, 'Width') + 'px';
                        div.style.height = this.getPosition(dom, 'Height') + 'px';
                        div.style.left = '30px';;
                        div.style.top = this.getPosition(dom, 'Top') + 'px';
                        div.style.color = '#999';
                        div.style.textIndent = '5px';
                        div.style.zIndex = 999;
                        div.style.fontSize = "15px";
                        div.style.background = dom.style.background;
                        div.style.border = dom.style.border;
                        div.style.cursor = 'text';
                        div.innerHTML = text;

                        if ('TEXTAREA' == dom.tagName.toUpperCase()) {
                            div.style.lineHeight = '35px';
                        } else {
                            div.style.lineHeight = div.style.height;
                        }
                        document.querySelector('.lg-right').appendChild(div);
                        return div;
                    },
                    //计算当前输入项目的位置
                    getPosition: function(dom, name, parentDepth) {
                        var offsetName = 'offset' + name;
                        var offsetVal = dom[offsetName];
                        var parentDepth = parentDepth || 0;
                        if (!offsetVal && parentDepth < 3) {
                            offsetVal = this.getPosition(dom.parentNode, name, ++parentDepth);
                        }
                        return offsetVal;
                    },
                    //添加事件
                    attachEvent: function(dom, div) {

                        //激活时，隐藏 placeholder
                        dom[listenerName](listenerPrefix + 'focus', function() {
                            div.style.display = 'none';
                        });

                        //失去焦点时，隐藏 placeholder
                        dom[listenerName](listenerPrefix + 'blur', function(e) {
                            if (e.srcElement.value == '') {
                                div.style.display = '';
                            }
                        });

                        //placeholder 点击时，对应的输入框激活
                        div[listenerName](listenerPrefix + 'click', function(e) {
                            e.srcElement.style.display = 'none';
                            dom.focus();
                        });
                    },

                };

                //防止在 respond.min.js和html5shiv.min.js之前执行
                setTimeout(function() {
                    placeholderListener.add('input').add('textarea');
                }, 50);
            });
        }
    })();
}();