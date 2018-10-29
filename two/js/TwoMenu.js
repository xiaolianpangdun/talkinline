
$(function(){

  /**
   * 日期选择器
   */
    var start = {
        format: 'YYYY/MM/DD hh:mm:ss',
        minDate: $.nowDate(0), //设定最小日期为当前日期
        isinitVal:true,
        festival:true,
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
     * 直播详情 ===== 访谈场景
     */

    $('.radio_item').click(function(){

      $(this).addClass('image').siblings().removeClass('image');

    });



    $('.radio input').click(function(){
      $(this).addClass('image').siblings().removeClass('image');
    });

    /**
     * 互动设置
     * 
     * 网友提问编辑切换
     * 
     * 审核回复编辑切换
     */
    $('.batch_management').click(function(){
      $('.batch_management').css('display','none');
      $('.tool').css('display','block');
      $('.questions_radio').css('display','block')
    });

    $('#questions_cancel').click(function(){
      $('.batch_management').css('display','block');
      $('.tool').css('display','none');
      $('.questions_radio').css('display','none')
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
//     Url2.document.execCommand("Copy");// 选择对象
//      // 执行浏览器复制命令
//     alert("已复制好，可贴粘。");
//  }


