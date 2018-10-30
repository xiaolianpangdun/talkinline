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
     * 切换页面
     * 左边的导航
    */
    var index;
    $(".nav li").click(function(){
      $(this).addClass('active').siblings().removeClass('active');
      index = $(this).index();
      $(".menu").hide().eq(index).show();
    });

    /**
     * 单选框
     * 
     * 直播详情 
     * 
     * 数据渲染
     * 
     * 访谈场景（单选框）
     */

     // 直播详情 ========== 数据渲染
    var TheServer = 'http://192.168.0.71:8080';
    var ids = 1;
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
        $('#TalkNumber').text(data.result.interviewId)

        if(data.result.type == 0){
          $('#TalkScene').text('视频直播');
        }else if(data.result.type == 1){
          $('#TalkScene').text('图文直播');
        }
        $('#compere').text(data.result.compere);
        $('#time1').text(data.result.beginTime);
        $('#time2').text(data.result.endTime);

        var speakerList = data.result.speakerList;
        var str = '';
        $.each(speakerList, function(i, obj) {
          str += '<p class="guest">'+obj.name+'</P>';
        });
        $('.add').before(str);
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

    // 直播详情 =========== 修改访谈场景（单选框）
    $('.radio_item').children('.check_out').click(function(){

      $(this).addClass('image').parent().siblings().children().removeClass('image');

    });

    // 直播详情 =========== 修改里面的内容 （会议名称、访谈场景、访谈时间、会议简介）
    $('.sure').click(function(){

      var talkname = $('#TalkName').text();
      var talktype = $('#TalkScene').text();
      var begintime = $('#time1').text();
      var endtime = $('#time2').text();
      var talkbrief = $('#text_brief').text();

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
            id: ids
        },
        success:function(data,textStatus,jqXHR){
            console.log(data.result)
          // 直播详情的数据渲染
          $('#TalkName').text(data.result.name);
          $('#TalkNumber').text(data.result.interviewId)

          if(data.result.type == 0){
            $('#TalkScene').text('视频直播');
          }else if(data.result.type == 1){
            $('#TalkScene').text('图文直播');
          }
          $('#compere').text(data.result.compere);
          $('#time1').text(data.result.beginTime);
          $('#time2').text(data.result.endTime);

          var speakerList = data.result.speakerList;
          var str = '';
          $.each(speakerList, function(i, obj) {
            str += '<p class="guest">'+obj.name+'</P>';
          });
          $('.add').before(str);
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


    });
    
    /**
     * 互动设置
     * 
     * 网友提问编辑切换
     * 
     * 审核回复编辑切换
     * 
     * 点击选择和全选
     */
    $('.batch_management').click(function(){
      $('.batch_management').css('display','none');
      $('.tool').css('display','block');
      $('.questions_chexbox').css('display','block')
    });

    $('#questions_cancel').click(function(){
      $('.batch_management').css('display','block');
      $('.tool').css('display','none');
      $('.questions_chexbox').css('display','none')
    });

    $('.reply_management').click(function(){
      $('.reply_management').css('display','none');
      $('.reply_tool').css('display','block');
      // $('.questions_radio').css('display','block')
    });

    $('#ReplyCancel').click(function(){
      $('.reply_management').css('display','block');
      $('.reply_tool').css('display','none');
      // $('.questions_radio').css('display','none')
    });

    $('.checkbox').click(function(){
      console.log('执行了')
      //console.log(bool)
      if($(this).hasClass('chexbox_img')){
        $(this).removeClass('chexbox_img')
      }else{
        $(this).addClass('chexbox_img');
      }
    });

    $('.AllSelct').click(function(){

      var input = $('.checkbox');
      $('.checkbox').addClass('chexbox_img');

    });

    /**
     * 互动设置的弹框
     * 
     * 点击删除
     * 
     * 点击屏蔽
     * 
     * 审核回复(编辑提问)
     * 
     * 导航切换
     * 
     * 审核回复子页面里面的编辑
     */

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

    $('.InteractionShield').click(function(){
      $('.interaction_shield').css("display","block");
      layer.open({
        type: 1,
        area: ['480px', '360px'],
        title: ['', 'background: #fff;border:0'],
        btn: ['确定','取消'],
        skin: 'my-skin',
        btnAlign: 'c',
        content: $('.interaction_shield'),
        cancel: function(index, layero){
          $('.interaction_shield').css("display","none");
        },
        yes: function(index, layero){
            layer.close(index);
            $('.interaction_shield').css("display","none");
           // $('.questions_right p').css('background','#9FB1C0')
        },
        btn2: function(index, layero){
            // 取消
          layer.close(index);
          $('.interaction_shield').css("display","none");
        },
      });
    });

    $('#ReviewResponse').click(function(){

      $('.review_response').css("display","block");
      // 把问题渲染到审核回复
      var questions = $('.questions_bottom').text();
      $('.review_questions span').text(questions);
      

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

          layer.close(index);
          $('#review').css("display","none");

        },
        btn2: function(index, layero){
          // 取消按钮
          layer.close(index);
          $('#review').css("display","none");

          
        },
      });

      $('.editor_question').click(function(){
        $('#response_main').val(questions);
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

            var Modified = $('#response_main').val();

            $('.questions_bottom').text(Modified);

            $('.review_questions span').text(Modified);
  
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

    var idx;
    $(".interaction ul li").click(function(){
      $(this).addClass('item3_active').siblings().removeClass('item3_active');
      idx = $(this).index();
      $(".item3>div").hide().eq(idx).show();
    });

    $('.reply_editor').click(function(){

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


    /**
     * 现场图片
     * 
     * 取消
     * 
     * 删除
     * 
     * 
     */
    $('.picture_management').click(function(){
      $('.picture_management').css("display","none");
      $('.picture_tool').css("display","block");
    });

    $('#PictureCancel').click(function(){
      $('.picture_management').css("display","block");
      $('.picture_tool').css("display","none");
    });

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

    $('#PictureCancel').click(function(){
      $('.batch_management').css('display','block');
      $('.tool').css('display','none');
    });

    /**
     * 文字实录
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

    $('.text_management').click(function(){
      $('.text_management').css("display","none");
      $('.text_tool').css("display","block");
    });

    $('#TextCancel').click(function(){
      $('.text_management').css("display","block");
      $('.text_tool').css("display","none");
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
      },
      yes: function(index, layero){
        var add_name = $('#Adds').val();
        // 判断嘉宾姓名的长度
        if(add_name.length >20){
          $('.tips_2').css('display','block');
        }else{
          layer.close(index);
          $('#add_guest').css("display","none");
        }
      },
      btn2: function(index, layero){
          // 取消
        layer.close(index);
        $('#add_guest').css("display","none");
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



/**
 * 直播详情页面
 * 
 * 复制链接
 */
// function copyUrl2(){
//     var Url2=document.getElementById("links");
//     Url2.select(''); 
//     Url2.document.execCommand("Copy");// 选择对象
//      // 执行浏览器复制命令
//     alert("已复制好，可贴粘。");
//  }
// function copyToClipboard(txt) {  
//   if(window.clipboardData){  
//       window.clipboardData.clearData();  
//       window.clipboardData.setData("Text", txt);
//       alert('复制成功！')
//   }else{
//       alert('请手动复制！') 
//   }  
// }



