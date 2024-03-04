var Mpage=1;

//滚动显示更多
var scroll_get = true;  //做个标志,不要反反复复的加载
$(document).ready(function () {
    $(window).scroll(function () {
        if (scroll_get==true &&  (400 + $(window).scrollTop())>($(document).height() - $(window).height())) {
            scroll_get = false;
            layer.msg('内容加截中,请稍候',{time:1000});
            dr_ajax_load_more();
        }
    });
});

function dr_ajax_load_more(){
    Mpage++;
    $.get('/index.php?s=api&c=api&m=template&name=index_data.html&format=json&page='+Mpage+'&'+Math.random(),function(res){
        $('.footer-cont').hide();
        if(res.code==1){
            if(res.msg==''){
                layer.msg("已经显示完了",{time:500});
            }else{
                $('#content_list').append(res.msg);
                scroll_get = true;
            }
        }else{
            layer.msg(res.msg,{time:2500});
        }
    }, 'json');
}