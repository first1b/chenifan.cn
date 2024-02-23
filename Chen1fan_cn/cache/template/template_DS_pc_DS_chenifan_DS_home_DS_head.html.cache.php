<script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
<script>LA.init({id: "JNtyj7si67Tn4g5t",ck: "JNtyj7si67Tn4g5t"})</script>
<script src="/skin/js/lazyload/jquery-1.11.0.min.js"></script>
<script src="/skin/js/lazyload/jquery.lazyload.js"></script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5981788569352351"
     crossorigin="anonymous"></script>
<script>
(function(){
var el = document.createElement("script");
el.src = "https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?f0e0b571b86ade20d3587555160941d9079c10b49e1023c464d0a988a3aa98b33d72cd14f8a76432df3935ab77ec54f830517b3cb210f7fd334f50ccb772134a";
el.id = "ttzz";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(el, s);
})(window)
</script>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?ae86b9f95e6431d72b52a53c0ca66253";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
<div id="header" class=" navbar-fixed-top">
    <div class="container">
        <h2 class="logo">
            <a href="/" title="澈逆凡bolg——专注分享优质内容" style="width:100%; background-image: url(/style/images/logo.png);"></a>
        </h2>
        <div role="navigation" class="site-nav  primary-menu">
            <div class="menu-fix-box">
                <ul id="menu-navigation" class="menu">
                    <li><a href="/">网站首页</a></li>
                    <?php $list_return = $this->list_tag("action=category module=share pid=0"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                    <li class="menu-item-has-children">
                        <a href="<?php echo $t['url']; ?>"><?php echo $t['name']; ?></a>
                        <?php if ($t['child']) { ?>
                        <ul> <?php $list_return_t2 = $this->list_tag("action=category module=share pid=$t[id]  return=t2"); if ($list_return_t2 && is_array($list_return_t2)) extract($list_return_t2, EXTR_OVERWRITE); $count_t2=dr_count($return_t2); if (is_array($return_t2)) { $key_t2=-1;  foreach ($return_t2 as $t2) { $key_t2++; $is_first=$key_t2==0 ? 1 : 0;$is_last=$count_t2==$key_t2+1 ? 1 : 0; ?>
                            <li><a href="<?php echo $t2['url']; ?>"><?php echo $t2['name']; ?></a></li>
                            <?php } } ?>
                        </ul>
                        <?php } ?>
                    </li>
                    <?php } } ?>
                    <li class="menu-item-has-children">
                        <a href="//bk.chenifan.cn" target="_blank">百科</a>
                        
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-nav">
            <div class="js-toggle-message">
                <button id="sitemessage" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-bullhorn"></i>
                </button>
                <div class="dropdown-menu" role="menu" aria-labelledby="sitemessage">
                    <ul>
                        <?php $list_return = $this->list_tag("action=module module=article id=6 num=5"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                        <li class="first">
                            <span class="time"><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span>
                            <a target="_blank" href="<?php echo $t['url']; ?>" title="<?php echo $t['title']; ?>"><?php echo $t['title']; ?></a>
                        </li>
                        <?php } } ?>
                    </ul>
                    <div class="more-messages">
                        <a target="_blank" href="/hd" rel="nofollow">更多</a>
                    </div>
                </div>
            </div>
            <button class="js-toggle-search"><i class="fa fa-search"></i></button>
        </div>
    </div>
</div>