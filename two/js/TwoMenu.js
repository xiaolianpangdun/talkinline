$(function () {

  /**
   * 服务器
   * 
   * 访谈id
   * 
   * 访谈状态
   * 
   */
  var TheServer = 'http://192.168.0.71:8080';

  var talkNum = localStorage.getItem("interviewId");

  var status = localStorage.getItem("status");

  var kind = localStorage.getItem("kind");
  
  console.log('访谈ID ======' ,talkNum);

  console.log('访谈状态 ======' ,status);
  


  /**
   * 日期选择器
   */
  var start = {
    format: 'YYYY/MM/DD hh:mm:ss',
    minDate: $.nowDate(0), //设定最小日期为当前日期
    isinitVal: false,
    festival: false,
    ishmsVal: false,
    festival: false,
    maxDate: '2099-06-30 23:59:59', //最大日期
    format: 'YYYY/MM/DD hh:mm:ss',
    theme: { bgcolor: "#228EF0", pnColor: "#228EF0" },
    choosefun: function (elem, datas) {
      end.minDate = datas; //开始日选好后，重置结束日的最小日期
    }
  };
  var end = {
    format: 'YYYY/MM/DD hh:mm:ss',
    minDate: $.nowDate(0), //设定最小日期为当前日期
    festival: false,
    theme: { bgcolor: "#228EF0", pnColor: "#228EF0" },
    maxDate: '2099-06-16 23:59:59', //最大日期
    choosefun: function (elem, datas) {
      start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
    }
  };

  $('#time1').jeDate(start);
  $('#time2').jeDate(end);



  /**
   * 切换页面
   * 
   * 左边导航切换
   * 
   * 刷新，不改变页面内容
  */

  $(".nav li").click(function () {
    var index;

    $(this).addClass('active').siblings().removeClass('active');

    index = $(this).index();

    sessionStorage.setItem("nav", index);

    $(".menu").hide().eq(index).show();

  });

  // window.onload = function () {

  //   var index = sessionStorage.getItem("nav");

  //   var li = $(".nav li").eq(index);

  //   li.addClass("active").siblings().removeClass("active");

  //   $(".menu").hide().eq(index).show();
  // }

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
   * 添加嘉宾 ====== 弹框
   * 
   * 访谈场景（单选框）
   */

  // 直播详情 ========== 数据渲染
  var DirectSeedingDetails = function(){

    $.ajax({
      url: TheServer + '/interview/query',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      data: {
        id: talkNum
      },
      success: function (data, textStatus, jqXHR) {

        console.log('直播详情 ======= ',data);

        if(data.code == 200){

          // 把获取到的数据保存到本地
          localStorage.setItem('Details',JSON.stringify(data.result));

          // 直播详情的数据渲染
          $('#TalkName').text(data.result.name);
          $('#TalkNumber').text(data.result.interviewId);

          // 访谈场景得渲染
          if (data.result.status == 0) {

            if(data.result.type == 0){
              $('#TalkScene').text('视频预告');
              $('#conversion').text('转为在线视频访谈');
            }else if(data.result.type == 1){
              $('#TalkScene').text('图文预告');
              $('#conversion').text('转为在线图文访谈');
            }
            
          } else if (data.result.status == 1) {

            if (data.result.type == 0) {
              $('#TalkScene').text('视频直播');
            } else if (data.result.type == 1) {
              $('#TalkScene').text('图文直播');
            }

            $('#conversion').css('display','none');

            $('.nav li.status_0').removeClass('status_0').css('display','block');

            $('.ddd').css('display','none');

            $('.status_0_li').text("直播详情");

            
          }else if(data.result.status == 2){

            if (data.result.type == 0) {
              $('#TalkScene').text('视频直播');
            } else if (data.result.type == 1) {
              $('#TalkScene').text('图文直播');
            }

          }
          
          $('#compere').text(data.result.compere);
          $('.time1').text(data.result.beginTime);
          $('.time2').text(data.result.endTime);
          $('#text_brief').text(data.result.description);

          // 预告详情里面的 上传图文和视频
          if( $('.video_0').text() == '图片'){

            if(data.result.prePicUrl != null){

              $('.vedio_link').text(data.result.prePicUrl);

              $('.uplink span').text('重新上传');

            }else if(data.result.prePicUrl == null){

              $('.vedio_link').text('无文件/');

              $('.uplink span').text('请上传文件');

            }

            
          }else if( $('.video_0').text() == '视频'){


            if(data.result.preVideoUrl != null){

              $('.vedio_link').text(data.result.preVideoUrl);
              $('.uplink').text('重新上传');

            }else if(data.result.preVideoUrl == null){

              $('.vedio_link').text('无文件/');

              $('.uplink').text('请上传视频文件');


            }

          };


        }
  
        
        
      },
      error: function (xhr, textStatus) {
      },
      complete: function () {
      }
    })

  };
  DirectSeedingDetails();

  // 把嘉宾渲染到选择框
  var ADD = function(){

    $.ajax({
      url: TheServer + '/interview/speakers',
      type: 'GET',
      async: true,
      data: {
        interviewId: talkNum
      },
      success: function (data, textStatus, jqXHR) {
        console.log('获取到嘉宾的列表 ======== ', data.result)
  
        localStorage.setItem("Speak",JSON.stringify(data.result));
  
        // 网友提问的回复弹窗里面的嘉宾列表
        var select = '';
  
        // 直播详情页面的嘉宾
        var str = '';
  
        var TextSe = '';
  
        var Test = '';
  
        $.each(data.result, function (i, obj) {
          select += '<option value="">' + obj.name + '</option>';
          
          str += '<p class="guest">';
          str += '<span>'+obj.name+'</span>';
          str += '<img src="'+'../img/cancel_02.png'+'" alt="" style="margin-left: 10px;margin-top: -3px;" class="removes"></p>'

  
          TextSe += '<option value="'+obj.speakerId+'">' + obj.name + '</option>';
  
          Test += '<option value="'+obj.speakerId+'">' + obj.name + '</option>';
  
        });
  
        $("#select_guest").append(select);
        $('.guest_list').html(str);
        $("#text_s").html(TextSe);
        $("#text_ss").html(Test);

        $('.removes').click(function(){

          var remove_inx = $(this).parent().index();

          console.log(remove_inx);

          $('.guest').eq(remove_inx).remove();

        });

      },
      error: function (xhr, textStatus) {
      },
      complete: function () {
      }
    })

  };
  ADD();

  // 直播详情 =========== 修改访谈场景（单选框）
  $('.radio_item').children('.check_out').click(function () {

    $(this).addClass('image').parent().siblings().children().removeClass('image');


    var type_num = $(this).parent().index();
    console.log(type_num);

    // var Details = localStorage.getItem("Details");
    // var detail = JSON.parse(Details);

    //console.log(detail);

    if(kind == "talkmanage"){

      if(status == 0){

        if (type_num == 0) {
          $('#TalkScene').text('视频预告');
          $('.video_0').text('视频');
          $('#conversion').text('转为在线视频访谈');
    
        } else if (type_num == 1) {
          $('#TalkScene').text('图文预告');
          $('.video_0').text('图片');
          $('#conversion').text('转为在线图文访谈');
        }

      }else if(status == 1){

        if (type_num == 0) {
          $('#TalkScene').text('视频直播');
          $('.video_0').text('视频');
    
        } else if (type_num == 1) {
          $('#TalkScene').text('图文直播');
          $('.video_0').text('图片');
        }

      }

      

    }

    


  });

  //添加嘉宾 ====== 弹框
  $("#AddGuests").click(function () {

    $('.add_guest').css("display", "block");

    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('#add_guest'),
      cancel: function (index, layero) {
        $('#add_guest').css("display", "none");
        $('#Adds').val('');
      },
      yes: function (index, layero) {

        // 获取input里面的val值
        var speakername = $('#Adds').val();

        // 判断嘉宾姓名的长度
        if (speakername.length > 20) {

          $('.tips_2').css('display', 'block');

        } else {
          layer.close(index);

          $('#add_guest').css("display", "none");

          // 添加到html上面
          var guests = '';

          guests += '<p class="guest">';
          guests += '<span>'+speakername+'</span>';
          guests += '<img src="'+'../img/cancel_02.png'+'" alt="" style="margin-left: 10px;margin-top: -3px;" class="removes"></p>'

          $('.guest_list').append(guests);

          $('#Adds').val('');

          $('.removes').click(function(){

            var remove_inx = $(this).parent().index();

            console.log(remove_inx);

            $('.guest').eq(remove_inx).remove();

          });

        }

      },
      btn2: function (index, layero) {
        // 取消
        layer.close(index);
        $('#add_guest').css("display", "none");
        $('#Adds').val('');
      },
    });

  });

  // 直播详情 =========== 修改里面的内容 （会议名称、访谈场景、访谈时间、会议简介）
  $('.ascertaining_modification').click(function () {

    var talkname = $('#TalkName').text();
    var talktype = $('#TalkScene').text();
    var begintime = $('#time1').text();
    var endtime = $('#time2').text();
    var talkbrief = $('#text_brief').text();

    if (talktype == '视频直播') {
      talktype = 0;
    } else if (talktype == '图文直播') {
      talktype = 1;
    }

    var AddText = $('.guest');
    var AddSpeaker = [];

    //console.log(AddText);

    for(var i = 0; i < AddText.length; i ++){

      var guest_text = AddText.eq(i).children('span');
      console.log(guest_text);

      for(var o = 0; o < guest_text.length; o ++){

        AddSpeaker.push(guest_text[o].innerHTML);


      }

      
    };

    console.log("会议名称 ========= ", talkname);
    console.log("访谈场景 ========= ", talktype);
    console.log("访谈时间=开始 ========= ", begintime);
    console.log("访谈时间=结束 ========= ", endtime);
    console.log("会议简介 ========= ", talkbrief);
    console.log('添加嘉宾 ========= ',AddSpeaker);

    $.ajax({
      url: TheServer + '/interview/edit',
      type: 'POST',
      dataType: 'json',
      async: true,
      traditional: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        name: talkname,
        type: talktype,
        beginTime: begintime,
        endTime: endtime,
        description: talkbrief,
        speakername: AddSpeaker
      },
      success: function (data, textStatus, jqXHR) {
        console.log(data)
        if(data.code == 200){
          //DirectSeedingDetails();
          // 再次调嘉宾列表
          ADD();
          layer.msg("修改成功");
        };
      },
      error: function (xhr, textStatus) {
      },
      complete: function () {
      }
    })


  });

  // 直播详情 ====== 上传视频
  $('#UpPreview').change(function(e){

    var files = e.currentTarget.files[0].name;

    var talktype = $('#TalkScene').text();

    if (talktype == '视频直播') {

      talktype = 0;

    } else if (talktype == '图文直播') {

      talktype = 1;

    }

    $.ajaxFileUpload({
      url: TheServer + '/interview/edit',
      type: 'POST',
      secureuri: false, //一般设置为false
      fileElementId: "UpPreview", //文件上传空间的id属性
      dataType: 'JSON',
      traditional: true,
      contentType: 'application/json;charset=utf-8',
      data: {
        interviewId: talkNum,
        type: talktype,
        file: files
      },
      
      success: function(data, status){

        console.log(status)

        if(status == 'success'){
          DirectSeedingDetails();
          layer.msg('上传成功');
        }

      },
      error: function(data, status, e){
        //layer.close(index);
        console.log(data);

      }
    });

    // $.ajax({
    //   url: TheServer + '/interview/edit',
    //   type: 'POST',
    //   dataType: 'json',
    //   async: true,
    //   traditional: true,    //或false,是否异步
    //   data: {
    //     interviewId: talkNum,
    //     type: talktype,
    //     file: files
    //   },
    //   success: function (data, textStatus, jqXHR) {
    //     console.log(data)
    //     if(data.code == 200){

    //       DirectSeedingDetails();

    //       // $('.vedio_link').html();
    //       // $('.uplink span').html('重新上传');
         
    //       layer.msg("修改成功");
    //     };
    //   },
    //   error: function (xhr, textStatus) {
    //   },
    //   complete: function () {
    //   }
    // })



    
    console.log('选择文件的名称 ========', files);

  });

  // 直播详情 ====== 转为在线访谈
  $('#conversion').click(function(){
    

    if( $('#TalkScene').text() == '视频预告' ){

      // 从本地拿出直播详情页面的数据

      var Details = localStorage.getItem("Details");
      var detail = JSON.parse(Details);
      //console.log(detail);

      if( detail.preVideoUrl != null ){

        $('.conversion p').text('是否确认将访谈预告转为在线视频访谈')

        $('.conversion').css("display", "block");

        layer.open({
          type: 1,
          area: ['480px', '360px'],
          title: ['', 'background: #fff;border:0'],
          btn: ['确定', '取消'],
          skin: 'my-skin',
          btnAlign: 'c',
          content: $('.conversion'),
          cancel: function (index, layero) {
            $('.conversion').css("display", "none");
          },
          yes: function (index, layero) {

            $.ajax({
              url: TheServer + '/interview/edit',
              type: 'POST',
              dataType: 'json',
              async: true,
              traditional: true,    //或false,是否异步
              data: {
                interviewId: talkNum,
                status: 1,
                type: 0
              },
              success: function (data, textStatus, jqXHR){
                console.log(data);
                if(data.code == 200){

                  DirectSeedingDetails();

                  
                };
              },
            });

            layer.close(index);
            $('.conversion').css("display", "none");
    
          },
          btn2: function (index, layero) {
            // 取消
            layer.close(index);
            $('.conversion').css("display", "none");

          },
        });

        

      }else{

        alert('要转为在线直播视频的话，得先上传预告视频');

      }

    }else if($('#TalkScene').text() == '图文预告'){

      $('.conversion p').text('是否确认将访谈预告转为在线视频访谈')

        $('.conversion').css("display", "block");

        layer.open({
          type: 1,
          area: ['480px', '360px'],
          title: ['', 'background: #fff;border:0'],
          btn: ['确定', '取消'],
          skin: 'my-skin',
          btnAlign: 'c',
          content: $('.conversion'),
          cancel: function (index, layero) {
            $('.conversion').css("display", "none");
          },
          yes: function (index, layero) {

            $.ajax({
              url: TheServer + '/interview/edit',
              type: 'POST',
              dataType: 'json',
              async: true,
              traditional: true,    //或false,是否异步
              data: {
                interviewId: talkNum,
                status: 1,
                type: 1
              },
              success: function (data, textStatus, jqXHR){
                console.log(data);
      
                if(data.code == 200){
      
                  DirectSeedingDetails();
                  layer.msg("操作成功")

                }
              },
            });

            layer.close(index);
            $('.conversion').css("display", "none");
    
          },
          btn2: function (index, layero) {
            // 取消
            layer.close(index);
            $('.conversion').css("display", "none");

          },
        });

      


    }

  });

  // 直播详情 ==== 复制
  $('.Coyp_1').click(function(e){

    var content = document.getElementById('test');
    content.select();
    document.execCommand('Copy');

    layer.msg('复制成功');

  });
  $('.Coyp_2').click(function(e){

    var content = document.getElementById('test1');
    content.select();
    document.execCommand('Copy');

    layer.msg('复制成功');

  });



  /**
   * 用户管理
   * 
   * 数据请求渲染
   * 
   * 分页
   * 
   * 加入黑名单
   */

  // 用户管理 ======= 用户列表
  var UserNow = 1;

  var UserList = function(UserNow){
    $.ajax({
      url: TheServer + '/interview/visitors',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: {
        interviewId: talkNum,
        currentPage: UserNow,
        pageSize: 12
      },
      success: function (data, textStatus, jqXHR) {
        
        // 如果请求成功的话
        if (data.code == 200) {
  
          var UserList = data.result.list;

          //localStorage.setItem('UserS',JSON.stringify(data.result.list));
  
          console.log('用户列表接口请求成功 ======== ', data.result);
  
          console.log('用户列表 ======== ', UserList);
  
          var users = '';
          // 循环遍历把数据渲染到html
          $.each(UserList, function (i, obj) {
  
            users += '<tr>';
            users += '<td>' + obj.name + '</td>';
            users += '<td>' + obj.ip + '</td>';
            users += '<td>' + obj.createTime + '</td>';
            users += '<td><p class="black_list" data-ip="'+obj.ip+'" data-name="'+obj.name+'">' + '加入黑名单' + '</p></td>'
            users += '</tr>'
  
          });
          $('.tab_tr').html(users);
  
          // 加入黑名单
          // $('.black_list').click(function () {
  
          //   var NowUser = $(this).parent().parent().index();
          //   console.log($(this));
          //   console.log(NowUser);
  
          //   var ip = UserList[NowUser].ip;
          //   var visitor = UserList[NowUser].name;
  
          //   console.log('黑名单的ip ======== ', ip);
          //   console.log('黑名单的名字 ======== ', visitor);
  
          //   $.ajax({
          //     url: TheServer + '/blacklist/create',
          //     type: 'POST',
          //     async: true,
          //     data: {
          //       params: '{"ip":"' + ip + '","visitor": "' + visitor + '"}'
  
          //     },
          //     success: function (data, textStatus, jqXHR) {
          //       console.log(data)
          //       if(data.code == 200){

          //         $('tbody tr').eq(NowUser).css('display','none');
          //         // UserList(UserNow);
          //         // UserPage(UserNow);
          //       };
          //     },
          //     error: function (xhr, textStatus) {
  
          //     },
          //     complete: function () {
  
          //     }
          //   })
  
          // });
  
        }
  
      },
      error: function (xhr, textStatus) {
  
      },
      complete: function () {
  
      }
    });
  };

  // 用户管理 ===== 分页
  var UserPage = function(UserNow){

    $.ajax({
      url: TheServer + '/interview/visitors',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: {
        interviewId: talkNum,
        currentPage: UserNow,
        pageSize: 12
      },
      success: function (data, textStatus, jqXHR){

        layui.use('laypage', function(){

          var laypage = layui.laypage;

          laypage.render({
            elem: 'UserPage'
            ,count: data.result.total
            ,theme: '#4597E0'
            ,curr: location.hash.replace('#!UserNow=', UserNow)
            ,hash: 'UserNow'
            ,limit: 12
            ,jump: function(obj, first){

              localStorage.setItem("UserNow",obj.curr);
              
              UserList(obj.curr)
              
            }
          });
        });

      },
    });

  };

  UserPage(UserNow);

  // 加入黑名单的接口
  var AddBlack = function(ip,visitor){

    var iP = ip;
    var visitor = visitor;

    $.ajax({
      url: TheServer + '/blacklist/create',
      type: 'POST',
      async: true,
      data: {
        params: '{"ip":"' + ip + '","visitor": "' + visitor + '"}'
      },
      success: function (data, textStatus, jqXHR) {
        console.log(data)
        if(data.code == 200){

          //$('tbody tr').eq(NowUser).css('display','none');
          UserList(UserNow);
          UserPage(UserNow);
          layer.msg(visitor + "已被加入黑名单");
        };
      },
      error: function (xhr, textStatus) {

      },
      complete: function () {

      }
    })
    

  };

  // 用户管理 ==== 点击加入黑名单
  $('.tab_tr').click(function(event){

    var event = event || window.event;
　  var target = event.target || event.srcElement;

    var ip = target.getAttribute('data-ip');
    var visitor = target.getAttribute('data-name');

    switch(target.className){
      case 'black_list':
      AddBlack(ip,visitor);
      break;
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
  var ProblemCurr = 1;

  var ProblemList = function(ProblemCurr){
    $.ajax({
      url: TheServer + '/comments/noaudit',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      async: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        currentPage: ProblemCurr,
        pageSize: 5
      },
      success: function (data, textStatus, jqXHR) {
        
        // 如果成功的话，就执行下面的代码
        if (data.code == 200) {
            
          // 提问列表的数据列表
          var lists = data.result.list;
          console.log('网友提问的列表 ========== ',lists);
            
          // 创建空数组
          var questions = '';
  
          // 循环遍历，把数据渲染到html上面
          $.each(lists, function (i, obj) {
            questions += '<div class="questions_main">';
            questions += '<div class="questions_chexbox" style="display: none;" data-id="' + obj.commentId + '">';
            questions += '</div>';
            questions += '<div class="questions_left">';
            questions += '<p style="font-size: 16px;margin-bottom: 6px;">' + obj.visitor;
            questions += '<span>' + obj.createTime + '</span>';
            questions += '</p>';
            questions += '<p class="questions_bottom">' + obj.content + '</p>';
            questions += '</div>';
            questions += '<div class="questions_right">';
            questions += '<p class="InteractionShield">' + '屏蔽' + '</p>';
            questions += '<p style="margin-right: 0;" class="ReviewResponse" data-id="' + obj.commentId + '" data-index="' + i + '">' + '审核回复' + '</p>';
            questions += '</div>';
            questions += '</div>';
          });
  
          // 把创建的元素添加到html上面
          $('#aaaa').html(questions);

          if( $('.tool').css("display") == 'none'){

            $('.questions_chexbox').css('display','none')
  
          }else if( $('.tool').css("display") == 'block' ){
  
            $('.questions_chexbox').css('display','block')
  
          };
  
          // 网友提问的复选框
          $('.questions_chexbox').click(function () {
  
            if ($(this).hasClass('chexbox_img')) {
  
              $(this).removeClass('chexbox_img')
  
            } else {
  
              $(this).addClass('chexbox_img');
  
            }
          });
  
          // 点击屏蔽功能
          $('.InteractionShield').click(function () {
  
            // 获取当前被点击元素的下标
            var nowclick = $(this).parent().parent().index();
            console.log('网友提问，当前点击的下标 ========', nowclick);
  
            // 屏蔽弹框的内容部分  出现
            $('.interaction_shield').css("display", "block");
  
            // 屏蔽的弹窗
            layer.open({
              type: 1,
              area: ['480px', '360px'],
              title: ['', 'background: #fff;border:0'],
              btn: ['确定', '取消'],
              skin: 'my-skin',
              btnAlign: 'c',
              content: $('.interaction_shield'),
              cancel: function (index, layero) {  // 点击右上角
                $('.interaction_shield').css("display", "none");
              },
              yes: function (index, layero) {  // 点击确定
  
                // 获取要传给后台的值
                console.log(lists);
                var commentId = lists[nowclick].commentId;
                //var interviewId = lists[nowclick].interviewId;
                var visitor = lists[nowclick].visitor;
  
                console.log('网友评论，评论ID ======', commentId);
                console.log('网友评论，访谈ID ======', interviewId);
                console.log('网友评论，游客名 ======', visitor);
  
                // 提交屏蔽
                $.ajax({
                  url: TheServer + '/comments/disable',
                  type: 'POST',
                  dataType: 'json',
                  async: true,
                  contentType: 'application/json;charset=utf-8',
                  data: JSON.stringify({
                    commentId: commentId,
                    interviewId: talkNum,
                    visitor: visitor
                  }),
                  success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if(data.code == 200){
                     $('.questions_right').eq(nowclick).children('p').css('border','1px solid #E8EFF1');
                      
                     $('.questions_right').eq(nowclick).children('p').css('color','#E8EFF1');

                    $('#InteractionShield').removeAttr("id");
                    $('#ReviewResponse').removeClass("class");

                    layer.msg("屏蔽成功")
                    }
                  },
                  error: function (xhr, textStatus) {
                  },
                  complete: function () {
                  }
                })
  
                // 关闭弹窗
                layer.close(index);
                // 隐藏弹窗的内容部分
                $('.interaction_shield').css("display", "none");
                // 给设置了屏蔽的信息的屏蔽按钮改变ui样式
                $('.questions_main').eq(nowclick - 1).children('.questions_right').children('p').css('color', '#9FB1C0');
              },
              btn2: function (index, layero) {// 取消
  
                layer.close(index);
                $('.interaction_shield').css("display", "none");
  
              },
            });
  
          });
  
          //点击审核回复
          // $('.ReviewResponse').click(function () {
  
          //   // 审核回复弹窗的内容部分
          //   $('.review_response').css("display", "block");
  
          //   // 把网友的提问在打开弹窗的时候就渲染到弹窗上面
          //   var questionsnow = $(this).parent().parent().index();
          //   var questions_text = $('.questions_main').eq(questionsnow).children('.questions_left').children('.questions_bottom').text();

          //   // 渲染到弹框上面
          //   $('.edit_q').text(questions_text);

          //   console.log(questionsnow);
  
          //   console.log('获取到的网友提问 ========= ', questions_text)
  
          //   // 网友提问页面的审核回复
          //   layer.open({
          //     type: 1,
          //     area: ['700px', ''],
          //     title: ['', 'background: #fff;border:0'],
          //     btn: ['确定', '取消'],
          //     skin: 'my-skin',
          //     btnAlign: 'c',
          //     content: $('#review'),
          //     cancel: function (index, layero) {
          //       $('#review').css("display", "none");
          //     },
          //     yes: function (index, layero) {

          //       var Speak = localStorage.getItem("Speak");

          //       var speaker = JSON.parse(Speak);
  
          //       var commentId = lists[questionsnow].commentId;
          //       var commentContent = $('.edit_q').text();
          //       var replyContent = $('#review textarea').val();
          //       var speakerinx = $("#select_guest").get(0).selectedIndex;
          //       var speakerId = speaker[speakerinx].speakerId;
          //       var speakername = speaker[speakerinx].name;

          //       //var speakerName = 
          //       console.log('评论ID =======', commentId);
          //       console.log('评论内容 =======', commentContent);
          //       console.log('回复内容 =======', replyContent);
          //       console.log('回复者嘉宾ID =======', speakerId);
          //       console.log('回复者嘉宾名字 =======', speakername);
  
          //       //点击确定把数据上传
          //       $.ajax({
          //         url: TheServer + '/comments/audit',
          //         type: 'POST',
          //         dataType: 'json',
          //         async: true,
          //         contentType: 'application/json;charset=utf-8',
          //         data: JSON.stringify({
          //           commentId: commentId,
          //           commentContent: commentContent,
          //           replyContent: replyContent,
          //           speakerId: speakerId,
          //           speakerName: speakername
          //         }),
          //         success: function (data, textStatus, jqXHR) {
          //           console.log(data);
  
          //           // 如果请求成功，修改页面上的问题
          //           if (data.code == 200) {
          //             $('.questions_main').eq(questionsnow).children('.questions_left').children('.questions_bottom').text(commentContent);
          //             $('.questions_main').eq(questionsnow).css('display','none');
          //           }
  
  
          //         },
          //         error: function (xhr, textStatus) {
          //         },
          //         complete: function () {
          //         }
          //       })
  
          //       // 关闭弹框
          //       layer.close(index);
          //       $('#review').css("display", "none");
  
          //     },
          //     btn2: function (index, layero) {// 取消按钮
  
          //       layer.close(index);
          //       $('#review').css("display", "none");
  
          //     },
  
          //   });
  
          //   // 编辑网友提问的弹框
          //   $('.editor_question').click(function () {
  
          //     $('#response_main').val($('.edit_q').text());
  
          //     layer.open({
          //       type: 1,
          //       area: ['700px', ''],
          //       title: ['', 'background: #fff;border:0'],
          //       btn: ['确定', '取消'],
          //       skin: 'my-skin',
          //       btnAlign: 'c',
          //       content: $('#response'),
          //       cancel: function (index, layero) {
          //         $('#response').css("display", "none");
          //       },
          //       yes: function (index, layero) {
  
          //         // 获取修改后的问题，重新渲染到上一个弹框
          //         var Modified = $('#response_main').val();
          //         $('.edit_q').text(Modified)
          //         //$('.questions_bottom').text(Modified);
  
          //         layer.close(index);
          //         $('#response').css("display", "none");
  
          //       },
          //       btn2: function (index, layero) {
          //         // 取消按钮
          //         layer.close(index);
          //         $('#response').css("display", "none");
  
  
          //       },
          //     });
  
          //   });
  
          // });
          
  
        }
      },
  
    });
  };
  
  // 网友提问 ===== 分页
  var ProblemPage = function(ProblemCurr){

    $.ajax({
      url: TheServer + '/comments/noaudit',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      async: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        currentPage: ProblemCurr,
        pageSize: 5
      },
      success: function (data, textStatus, jqXHR){

        if(data.code == 200){

          layui.use('laypage', function(){

            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
              elem: 'QuestionPage'
              ,count: data.result.total//数据总数，从服务端得到
              ,theme: '#4597E0'
              ,curr: location.hash.replace('#!ProblemCurr=', ProblemCurr)
              ,hash: 'ProblemCurr'
              ,limit: 5
              ,jump: function(obj, first){
                
                localStorage.setItem("ProblemCurr",obj.curr);
                
                ProblemList(obj.curr)
                
              }
            });
          });

        }

      },
    });
  };

  // 判断访谈状态 只有在预告和直播中的时候才运行
  if(kind == "talkmanage"){

    if(status == 0 || status == 1){

      ProblemPage(ProblemCurr);
  
    }

  };
  
  // 互动设置  ===== 审核回复
  var ReplyCurr = 1;

  var ReplyList = function(ReplyCurr){
    $.ajax({
      url: TheServer + '/comments',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        currentPage: ReplyCurr,
        pageSize: 5
      },
      success: function (data, textStatus, jqXHR) {

        if(data.code == 200){

          var replyList = data.result.list;
          console.log('审核回复列表 ============ ',replyList);


         var replys = '';

          $.each(replyList, function (i, obj) {

            console.log('审核回复的数据 ============ ', replyList)

            // 先获取当前这条数据的嘉宾id
            var speakernames = replyList[i].reply.speakerId;

            console.log(speakernames);

            // 从本地储存里面拿出嘉宾列表
            var speak = localStorage.getItem("Speak");
            var speaker = JSON.parse(speak);

            //console.log(speaker);

            var now = [];

            // 循环嘉宾列表把id相等的数据的名字拿出来
            for(var c = 0; c < speaker.length; c ++){
              //console.log(speaker[c].speakerId)
              if(speaker[c].speakerId == speakernames){

                now.push(speaker[c].name);
                

              }
            }

            replys += '<div class="reply_main" style="border-top: 1px solid #DEE1E6;">';
            replys += '<div class="replys_chexbox" style="display: none;" data-id="' + obj.comment.commentId + '" data-key="' + obj.reply.replyId + '">';
            replys += '</div>';
            replys += '<div class="reply_main-right">'
            replys += '<div class="reply_main_top questions_left">';
            replys += '<p style="font-size: 16px;margin-bottom: 6px;" class="net_friend">' + obj.comment.visitor;
            replys += '<span>' + obj.comment.updateTime + '</span>';
            replys += '</p>'
            replys += '<p class="questions_bottom">' + obj.comment.content + '</p>';
            replys += '</div>';
            replys += '<div class="reply_main_bottom questions_left">';
            replys += '<p style="color: #3199F7;font-size: 16px;">';
            replys += '<span class="administrators">' + now + '</span>' + '回复';
            replys += '<span class="net_friend">' + obj.comment.visitor + '</span>';
            replys += '<span>' + obj.reply.updateTime + '</span>';
            replys += '</p>';
            replys += '<p class="reply_bottom_content">' + obj.reply.content + '</p>';
            replys += '<p class="reply_editor" data-commentId="'+obj.comment.commentId+'" data-replyId="'+obj.reply.replyId+'"  data-index="'+i+'"><img src="' + '../img/edit.png' + '" alt="">' + '编辑' + '</p>';
            replys += '</div>';
            replys += '</div>';
            replys += '</div>';

            
                  
          });

          $('#bbbb').html(replys);

          //如果是预告和在线就把编辑按钮隐藏
          // if(kind == "talkmanage"){

          //   if(status == 1){

          //     console.log('执行了');

          //     for(var i = 0; i < $('.reply_main').length; i ++){

          //       $('.reply_main').eq(i).find('reply_editor').text('heh');

          //     }

          //   }

          // }

          // 判断编辑是否打开，是打开的就打开复选框
          if( $('.reply_tool').css("display") == 'none'){

            $('.replys_chexbox').css('display','none')
  
          }else if( $('.reply_tool').css("display") == 'block' ){
  
            $('.replys_chexbox').css('display','block')
  
          };


        
  
          // 复选框
          $('.replys_chexbox').click(function () {
    
            if ($(this).hasClass('chexbox_img')) {
    
              $(this).removeClass('chexbox_img');
    
            } else {
    
              $(this).addClass('chexbox_img')
    
            }
    
          });
        
          // 访谈状态  是历史访谈的时候才执行
          if(status == 2){

            // 点击编辑
            $('.reply_editor').click(function () {
      
              // 获取现在点击的元素的序号
              var nowreply = $(this).parent().parent().parent().index();
      
              // 通过下标找到当前的数据
              var nowlist = replyList[nowreply];
              console.log('当前下标 =========', nowreply);
              console.log('当前下标对应的数据 ==========', nowlist);
      
              // 渲染到刚打开的弹框
              $('.001 p').text(nowlist.comment.visitor);
              $('#names_01').val(nowlist.comment.content);
      
              $('.002 p').text($('.administrators').text());
              $('#names_02').val(nowlist.reply.content);

      
              $('.ReplyEditor').css("display", "block");
      
              layer.open({
                type: 1,
                area: ['700px', ''],
                title: ['', 'background: #fff;border:0'],
                btn: ['确定', '取消'],
                skin: 'my-skin',
                btnAlign: 'c',
                content: $('.ReplyEditor'),
                cancel: function (index, layero) {
                  $('.ReplyEditor').css("display", "none");
                },
                yes: function (index, layero) {
      
                  var commentId = nowlist.comment.commentId;
                  var commentContent = $('#names_01').val();
                  var replyId = nowlist.reply.replyId;
                  var replyContent = $('#names_02').val();
      
                  console.log('评论ID =========', commentId);
                  console.log('评论内容 =========', commentContent);
                  console.log('回复ID =========', replyId);
                  console.log('回复内容 =========', replyContent);
      
                  $.ajax({
                    url: TheServer + '/comments/edit',
                    type: 'POST',
                    dataType: 'json',
                    async: true,    //或false,是否异步
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify({
                      commentId: commentId,
                      commentContent: commentContent,
                      replyId: replyId,
                      replyContent: replyContent
                    }),
                    success: function (data, textStatus, jqXHR) {
      
                      console.log(data);
      
                      if (data.code == 200) {
                        $('.reply_main').eq(nowreply).children('.reply_main-right').children('.reply_main_top').children('.questions_bottom').text(commentContent);
                        $('.reply_main').eq(nowreply).children('.reply_main-right').children('.reply_main_bottom').children('.reply_bottom_content').text(replyContent);
                        layer.msg('修改成功');
                      }
      
                    },
                    error: function (xhr, textStatus) {
                      // console.log('错误')
                      // console.log(xhr)
                      // console.log(textStatus)
                    },
                    complete: function () {
                      // console.log('结束')
                    }
                  })
      
                  layer.close(index);
                  $('.ReplyEditor').css("display", "none");
      
                },
                btn2: function (index, layero) {
                  // 取消按钮
                  layer.close(index);
                  $('.ReplyEditor').css("display", "none");
      
      
                },
              });
      
            });

          }
        

        };
        
  
      },
      error: function (xhr, textStatus) {
  
      },
      complete: function () {
  
      }
    });
  };
  
  var ReplyPage = function(ReplyCurr){

    $.ajax({
      url: TheServer + '/comments',
      type: 'GET',
      dataType: 'json',
      async: true,    //或false,是否异步
      data: {
        interviewId: talkNum,
        currentPage: ReplyCurr,
        pageSize: 5
      },
      success: function (data, textStatus, jqXHR){

        if(data.code == 200){

          layui.use('laypage', function(){

            var laypage = layui.laypage;
  
            //执行一个laypage实例
            laypage.render({
              elem: 'ReplyPage'
              ,count: data.result.total//数据总数，从服务端得到
              ,theme: '#4597E0'
              ,curr: location.hash.replace('#!ReplyCurr=', ReplyCurr)
              ,hash: 'ReplyCurr'
              ,limit: 5
              ,jump: function(obj, first){
  
                localStorage.setItem("ReplyCurr",obj.curr);
                
                ReplyList(obj.curr)
                
              }
            });
          });

        };

        

      },
    });
  };

  ReplyPage(ReplyCurr);


  // 网友提问 ======= 审核回复
  var AnswerQuestions = function(commentId,inx){

    console.log(commentId);
    console.log(inx);

    // 审核回复弹窗的内容部分
    $('.review_response').css("display", "block");
  
    // 把网友的提问在打开弹窗的时候就渲染到弹窗上面
    var questions_text = $('.questions_main').eq(inx).children('.questions_left').children('.questions_bottom').text();

    
    // 渲染到弹框上面
    $('.edit_q').text(questions_text);

    console.log('获取到的网友提问 ========= ', questions_text)

    // 网友提问页面的审核回复
    layer.open({
      type: 1,
      area: ['700px', ''],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('#review'),
      cancel: function (index, layero) {
        $('#review').css("display", "none");
      },
      yes: function (index, layero) {

        var Speak = localStorage.getItem("Speak");

        var speaker = JSON.parse(Speak);

        var commentContent = $('.edit_q').text();
        var replyContent = $('#review textarea').val();
        var speakerinx = $("#select_guest").get(0).selectedIndex;
        var speakerId = speaker[speakerinx].speakerId;
        var speakername = speaker[speakerinx].name;

        console.log('评论ID =======', commentId);
        console.log('评论内容 =======', commentContent);
        console.log('回复内容 =======', replyContent);
        console.log('回复者嘉宾ID =======', speakerId);
        console.log('回复者嘉宾名字 =======', speakername);

        //点击确定把数据上传
        $.ajax({
          url: TheServer + '/comments/audit',
          type: 'POST',
          dataType: 'json',
          async: true,
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            commentId: commentId,
            commentContent: commentContent,
            replyContent: replyContent,
            speakerId: speakerId,
            speakerName: speakername
          }),
          success: function (data, textStatus, jqXHR) {
            console.log(data);

            // 如果请求成功，修改页面上的问题
            if (data.code == 200) {
              // $('.questions_main').eq(questionsnow).children('.questions_left').children('.questions_bottom').text(commentContent);
              // $('.questions_main').eq(questionsnow).css('display','none');
              ProblemList(ProblemCurr);
              ProblemPage(ProblemCurr);
              layer.msg('回复成功');

            }


          },
          error: function (xhr, textStatus) {
          },
          complete: function () {
          }
        })

        // 关闭弹框
        layer.close(index);
        $('#review').css("display", "none");

      },
      btn2: function (index, layero) {// 取消按钮

        layer.close(index);
        $('#review').css("display", "none");

      },

    });

    // 编辑网友提问的弹框
    $('.editor_question').click(function () {

      $('#response_main').val($('.edit_q').text());

      layer.open({
        type: 1,
        area: ['700px', ''],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定', '取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('#response'),
        cancel: function (index, layero) {
          $('#response').css("display", "none");
        },
        yes: function (index, layero) {

          // 获取修改后的问题，重新渲染到上一个弹框
          var Modified = $('#response_main').val();
          $('.edit_q').text(Modified)
          //$('.questions_bottom').text(Modified);

          layer.close(index);
          $('#response').css("display", "none");

        },
        btn2: function (index, layero) {
          // 取消按钮
          layer.close(index);
          $('#response').css("display", "none");


        },
      });

    });

  };

  // 事件代理 ======= 网友提问/审核回复
  if(kind == "history"){

    if(status == 2){
      $('#aaaa').click(function(event){
  
        var event = event || window.event;
    　  var target = event.target || event.srcElement;
    
        var commentId = target.getAttribute('data-id');
        var inx = target.getAttribute('data-index');
    
        switch(target.className){
          case 'ReviewResponse':
          AnswerQuestions(commentId,inx);
          break;
        }
    
        console.log(target)
        console.log(commentId)
    
      });
    }
  }
  
  


  // 网友提问 ==== 打开编辑
  $('.batch_management').click(function () {
    $('.batch_management').css('display', 'none');
    $('.tool').css('display', 'block');
    $('.questions_chexbox').css('display', 'block')
  });

  // 网友提问 ==== 关掉编辑
  $('#questions_cancel').click(function () {
    $('.batch_management').css('display', 'block');
    $('.tool').css('display', 'none');
    $('.questions_chexbox').css('display', 'none');
    $('.questions_chexbox').removeClass('chexbox_img');
  });

  // 审核回复 ==== 打开编辑
  $('.reply_management').click(function () {
    $('.reply_management').css('display', 'none');
    $('.reply_tool').css('display', 'block');
    $(".replys_chexbox").css('display', 'block');
  });

  // 审核回复 ==== 关掉编辑
  $('#ReplyCancel').click(function () {
    $('.reply_management').css('display', 'block');
    $('.reply_tool').css('display', 'none');
    $(".replys_chexbox").css('display', 'none');
    $('.replys_chexbox').removeClass('chexbox_img');
  });

  // 网友提问 === 全选
  $('.AllSelct').click(function () {

    if($('.questions_chexbox').hasClass('chexbox_img')){

      $('.questions_chexbox').removeClass('chexbox_img');

    }else{

      $('.questions_chexbox').addClass('chexbox_img');

    }

  });

  // 审核回复 === 全选
  $('.replyAll').click(function () {


    if($('.replys_chexbox').hasClass('chexbox_img')){

      $('.replys_chexbox').removeClass('chexbox_img');

    }else{

      $('.replys_chexbox').addClass('chexbox_img');

    }


  });

  // 网友提问 ===== 删除按钮
  $('#InteractionDelete').click(function () {

    $('.interaction_delete').css("display", "block");

    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.interaction_delete'),
      cancel: function (index, layero) {
        $('.interaction_delete').css("display", "none");
      },
      yes: function (index, layero) {

        // 点击确定删除的时候
        var Questions = $('.questions_chexbox');

        var QuestionsStr = [];

        //var Questionsinx = [];

        for (var i = 0; i < Questions.length; i++) {

          if (Questions.eq(i).hasClass('chexbox_img')) {

            QuestionsStr.push(Questions[i].getAttribute('data-id'));
           // Questionsinx.push(i)
          }

        }

        var intQuestions = [];

        QuestionsStr.forEach(function (data, index, arr) {
          intQuestions.push(+data);
        });

        console.log('选中的commentIds ====== ',intQuestions);
        

        $.ajax({
          url: TheServer + '/comments/delete',
          type: 'POST',
          dataType: 'json',
          async: true,    //或false,是否异步
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            commentIds: intQuestions
          }),
          success: function (data, textStatus, jqXHR) {
            // 如果请求成功的话

            if(data.code == 200){

              // for(var i = 0;i<Questionsinx.length;i++){
              //   $('.questions_main').eq(i).css('display','none')
              // }
              ProblemList(ProblemCurr);
              ProblemPage(ProblemCurr);
              layer.msg('删除成功');

            }


            console.log(data)

          },
          error: function (xhr, textStatus) {
            // console.log('错误')
            // console.log(xhr)
            // console.log(textStatus)
          },
          complete: function () {
            // console.log('结束')
          }
        })

        // 关闭弹窗
        layer.close(index);
        $('.interaction_delete').css("display", "none");
      },
      btn2: function (index, layero) {
        // 取消
        layer.close(index);
        $('.interaction_delete').css("display", "none");
      },
    });

  });

  // 审核回复 ===== 删除按钮
  $('#ReplyDelece').click(function () {

    $('.interaction_delete_2').css("display", "block");

    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.interaction_delete_2'),
      cancel: function (index, layero) {
        $('.interaction_delete_2').css("display", "none");
      },
      yes: function (index, layero) {

        // 获取选中的数据
        var AllReply = $('.replys_chexbox');

        var SelectComment = [];

        var SelectReply = [];

        var SelectReplyInx = [];

        for (var i = 0; i < AllReply.length; i++) {

          if (AllReply.eq(i).hasClass('chexbox_img')) {

            SelectComment.push(AllReply[i].getAttribute('data-id'));
            SelectReply.push(AllReply[i].getAttribute('data-key'));
            SelectReplyInx.push(i);

          }

        }

        // 字符串数组转化成int整数型数组
        var commentIds = [];
        var replyIds = [];

        SelectComment.forEach(function (data, index, arr) {
          commentIds.push(+data);
        });
        SelectReply.forEach(function (data, index, arr) {
          replyIds.push(+data);
        });

        console.log('评论ID数组 ========= ', commentIds);
        console.log('回复ID数组 ========= ', replyIds);
        console.log('选中的下标 ========= ', SelectReplyInx);



        $.ajax({
          url: TheServer + '/comments/delete',
          type: 'POST',
          dataType: 'json',
          async: true,    //或false,是否异步
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            commentIds: commentIds,
            replyIds: replyIds
          }),
          success: function (data, textStatus, jqXHR) {

            if(data.code == 200){

              // for(var i = 0;i < SelectReplyInx.length; i ++){

              //   $('.reply_main').eq(i).css('display','none');

              // };
              ReplyList(ReplyCurr);
              ReplyPage(ReplyCurr);
              layer.msg('删除成功');
              
            }
            console.log(data);
            

          },
          error: function (xhr, textStatus) {
            // console.log('错误')
            // console.log(xhr)
            // console.log(textStatus)
          },
          complete: function () {
            // console.log('结束')
          }
        })





        layer.close(index);
        $('.interaction_delete_2').css("display", "none");
      },
      btn2: function (index, layero) {
        // 取消
        layer.close(index);
        $('.interaction_delete_2').css("display", "none");
      },
    });

  });

  // 互动设置 ===== 导航切换
  var idx;
  $(".interaction ul li").click(function () {
    $(this).addClass('item3_active').siblings().removeClass('item3_active');
    idx = $(this).index();
    $(".item3>div").hide().eq(idx).show();
    if(idx == 1){
      ReplyList(ReplyCurr)
      ReplyPage(ReplyCurr);
    }
    
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
  var ImageCurr = 1;
  
  var GetImage = function(ImageCurr){

    $.ajax({
      url: TheServer + '/interview/images',
      type: 'POST',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({
        interviewId: talkNum,
        pageNum: ImageCurr,
        pageSize: 12
      }),
      success: function (data, textStatus, jqXHR) {
        console.log('图片 ======== ',data);
        // 如果请求成功的话
        if (data.code == 200) {

          // 分页
          //ImagePage(data.result.total);
  
          localStorage.setItem("ImageTotal",data.result.total);
  
          var ImgList = data.result.list;
  
          console.log(ImgList);
  
          var Img = '';
          
          $.each(ImgList, function (i, obj) {
  
            Img += '<div class="picture_img">';
            Img += '<div class="picture_chexbox" data-id="' + ImgList[i].picId + '">';
            Img += '</div>';
            Img += '<div class="imagess">';
            Img += '<div class="imagess_main" style="background:url(' + obj.picUrl + ');background-size: 100%">';
            Img += '</div>';
            Img += '</div>';
            Img += '<p>' + obj.updateTime + '</p>';
            Img += '</div>';
  
            // console.log(ImgList[0].picId);
            // console.log(ImgList[0].picUrl);
  
          });
          $('.picture_content').html(Img);

          if( $('.picture_tool').css("display") == 'none'){

            $('.picture_chexbox').css('display','none')
  
          }else if( $('.picture_tool').css("display") == 'block' ){
  
            $('.picture_chexbox').css('display','block')
  
          };

          
  
          // 复选框
          $('.picture_chexbox').click(function () {
  
            if ($(this).hasClass('chexbox_img')) {
  
              $(this).removeClass('chexbox_img');
  
            } else {
  
              $(this).addClass('chexbox_img');
            }
          });
  
  
  
        }
  
        console.log(data.result)
  
      },
      error: function (xhr, textStatus) {

      },
      complete: function () {

      }
    });

  };
 
  var ImagePage = function(ImageCurr){
    $.ajax({
      url: TheServer + '/interview/images',
      type: 'POST',
      dataType: 'json',
      async: true,    //或false,是否异步
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({
        interviewId: talkNum,
        pageNum: ImageCurr,
        pageSize: 12
      }),
      success: function (data, textStatus, jqXHR){

        layui.use('laypage', function(){

          var laypage = layui.laypage;
    
          //执行一个laypage实例
          laypage.render({
            elem: 'ImagePage'
            ,count: data.result.total//数据总数，从服务端得到
            ,theme: '#4597E0'
            ,curr: location.hash.replace('#!ImageCurr=', ImageCurr)
            ,hash: 'ImageCurr'
            ,limit: 12
            ,jump: function(obj, first){

              console.log(obj.curr);
    
              localStorage.setItem("ImageCurr",obj.curr);
    
              GetImage(obj.curr);
            }
          });
        });

      },
    });

   

  };

  ImagePage(ImageCurr);
  // 打开编辑
  $('.picture_management').click(function () {
    $('.picture_management').css("display", "none");
    $('.picture_tool').css("display", "block");
    $('.picture_chexbox').css("display", "block");
  });

  // 关闭编辑
  $('#PictureCancel').click(function () {
    $('.picture_management').css("display", "block");
    $('.picture_tool').css("display", "none");
    $('.picture_chexbox').css("display", "none");
    $('.picture_chexbox').removeClass('chexbox_img');
  });

  // 点击删除
  $('#PictureDelece').click(function () {

    $('.picture_delece').css("display", "block");
    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.picture_delece'),
      cancel: function (index, layero) {
        $('.picture_delece').css("display", "none");
      },
      yes: function (index, layero) {

        // 点击确定删除的时候
        var deletions = $('.picture_chexbox');

        var DeletionsStr = [];

        // 获取到选中的 picIds
        for (var i = 0; i < deletions.length; i++) {

          if (deletions.eq(i).hasClass('chexbox_img')) {

            DeletionsStr.push(deletions[i].getAttribute('data-id'));

          }

        }

        console.log('选中图片的picIds =======' ,DeletionsStr);

        $.ajax({
          url: TheServer + '/interview/removePic',
          type: 'POST',
          dataType: 'json',
          async: true,    //或false,是否异步
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            picIds: DeletionsStr
          }),
          success: function (data, textStatus, jqXHR) {
            // 如果请求成功的话
            console.log('删除图片接口 ======= ',data);

            if (data.code == 200) {

              GetImage(ImageCurr);
              ImagePage(ImageCurr);

              layer.msg('删除成功');

            }

          },
          error: function (xhr, textStatus) {
            
          },
          complete: function () {

          }
        })

        // 删除成功后就关闭弹窗
        layer.close(index);
        $('.picture_delece').css("display", "none");
      },
      btn2: function (index, layero) {
        // 取消按钮
        layer.close(index);
        $('.picture_delece').css("display", "none");
      },
    });

  });

  // 全选本页
  $('.imgall').click(function () {


    if($('.picture_chexbox').hasClass('chexbox_img')){

      $('.picture_chexbox').removeClass('chexbox_img');

    }else{

      $('.picture_chexbox').addClass('chexbox_img');

    }

  });

  // 上传图片
  layui.use('upload', function () {
    var upload = layui.upload;
    console.log("执行了");
    //执行实例
    var uploadInst = upload.render({
      elem: '#updata', //绑定元素
      url: TheServer + '/interview/uploadImages',//上传接口
      accept: 'images',
      data: {
        interviewId: talkNum,
      },
      before: function(obj){
        
      },
      done: function (res, file, index, upload) {
        //上传完毕回调
        console.log(res)
        
        // 如果上传成功的话，就调取图片列表的接口
        if(res.code == 200){

          GetImage(ImageCurr);
          ImagePage(ImageCurr);

          layer.msg('上传成功');
        };


      },
      error: function () {
        //请求异常回调
      }
    });
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

  // 数据渲染
  var TextCurr = 1;

  var GetText = function(TextCurr){

    $.ajax({
      url: TheServer + '/speakerOpinion/list',
      type: 'GET',
      async: true,
      data: {
        interviewId: talkNum,
        currentPage: TextCurr,
        pageSize: 5,
      },
      success: function (data, textStatus, jqXHR) {
        console.log(data.result.list);

        localStorage.setItem("TextTotal",data.result.total);

        var TextList = data.result.list;

        var Texts = '';

        $.each(TextList,function(i,obj){

          Texts += '<div class="record">';
          Texts += '<div class="text_chexbox" data-ids="'+obj.opinionId+'"></div>';
          Texts += '<div class="record_right">';
          Texts += '<p class="record_name">'+obj.speakerName+'</p>';
          Texts += '<p class="record_time">'+obj.createTime+'</p>';
          Texts += '<p class="record_comtent">'+obj.content+'</p>';
          Texts += '<p class="record_edit">';
          Texts += '<img src="'+'../img/edit.png'+'" alt="">'+'编辑';
          Texts += '</p>';
          Texts += '</div>';
          Texts += '</div>';

        });
        $('#TextList').html(Texts);

        if( $('.text_tool').css("display") == 'none'){

          $('.text_chexbox').css('display','none')

        }else if( $('.text_tool').css("display") == 'block' ){

          $('.text_chexbox').css('display','block')

        };

        // 复选框
        $('.text_chexbox').click(function () {

          if ($(this).hasClass('chexbox_img')) {
      
            $(this).removeClass('chexbox_img');
      
          } else {
      
            $(this).addClass('chexbox_img');
          }
        });

        // 点击编辑
        $('.record_edit').click(function () {

          var NowText = $(this).parent().parent().index();

          console.log('当前选中编辑的下标 ========= ',NowText);

          var record_comtent = $('.record').eq(NowText).children('.record_right').children('.record_comtent').text();

          console.log('文字 ======' ,record_comtent);
      
          $('#TextSelect').val(record_comtent);
      
      
          $('.text_record_edit').css("display", "block");
          layer.open({
            type: 1,
            area: ['700px', '520px'],
            title: ['', 'background: #fff;border:0'],
            btn: ['完成'],
            skin: 'my-skin',
            btnAlign: 'c',
            content: $('.text_record_edit'),
            cancel: function (index, layero) {
              $('.text_record_edit').css("display", "none");
            },
            yes: function (index, layero) {

              var content = $('#TextSelect').val();
              var speakerId = $('#text_ss option:selected').val();
              var opinionId = TextList[NowText].opinionId;

              console.log('修改的内容 ========',content);
              console.log('修改的嘉宾 ========',speakerId);
              console.log('修改的ID ========',opinionId);

              $.ajax({
                url: TheServer + '/speakerOpinion/edit',
                type: 'POST',
                async: true,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                  interviewId: talkNum,
                  speakerId: speakerId,
                  content: content,
                  opinionId: opinionId
                }),
                success: function (data, textStatus, jqXHR) {
                  console.log(data);

                  if(data.code == 200){

                    $('.record').eq(NowText).children('.record_right').children('.record_comtent').text(content);

                  };
                },
                error: function (xhr, textStatus) {
                },
                complete: function () {
                }
              })



              layer.close(index);
              $('.text_record_edit').css("display", "none");
            }
          });
      
        });

      },
      error: function (xhr, textStatus) {
      },
      complete: function () {
      }
    })

  };
  
  var TextPage = function(TextCurr){

    $.ajax({
      url: TheServer + '/speakerOpinion/list',
      type: 'GET',
      async: true,
      data: {
        interviewId: talkNum,
        currentPage: TextCurr,
        pageSize: 5,
      },
      success: function (data, textStatus, jqXHR) {

        if(data.code == 200){

          layui.use('laypage', function(){

            var laypage = layui.laypage;
            
            //执行一个laypage实例
            laypage.render({
              elem: 'TextPage'
              ,count: data.result.total//数据总数，从服务端得到
              ,theme: '#4597E0'
              ,limit: 5
              ,curr: location.hash.replace('#!TextCurr=', TextCurr)
              ,hash: 'TextCurr'
              ,jump: function(obj, first){

                localStorage.setItem("TextCurr",obj.curr);
                
               
                GetText(obj.curr)
                
              }
            });
          });

        }

      },
    })
  };

  TextPage(TextCurr);
  
  // 打开编辑
  $('.text_management').click(function () {
    $('.text_management').css("display", "none");
    $('.text_tool').css("display", "block");
    $('.text_chexbox').css("display", "block");
  });

  // 关闭编辑
  $('#TextCancel').click(function () {
    $('.text_management').css("display", "block");
    $('.text_tool').css("display", "none");
    $('.text_chexbox').css("display", "none");
    $('.text_chexbox').removeClass('chexbox_img');
  });

  // 点击删除文字实录
  $('#TextDelece').click(function () {

    $('.text_delece').css("display", "block");
    layer.open({
      type: 1,
      area: ['480px', '360px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['确定', '取消'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.text_delece'),
      cancel: function (index, layero) {
        $('.text_delece').css("display", "none");
      },
      yes: function (index, layero) {

        var TextChexbox = $('.text_chexbox');

        var TDelece = [];

        var DeleceInx = [];

        for(var i = 0; i < TextChexbox.length; i ++){

          if(TextChexbox.eq(i).hasClass('chexbox_img')){

            TDelece.push(TextChexbox[i].getAttribute('data-ids'));

            DeleceInx.push(i);

          }

        };

        var intTDelece = [];

        TDelece.forEach(function (data, index, arr) {
          intTDelece.push(+data);
        });

        console.log('选中的id ========= ',intTDelece);
        console.log('选中的下标 ========= ',DeleceInx);

        $.ajax({
          url: TheServer + '/speakerOpinion/remove',
          type: 'POST',
          dataType: 'json',
          async: true,    //或false,是否异步
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            interviewId: talkNum,
            ids: intTDelece
          }),
          success: function (data, textStatus, jqXHR) {
            
            console.log('删除文字实录接口 ========= ',data);

            // 如果请求成功的话
            if(data.code == 200){

              GetText(TextCurr);
              TextPage(TextCurr);

              layer.msg('删除成功');

            }


          },
          error: function (xhr, textStatus) {
            // console.log('错误')
            // console.log(xhr)
            // console.log(textStatus)
          },
          complete: function () {
            // console.log('结束')
          }
        })



        layer.close(index);
        $('.text_delece').css("display", "none");

      },
      btn2: function (index, layero) {
        // 取消
        layer.close(index);
        $('.text_delece').css("display", "none");
      },
    });

  });

  // 实时录入会议内容
  $('.conference').click(function () {

    $('.real_time').css("display", "block");

    layer.open({
      type: 1,
      area: ['700px', '520px'],
      title: ['', 'background: #fff;border:0'],
      btn: ['完成'],
      skin: 'my-skin',
      btnAlign: 'c',
      content: $('.real_time'),
      cancel: function (index, layero) {
        $('.real_time').css("display", "none");
      },
      yes: function (index, layero) {

        var speakerId = $('#text_s option:selected').val();
        var content = $('#RealTime').val();

        console.log('选择的嘉宾 =======', speakerId);
        console.log('录入的内容 =======', content);

        $.ajax({
          url: TheServer + '/speakerOpinion/create',
          type: 'POST',
          dataType: 'json',
          async: true,    //或false,是否异步
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify({
            interviewId: talkNum,
            speakerId: speakerId,
            content: content

          }),
          success: function (data, textStatus, jqXHR) {

            console.log('实时录入文字接口 ========= ',data);

            if(data.code == 200){

              GetText(TextCurr);
              TextPage(TextCurr);
              layer.msg('录入成功');
            }
      
          },
          error: function (xhr, textStatus) {
      
          },
          complete: function () {
      
          }
        });






        layer.close(index);
        $('.real_time').css("display", "none");
      }
    });

  });
  
  // 全选本页
  $('.textall').click(function () {

    if($('.text_chexbox').hasClass('chexbox_img')){

      $('.text_chexbox').removeClass('chexbox_img');

    }else{

      $('.text_chexbox').addClass('chexbox_img');

    }


  });




  /**
   * 视频上传
   * 
   * 视频渲染
   */
  var Vedio = function(){

    var VedioList = localStorage.getItem("Details");
    var VedioLists = JSON.parse(VedioList);
    console.log(VedioLists);

    if(VedioLists.videoUrl != null){

      var VedioStr = [];

      VedioStr += '<div class="vedio">';
      VedioStr += '<P style="margin: 0;width: 42%">';
      VedioStr += '<img src="'+'../img/vedio.png'+'" alt="">';
      VedioStr += '<span class="vedio_title">'+VedioLists.name+'</span>';
      VedioStr += '</p>';
      VedioStr += '<p class="vedio_size">'+VedioLists.updateTime+'</p>';
      VedioStr += '<p style="width: 28%" class="vedio_time">'+VedioLists.videoSize+'M'+'</p>';
      VedioStr += '<a href="'+VedioLists.videoUrl+'" class="download" style="width: 10%;cursor: pointer;">'+'下载视频'+'</a>';
      VedioStr += '</div>';

      $('.vedio_vedio').html(VedioStr);
      $(".download").attr("download",VedioLists.videoUrl); 
    }

  };
  Vedio();
  

  // 视频上传
  $('#VedioUpdata').change(function(e){

    var files = e.currentTarget.files[0].name;

    var Size = e.currentTarget.files[0].size;

    var videoSize = ((Size/1024)/1024).toFixed(2);

    

    console.log('选择文件的名称 ========', files);
    console.log('选择文件的大小 ========', videoSize);

    $.ajaxFileUpload({
      url: TheServer + '/interview/uploadVideo',
      type: 'POST',
      secureuri: false, //一般设置为false
      fileElementId: "VedioUpdata", //文件上传空间的id属性
      dataType: 'JSON',
      traditional: true,
      contentType: 'application/json;charset=utf-8',
      data: {
        interviewId: talkNum,
        file: files,
        videoSize: videoSize
      },
      
      success: function(res, status){
        console.log(status);

        if(status == 'success'){

          DirectSeedingDetails();
          Vedio();
          // var VedioList = localStorage.getItem("Details");
          // var VedioLists = JSON.parse(VedioList);
          // console.log(VedioLists);

          // if(VedioLists.videoUrl != null){

          //   console.log('执行了')

          //   var VedioStr = [];

          //   VedioStr += '<div class="vedio">';
          //   VedioStr += '<P style="margin: 0;width: 42%">';
          //   VedioStr += '<img src="'+'../img/vedio.png'+'" alt="">';
          //   VedioStr += '<span class="vedio_title">'+VedioLists.name+'</span>';
          //   VedioStr += '</p>';
          //   VedioStr += '<p class="vedio_size">'+VedioLists.updateTime+'</p>';
          //   VedioStr += '<p style="width: 28%" class="vedio_time">'+VedioLists.videoSize+'M'+'</p>';
          //   VedioStr += '<a class="download" style="width: 10%;cursor: pointer;">'+'下载视频'+'</a>';
          //   VedioStr += '</div>';

          //   $('.vedio_vedio').html(VedioStr);
          // }

          layer.msg('上传成功');
          //Vedio();
        }

      },
      error: function(data, status, e){
        //layer.close(index);
        console.log(data);

      }
    });



  });
  








});


/**
 * 直播详情里的弹框
 * 
 * ModifyName ======= 修改会议名称
 * 
 * ModifyScene ====== 修改会议场景
 * 
 * BriefIntroduction == 编辑简介
 * 
 */
function ModifyName() {
  $('.modify_name').css("display", "block");

  layer.open({
    type: 1,
    area: ['480px', '360px'],
    title: ['', 'background: #fff;border:0'],
    btn: ['确定', '取消'],
    // shade: 0,
    skin: 'my-skin',
    btnAlign: 'c',
    content: $('.modify_name'),
    cancel: function (index, layero) {
      $('.modify_name').css("display", "none");
    },
    yes: function (index, layero) {
      // 确定
      var name = $('#Name').val();
      // 判断名称的长度
      if (name.length > 25) {
        $('.tips').css('display', 'block');
      } else {
        $('#TalkName').text(name);
        layer.close(index);
        $('.modify_name').css("display", "none");
      }
    },
    btn2: function (index, layero) {
      // 取消
      layer.close(index);
      $('.modify_name').css("display", "none");
    },
  });
};


function ModifyScene() {

  layer.open({
    type: 1,
    area: ['480px', '360px'],
    title: ['', 'background: #fff;border:0'],
    btn: ['确定', '取消'],
    skin: 'my-skin',
    btnAlign: 'c',
    content: $('.modify_scene'),
    cancel: function (index, layero) {
      $('.modify_scene').css("display", "none");
    },
    yes: function (index, layero) {
      layer.close(index);
      $('.modify_scene').css("display", "none");

      
    },
    btn2: function (index, layero) {
      // 取消
      layer.close(index);
      $('.modify_scene').css("display", "none");
    },
  });

};

function BriefIntroduction() {

  var old = $('#text_brief').text();
  console.log(old);
  $('#brief').val(old);

  $('.brief_introduction').css("display", "block");

  layer.open({
    type: 1,
    area: ['700px', '430px'],
    title: ['', 'background: #fff;border:0'],
    btn: ['确定', '取消'],
    skin: 'my-skin',
    btnAlign: 'c',
    content: $('.brief_introduction'),
    cancel: function (index, layero) {
      $('.brief_introduction').css("display", "none");
    },
    yes: function (index, layero) {

      var news = $('#brief').val();

      // 判断简介的长度
      if (news.length > 50) {
        $('.tips_3').css('display', 'block');
      } else {
        $('#text_brief').text(news);
        layer.close(index);
        $('.brief_introduction').css("display", "none");
      }
    },
    btn2: function (index, layero) {
      // 取消
      layer.close(index);
      $('.brief_introduction').css("display", "none");
    },
  });

};


