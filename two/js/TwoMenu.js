layui.use('laydate', function () {

    var laydate = layui.laydate;

    laydate.render({
        elem: '#time',
        type: 'datetime',
        range: '至',
        format: 'MM/dd HH:mm' 
    });
});

function oCopy(){

    var link  = $("#link").html();
    //console.log(aa);
    link.select(); 
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");



    // obj.select();
    // js=obj.createTextRange();
    // js.execCommand("Copy")
    // alert("复制成功!");
}
    