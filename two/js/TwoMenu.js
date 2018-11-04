$(function(){
  /**
   * 日期选择器
   */
    var start = {
      format: 'YYYY/MM/DD hh:mm:ss',
      minDate: $.nowDate(0), //设定最小日期为当前日期
      isinitVal:false,
      festival:false,
      ishmsVal:false,
      festival:false,
      maxDate: '2099-06-30 23:59:59', //最大日期
      format: 'YYYY/MM/DD hh:mm:ss',
      theme:{ bgcolor:"#228EF0",pnColor:"#228EF0"},
      choosefun: function(elem,datas){
          end.minDate = datas; //开始日选好后，重置结束日的最小日期
      }
    };
    var end = {
        format: 'YYYY/MM/DD hh:mm:ss',
        minDate: $.nowDate(0), //设定最小日期为当前日期
        festival: false,
        theme:{ bgcolor:"#228EF0",pnColor:"#228EF0"},
        maxDate: '2099-06-16 23:59:59', //最大日期
        choosefun: function(elem,datas){
            start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
        }
    };

    $('#time1').jeDate(start);
    $('#time2').jeDate(end);


    /**
     * 服务器
     * 访谈id
     * 访谈编号
     */
    var TheServer = 'http://192.168.0.71:8080';  
    var ids = 1;
    


    /**
     * 切换页面
     * 
     * 左边导航切换
     * 
     * 刷新，不改变页面内容
    */
    
    $(".nav li").click(function(){
      var index;

      $(this).addClass('active').siblings().removeClass('active');

      index = $(this).index();

      sessionStorage.setItem("nav",index);

      $(".menu").hide().eq(index).show();

    });

    window.onload = function () {

      var index = sessionStorage.getItem("nav");

      var li = $(".nav li").eq(index);

      li.addClass("active").siblings().removeClass("active");

      $(".menu").hide().eq(index).show();
    }


     

    

    /**
     * 
     * 直播详情 
     * 
     * 数据渲染
     * 
     * 嘉宾列表
     * 
     * 单选框
     * 
     * 访谈场景（单选框）
     */

    // 直播详情 ========== 数据渲染
    $.ajax({
      url: TheServer+'/interview/query',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      data:{
          id: ids
      },
      success:function(data,textStatus,jqXHR){
        
        console.log(data.result)
        // 直播详情的数据渲染
        $('#TalkName').text(data.result.name);
        $('#TalkNumber').text(data.result.interviewId);
        
        // 访谈id  缓存到本地
        var interviewId = data.result.interviewId;
        localStorage.setItem("interviewId",interviewId);


        if(data.result.type == 0){
          $('#TalkScene').text('视频直播');
        }else if(data.result.type == 1){
          $('#TalkScene').text('图文直播');
        }
        $('#compere').text(data.result.compere);
        $('#time1').text(data.result.beginTime);
        $('#time2').text(data.result.endTime);
        $('#text_brief').text(data.result.description);

      },
      error:function(xhr,textStatus){
          // console.log('错误')
          // console.log(xhr)
          // console.log(textStatus)
      },
      complete:function(){
          // console.log('结束')
      }
    })

    // 从本地缓存中去除访谈id
    //var talkNum = localStorage.getItem("interviewId");
    var talkNum = 3;

    // 把嘉宾渲染到选择框
    $.ajax({
      url: TheServer + '/interview/speakers',
      type: 'GET',
      async: true,
      data: {
        interviewId: 22
      },
      success:function(data,textStatus,jqXHR){
        console.log('获取到嘉宾的列表 ======== ',data.result)

        // 网友提问的回复弹窗里面的嘉宾列表
        var select = '';
        
        // 直播详情页面的嘉宾
        var str = '';

        $.each(data.result, function(i, obj) {
          select += '<option value="">'+obj.name+'</option>';
          str += '<p class="guest">'+obj.name+'</P>';
        });
        $("#select_guest").append(select);
        $('.add').before(str);
      },
      error:function(xhr,textStatus){
      },
      complete:function(){
      }
    })

    // 直播详情 =========== 修改访谈场景（单选框）
    $('.radio_item').children('.check_out').click(function(){

      $(this).addClass('image').parent().siblings().children().removeClass('image');

      
      var type_num = $(this).parent().index();
      console.log(type_num)

      if(type_num == 0){
        $('#TalkScene').text('视频直播')
      }else if(type_num == 1){
        $('#TalkScene').text('图文直播')
      }


    });

    // 直播详情 =========== 修改里面的内容 （会议名称、访谈场景、访谈时间、会议简介）
    $('.sure').click(function(){

      var talkname = $('#TalkName').text();
      var talktype = $('#TalkScene').text();
      var begintime = $('#time1').text();
      var endtime = $('#time2').text();
      var talkbrief = $('#text_brief').text();

      if(talktype == '视频直播'){
        talktype = 0;
      }else if(talktype == '图文直播'){
        talktype = 1;
      }

      console.log("会议名称 ========= ",talkname);
      console.log("访谈场景 ========= ",talktype);
      console.log("访谈时间=开始 ========= ",begintime);
      console.log("访谈时间=结束 ========= ",endtime);
      console.log("会议简介 ========= ",talkbrief);

      $.ajax({
        url: TheServer+'/interview/edit',
        type: 'POST',
        dataType: 'json',
        async: true,    //或false,是否异步
        data:{
          interviewId: interviewId,
          name: talkname,
          type: talktype,
          beginTime: begintime,
          endTime: endtime,
          description: talkbrief
        },
        success:function(data,textStatus,jqXHR){
            console.log(data)
        },
        error:function(xhr,textStatus){
        },
        complete:function(){
        }
      })


    });


    /**
     * 用户管理
     * 
     * 数据请求渲染
     * 
     * 点击加入黑名单
     */
    $.ajax({
      url: TheServer+'/interview/visitors',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: {
        interviewId: talkNum,
        currentPage: 1,
        pageSize: 1
      },
      success:function(data,textStatus,jqXHR){

        // 如果请求成功的话
        if(data.code == 200){

          var UserList = data.result.list;

          console.log('用户列表接口请求成功 ======== ',data.result);

          console.log('用户列表 ======== ',UserList);

          $('.viewing_number').text(data.result.size);

          var users = '';
          // 循环遍历把数据渲染到html
          $.each(UserList,function(i,obj){

            users += '<tr>';
            users += '<td>'+obj.name+'</td>';
            users += '<td>'+obj.ip+'</td>';
            users += '<td>'+obj.createTime+'</td>';
            users += '<td><p class="black_list">'+'加入黑名单'+'</p></td>'
            users += '</tr>'

          });
          $('.addtal').append(users);

          // 加入黑名单
          $('.black_list').click(function(){

            var NowUser = $(this).index();

            var ip = UserList[NowUser].ip;
            var visitor = UserList[NowUser].name;

            console.log('黑名单的ip ======== ',ip);
            console.log('黑名单的名字 ======== ',visitor);

            $.ajax({
              url: TheServer+'/blacklist/create',
              type: 'POST',
              //dataType: 'json',
              async: true,
              //contentType: 'application/json;charset=utf-8',
              data: {
                params: '{"ip":"'+ip+'","visitor": "'+visitor+'"}'
                
              },
              success:function(data,textStatus,jqXHR){
                console.log(data)
              },
              error:function(xhr,textStatus){

              },
              complete:function(){

              }
            })




            console.log();

          });

        }
        
      },
      error:function(xhr,textStatus){

      },
      complete:function(){

      }
    });


    
    /**
     * 互动设置
     * 
     * 数据渲染   =======    网友提问/审核回复
     * 
     * 网友提问编辑切换
     * 
     * 审核回复编辑切换
     * 
     * 点击全选
     * 
     * 点击删除
     * 
     * 导航切换
     * 
     * 网友提问 ======== 分页
     * 
     */
    

    // 互动设置  ===== 网友提问
    var currentPage;
    var pageSize;
    $.ajax({
      url: TheServer+'/comments/noaudit',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      async: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        currentPage: 1,
        pageSize: 5
      },
      success:function(data,textStatus,jqXHR){
        
        console.log('网友提问 ========= ',data);

        // 如果成功的话，就执行下面的代码
        if(data.code == 200){

          // 提问列表的数据列表
          var lists = data.result.list;
          console.log('网友提问的数据 ====== ',lists);

          // 创建空数组
          var questions = '';

          // 循环遍历，把数据渲染到html上面
          $.each(lists, function(i, obj) {
            questions += '<div class="questions_main">';
            questions += '<div class="questions_chexbox" style="display: none;" data-id="'+obj.commentId+'">';
            questions += '</div>';
            questions += '<div class="questions_left">';
            questions += '<p style="font-size: 16px;margin-bottom: 6px;">'+obj.visitor;
            questions += '<span>'+obj.createTime+'</span>';
            questions += '</p>';
            questions += '<p class="questions_bottom">'+obj.content+'</p>';
            questions += '</div>';
            questions += '<div class="questions_right">';
            questions += '<p class="InteractionShield" data-id="'+obj.commentId+'">'+'屏蔽'+'</p>';
            questions += '<p style="margin-right: 0;" class="ReviewResponse">'+'审核回复'+'</p>';
            questions += '</div>';
            questions += '</div>';
          });
          
          // 把创建的元素添加到html上面
          $('#questions').append(questions);

          // 网友提问 ==== 分页
          layui.use('laypage', function(){
            var laypage = layui.laypage;
            console.log(data.result.total);
            //执行一个laypage实例
            laypage.render({
              elem: 'QuestionPage',
              count: data.result.total,
              prev: "<<上一页",
              next: "下一页>>",
              curr: location.hash.replace('#!pagenm=', '1'),
              hash: 'fenye',
              theme: '#4597E0',
              limit: 10,
              jump: function(obj, first) {
                  var curr = obj.curr;
                  //得到当前页，以便向服务端请求对应页的数据。
                  // limit = obj.limit; //得到每页显示的条数
                  //window.localStorage.setItem("pagenm", curr);
                  //update(curr, keyWord);
              }
            });
          });


          // 网友提问的复选框
          $('.questions_chexbox').click(function(){

            if($(this).hasClass('chexbox_img')){

              $(this).removeClass('chexbox_img')

            }else{

              $(this).addClass('chexbox_img');

            }
          });
            
            // 点击屏蔽功能
          $('.InteractionShield').click(function(){

            // 获取当前被点击元素的下标
            var nowclick = $(this).parent().parent().index();
            console.log('网友提问，当前点击的下标 ========' ,nowclick);

            // 屏蔽弹框的内容部分  出现
            $('.interaction_shield').css("display","block");

            // 屏蔽的弹窗
            layer.open({
              type: 1,
              area: ['480px', '360px'],
              title: ['', 'background: #fff;border:0'],
              btn: ['确定','取消'],
              skin: 'my-skin',
              btnAlign: 'c',
              content: $('.interaction_shield'),
              cancel: function(index, layero){  // 点击右上角
                $('.interaction_shield').css("display","none");
              },
              yes: function(index, layero){  // 点击确定

                // 获取要传给后台的值
                var commentId =  lists[nowclick-1].commentId;
                var interviewId =  lists[nowclick-1].interviewId;
                var visitor =  lists[nowclick-1].visitor;

                console.log('网友评论，评论ID ======',commentId);
                console.log('网友评论，访谈ID ======',interviewId);
                console.log('网友评论，游客名 ======',visitor);

                // 提交屏蔽
                $.ajax({
                  url: TheServer+'/comments/disable',
                  type: 'POST',
                  dataType: 'json',
                  async: true,
                  contentType: 'application/json;charset=utf-8',
                  data: JSON.stringify({
                    commentId: commentId,
                    interviewId: interviewId,
                    visitor: visitor
                  }),
                  success:function(data,textStatus,jqXHR){
                    console.log(data)
                  },
                  error:function(xhr,textStatus){
                  },
                  complete:function(){
                  }
                })
                
                // 关闭弹窗
                layer.close(index);
                // 隐藏弹窗的内容部分
                $('.interaction_shield').css("display","none");
                // 给设置了屏蔽的信息的屏蔽按钮改变ui样式
                $('.questions_main').eq(nowclick-1).children('.questions_right').children('p').css('color','#9FB1C0');
              },
              btn2: function(index, layero){// 取消

                layer.close(index);
                $('.interaction_shield').css("display","none");
                
              },
            });

          });

          //点击审核回复
          $('.ReviewResponse').click(function(){

            // 审核回复弹窗的内容部分
            $('.review_response').css("display","block");

            // 把网友的提问在打开弹窗的时候就渲染到弹窗上面
            var questionsnow = $(this).parent().parent().index();
            var questions_text = $('.questions_main').eq(questionsnow-1).children('.questions_left').children('.questions_bottom').text();
            // 渲染到弹框上面
            $('.edit_q').text(questions_text);

            console.log('获取到的网友提问 ========= ',questions_text)

            // 网友提问页面的审核回复
            layer.open({
              type: 1,
              area: ['700px', ''],
              title: ['', 'background: #fff;border:0'],
              btn: ['确定','取消'],
              skin: 'my-skin',
              btnAlign: 'c',
              content: $('#review'),
              cancel: function(index, layero){
                $('#review').css("display","none");
              },
              yes: function(index, layero){
                
                var commentId = lists[questionsnow-1].commentId;
                var commentContent = $('.edit_q').text();
                var replyContent = $('#review textarea').val();
                var speakerId = $("#select_guest").get(0).selectedIndex;
                console.log('评论ID =======',commentId);
                console.log('评论内容 =======',commentContent);
                console.log('回复内容 =======',replyContent);
                console.log('回复者嘉宾ID =======',speakerId);

                //点击确定把数据上传
                $.ajax({
                  url: TheServer+'/comments/audit',
                  type: 'POST',
                  dataType: 'json',
                  async: true,
                  contentType: 'application/json;charset=utf-8',
                  data: JSON.stringify({
                    commentId: commentId,
                    commentContent: commentContent,
                    replyContent: replyContent,
                    speakerId: speakerId
                  }),
                  success:function(data,textStatus,jqXHR){
                    console.log(data);

                    // 如果请求成功，修改页面上的问题
                    if(data.code == 200){
                      $('.questions_main').eq(questionsnow-1).children('.questions_left').children('.questions_bottom').text(commentContent);
                    }

                    
                  },
                  error:function(xhr,textStatus){
                  },
                  complete:function(){
                  }
                })

                // 关闭弹框
                layer.close(index);
                $('#review').css("display","none");

              },
              btn2: function(index, layero){// 取消按钮

              layer.close(index);
              $('#review').css("display","none");
                
              },

            });

            // 编辑网友提问的弹框
            $('.editor_question').click(function(){

              $('#response_main').val($('.edit_q').text());

              layer.open({
                type: 1,
                area: ['700px', ''],
                title: ['', 'background: #fff;border:0'],
                btn: ['确定','取消'],
                skin: 'my-skin',
                btnAlign: 'c',
                content: $('#response'),
                cancel: function(index, layero){
                  $('#response').css("display","none");
                },
                yes: function(index, layero){

                  // 获取修改后的问题，重新渲染到上一个弹框
                  var Modified = $('#response_main').val();
                  $('.edit_q').text(Modified)
                  //$('.questions_bottom').text(Modified);
        
                  layer.close(index);
                  $('#response').css("display","none");
        
                },
                btn2: function(index, layero){
                  // 取消按钮
                  layer.close(index);
                  $('#response').css("display","none");
        
                
                },
              });
        
            });

          });
          
        }
        

      },
      
    });

    // 互动设置  ===== 审核回复
    $.ajax({
      url: TheServer+'/comments',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      data:{
        interviewId: talkNum,
        currentPage: 1,
        pageSize: 5
      },
      success:function(data,textStatus,jqXHR){
        
        
        var replyList = data.result.list;
        console.log(replyList);
        var replys = '';

        $.each(replyList,function(i,obj){
          console.log('审核回复的数据 ============ ',replyList)

          replys += '<div class="reply_main" style="border-top: 1px solid #DEE1E6;">';
          replys += '<div class="replys_chexbox" style="display: none;" data-id="'+obj.comment.commentId+'" data-key="'+obj.reply.replyId+'">';
          replys += '</div>';
          replys += '<div class="reply_main-right">'
          replys += '<div class="reply_main_top questions_left">';
          replys += '<p style="font-size: 16px;margin-bottom: 6px;" class="net_friend">'+obj.comment.visitor;
          replys += '<span>'+obj.comment.updateTime+'</span>';
          replys += '</p>'
          replys += '<p class="questions_bottom">'+obj.comment.content+'</p>';
          replys += '</div>';
          replys += '<div class="reply_main_bottom questions_left">';
          replys += '<p style="color: #3199F7;font-size: 16px;">';
          replys += '<span class="administrators">'+obj.reply.speakerId+'</span>'+'回复';
          replys += '<span class="net_friend">'+obj.comment.visitor+'</span>';
          replys += '<span>'+obj.reply.updateTime+'</span>';
          replys += '</p>';
          replys += '<p class="reply_bottom_content">'+obj.reply.content+'</p>';
          replys += '<p class="reply_editor"><img src="'+'../img/edit.png'+'" alt="">'+'编辑'+'</p>';
          replys += '</div>';
          replys += '</div>';
          replys += '</div>';

        });
        $('.reply').append(replys);

        // 复选框
        $('.replys_chexbox').click(function(){

          if($(this).hasClass('chexbox_img')){

            $(this).removeClass('chexbox_img');

          }else{

            $(this).addClass('chexbox_img')

          }

        });
        

        // 点击编辑
        $('.reply_editor').click(function(){

          // 获取现在点击的元素的序号
          var nowreply = $(this).parent().parent().index();

          // 通过下标找到当前的数据
          var nowlist = replyList[nowreply-1];
          console.log('当前下标 =========',nowreply);
          console.log('当前下标对应的数据 ==========',nowlist);

          // 渲染到刚打开的弹框
          $('.001 p').text(nowlist.comment.visitor);
          $('#names_01').val(nowlist.comment.content);

          $('.002 p').text(nowlist.reply.speakerId);
          $('#names_02').val(nowlist.reply.content);


          $('.ReplyEditor').css("display","block");
    
          layer.open({
            type: 1,
            area: ['700px', ''],
            title: ['', 'background: #fff;border:0'],
            btn: ['确定','取消'],
            skin: 'my-skin',
            btnAlign: 'c',
            content: $('.ReplyEditor'),
            cancel: function(index, layero){
              $('.ReplyEditor').css("display","none");
            },
            yes: function(index, layero){

              var commentId = nowlist.comment.commentId;
              var commentContent = $('#names_01').val();
              var replyId = nowlist.reply.replyId;
              var replyContent = $('#names_02').val();

              console.log('评论ID =========',commentId);
              console.log('评论内容 =========',commentContent);
              console.log('回复ID =========',replyId);
              console.log('回复内容 =========',replyContent);

              $.ajax({
                url: TheServer+'/comments/edit',
                type: 'POST',
                dataType: 'json',
                async: true,    //或false,是否异步
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify({
                  commentId: commentId,
                  commentContent: commentContent,
                  replyId: replyId,
                  replyContent: replyContent
                }),
                success:function(data,textStatus,jqXHR){
                  
                  console.log(data);

                  if(data.code == 200){
                    $('.reply_main').eq(nowreply-1).children('.reply_main_top').children('.questions_bottom').text(commentContent);
                    $('.reply_main').eq(nowreply-1).children('.reply_main_bottom').children('.reply_bottom_content').text(replyContent);
                  }
                  
                },
                error:function(xhr,textStatus){
                    // console.log('错误')
                    // console.log(xhr)
                    // console.log(textStatus)
                },
                complete:function(){
                    // console.log('结束')
                }
              })
    
              layer.close(index);
              $('.ReplyEditor').css("display","none");
    
            },
            btn2: function(index, layero){
              // 取消按钮
              layer.close(index);
              $('.ReplyEditor').css("display","none");
    
              
            },
          });
    
        });

      },
      error:function(xhr,textStatus){

      },
      complete:function(){
          // console.log('结束')
      }
    });

    // 网友提问 ==== 打开编辑
    $('.batch_management').click(function(){
      $('.batch_management').css('display','none');
      $('.tool').css('display','block');
      $('.questions_chexbox').css('display','block')
    });

    // 网友提问 ==== 关掉编辑
    $('#questions_cancel').click(function(){
      $('.batch_management').css('display','block');
      $('.tool').css('display','none');
      $('.questions_chexbox').css('display','none');
      $('.questions_chexbox').removeClass('chexbox_img');
    });

    // 审核回复 ==== 打开编辑
    $('.reply_management').click(function(){
      $('.reply_management').css('display','none');
      $('.reply_tool').css('display','block');
      $(".replys_chexbox").css('display','block');
    });

    // 审核回复 ==== 关掉编辑
    $('#ReplyCancel').click(function(){
      $('.reply_management').css('display','block');
      $('.reply_tool').css('display','none');
      $(".replys_chexbox").css('display','none');
    });

    // 网友提问 === 全选
    $('.AllSelct').click(function(){
      $('.questions_chexbox').addClass('chexbox_img');

    });

    // 审核回复 === 全选
    $('.replyAll').click(function(){
      $('.replys_chexbox').addClass('chexbox_img');
    });

    // 网友提问 ===== 删除按钮
    $('#InteractionDelete').click(function(){

      $('.interaction_delete').css("display","block");

      layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.interaction_delete'),
        cancel: function(index, layero){
          $('.interaction_delete').css("display","none");
        },
        yes: function(index, layero){

          // 点击确定删除的时候
          var Questions = $('.questions_chexbox');

          var QuestionsStr = [];

          for(var i = 0; i < Questions.length; i ++){

            if(Questions.eq(i).hasClass('chexbox_img')){

              QuestionsStr.push(Questions[i].getAttribute('data-id'));

            }
            
          }

          var intQuestions = [];

          QuestionsStr.forEach(function(data,index,arr){  
            intQuestions.push(+data);  
          });


          console.log(QuestionsStr);
          console.log(intQuestions);
          
          $.ajax({
            url: TheServer+'/comments/delete',
            type: 'POST',
            dataType: 'json',
            async: true,    //或false,是否异步
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
              commentIds: intQuestions
            }),
            success:function(data,textStatus,jqXHR){
              // 如果请求成功的话

              // if(data.code == 200){

              // }
              
              
              console.log(data)
              
            },
            error:function(xhr,textStatus){
                // console.log('错误')
                // console.log(xhr)
                // console.log(textStatus)
            },
            complete:function(){
                // console.log('结束')
            }
          })
      
         



          layer.close(index);
          $('.interaction_delete').css("display","none");
        },
        btn2: function(index, layero){
            // 取消
          layer.close(index);
          $('.interaction_delete').css("display","none");
        },
      });

    });

    // 审核回复 ===== 删除按钮
    $('#ReplyDelece').click(function(){

      $('.interaction_delete_2').css("display","block");

      layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.interaction_delete_2'),
        cancel: function(index, layero){
          $('.interaction_delete_2').css("display","none");
        },
        yes: function(index, layero){

          // 获取选中的数据
          var AllReply = $('.replys_chexbox');

          var SelectComment = [];

          var SelectReply = [];

          for(var i = 0; i < AllReply.length; i ++){

            if(AllReply.eq(i).hasClass('chexbox_img')){

              SelectComment.push(AllReply[i].getAttribute('data-id'));
              SelectReply.push(AllReply[i].getAttribute('data-key'));

            }
            
          }

          // 字符串数组转化成int整数型数组
          var commentIds = [];
          var replyIds = [];

          SelectComment.forEach(function(data,index,arr){  
            commentIds.push(+data);  
          });
          SelectReply.forEach(function(data,index,arr){  
            replyIds.push(+data);  
          });

          console.log('评论ID数组 ========= ',commentIds);
          console.log('回复ID数组 ========= ',replyIds);



          $.ajax({
            url: TheServer+'/comments/delete',
            type: 'POST',
            dataType: 'json',
            async: true,    //或false,是否异步
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
              commentIds: commentIds,
              replyIds: replyIds
            }),
            success:function(data,textStatus,jqXHR){
              
              console.log(data)
              
            },
            error:function(xhr,textStatus){
                // console.log('错误')
                // console.log(xhr)
                // console.log(textStatus)
            },
            complete:function(){
                // console.log('结束')
            }
          })





          layer.close(index);
          $('.interaction_delete_2').css("display","none");
        },
        btn2: function(index, layero){
            // 取消
          layer.close(index);
          $('.interaction_delete_2').css("display","none");
        },
      });
      
    });

    // 互动设置 ===== 导航切换
    var idx;
    $(".interaction ul li").click(function(){
      $(this).addClass('item3_active').siblings().removeClass('item3_active');
      idx = $(this).index();
      $(".item3>div").hide().eq(idx).show();
    });

    
  


    /**
     * 现场图片
     * 
     * 数据渲染
     * 
     * 编辑状态切换
     * 
     * 点击全选
     * 
     * 上传图片
     */

    // 现场图片  ====== 数据渲染
    $.ajax({
      url: TheServer+'/interview/images',
      type: 'POST',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({
        interviewId: 1,
        pageNum: 1,
        pageSize: 20
      }),
      success:function(data,textStatus,jqXHR){
        // 如果请求成功的话
        if(data.code == 200){

          var ImgList = data.result;

          console.log(ImgList);

          var Img = '';

          console.log(ImgList[0].picUrl);

          $.each(ImgList,function(i,obj){

            Img += '<div class="picture_img">';
            Img += '<div class="picture_chexbox" data-id="'+ImgList[i].picId+'">';
            Img += '</div>';
            Img += '<div class="imagess">';
            Img += '<div class="imagess_main" style="background:url('+TheServer+obj.picUrl+'">'
            Img += '</div>';
            Img += '</div>';
            Img += '<p>'+obj.updateTime+'</p>';
            Img += '</div>';

            console.log(ImgList[0].picId);

          });
          $('.picture_content').append(Img);

          // 复选框
          $('.picture_chexbox').click(function(){

            if($(this).hasClass('chexbox_img')){
              
              $(this).removeClass('chexbox_img');

            }else{

              $(this).addClass('chexbox_img');
            }
          });

          // 点击删除

          

        }
        
        console.log(data.result)
        
      },
      error:function(xhr,textStatus){
          // console.log('错误')
          // console.log(xhr)
          // console.log(textStatus)
      },
      complete:function(){
          // console.log('结束')
      }
    });

    // 打开编辑
    $('.picture_management').click(function(){
      $('.picture_management').css("display","none");
      $('.picture_tool').css("display","block");
      $('.picture_chexbox').css("display","block");
    });

    // 关闭编辑
    $('#PictureCancel').click(function(){
      $('.picture_management').css("display","block");
      $('.picture_tool').css("display","none");
      $('.picture_chexbox').css("display","none");
      $('.picturecheck').removeClass('chexbox_img');
    });
    
    // 点击删除
    $('#PictureDelece').click(function(){

      $('.picture_delece').css("display","block");
      layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.picture_delece'),
        cancel: function(index, layero){
          $('.picture_delece').css("display","none");
        },
        yes: function(index, layero){

          // 点击确定删除的时候
          var deletions = $('.picture_chexbox');

          console.log(deletions)

          var DeletionsStr = [];

          for(var i = 0; i < deletions.length; i ++){

            if(deletions.eq(i).hasClass('chexbox_img')){

              DeletionsStr.push(deletions[i].getAttribute('data-id'));

            }
            
          }

          console.log(DeletionsStr);

          $.ajax({
            url: TheServer+'/interview/removePic',
            type: 'POST',
            dataType: 'json',
            async: true,    //或false,是否异步
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
              "picIds": DeletionsStr
            }),
            success:function(data,textStatus,jqXHR){
              // 如果请求成功的话
              console.log(data);

              if(data.code == 200){



              }
              
            },
            error:function(xhr,textStatus){
                // console.log('错误')
                // console.log(xhr)
                // console.log(textStatus)
            },
            complete:function(){
                // console.log('结束')
            }
          })


          console.log(DeletionsStr)


          layer.close(index);
          $('.picture_delece').css("display","none");
        },
        btn2: function(index, layero){
            // 取消
          layer.close(index);
          $('.picture_delece').css("display","none");
        },
      });

    });
    
    // 全选本页
    $('.imgall').click(function(){
      $('.picture_chexbox').addClass('chexbox_img');
    });


    // 上传图片
    $('.updata').click(function(){



    });







    


    /**
     * 文字实录
     * 
     * 数据渲染
     * 
     * 点击操作
     * 
     * 取消
     * 
     * 删除
     * 
     * 编辑现有的会议内容
     * 
     * 实时录入会议内容
     * 
     */
    
    // 打开编辑
    $('.text_management').click(function(){
      $('.text_management').css("display","none");
      $('.text_tool').css("display","block");
      $('.text_chexbox').css("display","block");
    });

    // 关闭编辑
    $('#TextCancel').click(function(){
      $('.text_management').css("display","block");
      $('.text_tool').css("display","none");
      $('.text_chexbox').css("display","none");
    });

    $('#TextDelece').click(function(){

      $('.text_delece').css("display","block");
      layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.text_delece'),
        cancel: function(index, layero){
          $('.text_delece').css("display","none");
        },
        yes: function(index, layero){
            layer.close(index);
            $('.text_delece').css("display","none");
        },
        btn2: function(index, layero){
            // 取消
          layer.close(index);
          $('.text_delece').css("display","none");
        },
      });

    });
    
    $('.record_edit').click(function(){

      var record_comtent = $('.record_comtent').text();

      $('#TextSelect').val(record_comtent);
      

      $('.text_record_edit').css("display","block");
      layer.open({
        type: 1,
        area: ['700px', '520px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['完成'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.text_record_edit'),
        cancel: function(index, layero){
          $('.text_record_edit').css("display","none");
        },
        yes: function(index, layero){
          $('.record_comtent').text($('#TextSelect').val())
            layer.close(index);
            $('.text_record_edit').css("display","none");
        }
      });

    });

    $('.conference').click(function(){

      $('.real_time').css("display","block");

      layer.open({
        type: 1,
        area: ['700px', '520px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['完成'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.real_time'),
        cancel: function(index, layero){
          $('.real_time').css("display","none");
        },
        yes: function(index, layero){
          //$('.real_time').text($('#TextSelect').val())
            layer.close(index);
            $('.real_time').css("display","none");
        }
      });

    });

    // 复选框
    $('.text_chexbox').click(function(){

      if($(this).hasClass('chexbox_img')){
        
        $(this).removeClass('chexbox_img');

      }else{

        $(this).addClass('chexbox_img');
      }
    });

    // 全选本页
    $('.textall').click(function(){
      $('.text_chexbox').addClass('chexbox_img');
    });


    /**
     * 分页
     * 
     * 用户监控 ==== 分页
     * 
     * 
     * 
     */







  });


/**
 * 直播详情里的弹框
 * 
 * ModifyName ======= 修改会议名称
 * 
 * ModifyScene ====== 修改会议场景
 * 
 * AddGuests ======== 添加嘉宾 
 * 
 * BriefIntroduction == 编辑简介
 * 
 */
function ModifyName(){
    $('.modify_name').css("display","block");

    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定','取消'],
     // shade: 0,
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.modify_name'),
      cancel: function(index, layero){ 
        $('.modify_name').css("display","none");
      },
      yes: function(index, layero){
          // 确定
        var name = $('#Name').val();
        // 判断名称的长度
        if(name.length >25){
          $('.tips').css('display','block');
        }else{
          $('#TalkName').text(name);
          layer.close(index);
          $('.modify_name').css("display","none");
        }
      },
      btn2: function(index, layero){
          // 取消
        layer.close(index);
        $('.modify_name').css("display","none");
      },
    });
};


function ModifyScene(){

    layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.modify_scene'),
        cancel: function(index, layero){ 
            $('.modify_scene').css("display","none");
          },
          yes: function(index, layero){
              layer.close(index);
              $('.modify_scene').css("display","none");
          },
          btn2: function(index, layero){
              // 取消
            layer.close(index);
            $('.modify_scene').css("display","none");
          },
    });

};

function AddGuests(){

    $('.add_guest').css("display","block");

    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定','取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('#add_guest'),
      cancel: function(index, layero){ 
        $('#add_guest').css("display","none");
        $('#Adds').val('');
      },
      yes: function(index, layero){


        var add_name = $('#Adds').val();
        // 判断嘉宾姓名的长度
        if(add_name.length >20){
          $('.tips_2').css('display','block');
        }else{
          layer.close(index);
          $('#add_guest').css("display","none");
          $('#Adds').val('');
        }

      },
      btn2: function(index, layero){
          // 取消
        layer.close(index);
        $('#add_guest').css("display","none");
        $('#Adds').val('');
      },
    });
};

function BriefIntroduction(){

    var old = $('#text_brief').text();
    console.log(old);
    $('#brief').val(old);

    $('.brief_introduction').css("display","block");

    layer.open({
      type: 1,
      area: ['700px', '430px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定','取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.brief_introduction'),
      cancel: function(index, layero){ 
        $('.brief_introduction').css("display","none");
      },
      yes: function(index, layero){

          var news = $('#brief').val();
        
        // 判断简介的长度
        if(news.length >50){
          $('.tips_3').css('display','block');
        }else{
          $('#text_brief').text(news);
          layer.close(index);
          $('.brief_introduction').css("display","none");
        }
      },
      btn2: function(index, layero){
          // 取消
        layer.close(index);
        $('.brief_introduction').css("display","none");
      },
    });

}


