<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $meta_title; ?></title>
<meta content="<?php echo $meta_keywords; ?>" name="keywords" />
<meta content="<?php echo $meta_description; ?>" name="description" />
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <link rel="canonical" href="https://www.chenifan.cn" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE;chrome=1">
    <meta http-equiv="Content-Language" content="zh-CN" />
    <link rel='stylesheet' id='animate-css' href='/skin/css/font-awesome.css' type='text/css' media='all' />
    <link rel='stylesheet' id='carousel-css' href='/skin/css/owl.carousel.css' type='text/css' media='all' />
    <link rel='stylesheet' id='mcustomscrollbar-css' href='/skin/css/jquery.mcustomscrollbar.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='animate-css' href='/skin/css/animate.css' type='text/css' media='all' />
    <link rel='stylesheet' id='fontello-css' href='/skin/css/fontello.css' type='text/css' media='all' />
    <link rel='stylesheet' id='bootstrap-css' href='/skin/css/bootstrap.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='Grace-style-css' href='/skin/css/style.css' type='text/css' media='all' />
    <script type='text/javascript' src='/skin/js/jquery.js'></script>
    <script type='text/javascript' src='/skin/js/jquery-migrate.min.js'></script>
    <script type="text/javascript" src="/skin/js/jquery.SuperSlide.2.1.1.js"></script>
    <script type="text/javascript">var is_mobile_cms = '<?php echo IS_MOBILE; ?>';</script>
<script src="<?php echo LANG_PATH; ?>lang.js" type="text/javascript"></script>
<script src="/static/assets/js/cms.js" type="text/javascript"></script>
<style>
    #banner123 ul li{
      display: none;
    }
    #banner_show li.active{
      display: block;
    }
</style>
// <script>
//  onload=function(){
//      $("#banner_show li:first").addClass("active");
//         }
// setInterval(function(){
//         $("#banner_show li").siblings('li').removeClass('active');  // 删除其他兄弟元素的样式
//         $("#banner_show li").next().addClass('active');
//         if($("#banner_show li:last").attr('class')='active'){
//             //   $("#banner_show li").siblings('li').removeClass('active');  // 删除其他兄弟元素的样式
//             //   $("#banner_show li:first").addClass("active");
//           }

// },3000);
          
// </script>
</head>
<body class="home blog off-canvas-nav-left"><?php if ($fn_include = $this->_include("head.html")) include($fn_include); ?>
    <div id="page-content">
        <div class="top-content">
            <div class="container">
                <div class="row">
                    <div id="slideBox" class="slideBox">
                        <div class="hd">
                            <ul>
                                <li>1</li>
                            </ul>
                        </div>
                        <div class="bd" id="banner123">
                            <ul id="banner_show"> <?php if (dr_site_value('hdtp')) { foreach (dr_site_value('hdtp') as $v) { ?>
                                    <li class="active">
                                        <a href="<?php echo $v[3]; ?>" target="_blank" title="<?php echo $v[2]; ?>">
                                         <div class="img" style="background-image:url( <?php echo dr_get_file($v[1]); ?>"></div>
                                        <div class="banner_title">
                                            <h3> <?php echo $v[2]; ?></h3></div>
                                             </a>
                                    </li>
                                <?php } } ?>
                            </ul>
                        </div>
                    </div>
                    
                    
                    <script type="text/javascript">jQuery(".slideBox").slide({mainCell:".bd ul",autoPlay:true});</script>
                    <div class="hot-articles">
                        <div class="hots-content">
                            <div class="hots-headline">头条</div> <?php $list_return = $this->list_tag("action=module module=article flag=1 num=1"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="hots-item">
                                <a href="<?php echo $t['url']; ?>" target="_blank" title="<?php echo $t['title']; ?>">
                                    <div class="hots-image" style="background-image:url( <?php echo dr_thumb($t['thumb'], 200, 200); ?>)"></div>
                                    <h3>
                                        <i class="fa fa-chevron-right"></i>
                                        <span><?php echo $t['title']; ?></span>
                                    </h3></a>
                            </div> <?php } } ?> <?php $list_return = $this->list_tag("action=module module=article flag=1 num=1,2"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="hots-title"> <i class="fa fa-chevron-right"></i> <a href="<?php echo $t['url']; ?>" target="_blank"><?php echo $t['title']; ?></a> </div> <?php } } ?> </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="recommend-content">
            <div class="container">
                <div class="row">
                    <div class="cat">
                        <div class="thumbnail-cat"> <?php $list_return = $this->list_tag("action=module module=article flag=3 num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="image">
                                <div class="index-cat-box" style="background-image:url( <?php echo dr_thumb($t['thumb'], 200, 200); ?>)">
                                    <a class="istop" href="<?php echo $t['url']; ?>" target="_blank">
                                        <div class="overlay"></div>
                                        <div class="title"> <span><?php echo $t['name']; ?></span>
                                            <h3><?php echo $t['title']; ?></h3> </div>
                                    </a>
                                </div>
                            </div> <?php } } ?> </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="container">
                <div class="row">
                    <div class="article col-xs-12 col-sm-8 col-md-8">
                        <div class="ajax-load-box posts-con" id="index001"> 
<?php $list_return = $this->list_tag("action=module module=article flag=4 num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="ajax-load-con content excerpt-one">
                                <div class="content-box posts-image-box">
                                    <div class="posts-default-title">
                                        <div class="post-entry-categories"><?php if (isset($tags) && is_array($tags)) { $key_url=-1;$count_url=dr_count($tags);foreach ($tags as $name=>$url) { $key_url++; $is_first=$key_url==0 ? 1 : 0;$is_last=$count_url==$key_url+1 ? 1 : 0; ?> <a href="<?php echo $url; ?>" target="_blank"><?php echo $name; ?></a> <?php } } ?></div>
                                        <h2><a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank"><?php echo $t['title']; ?></a></h2> </div>
                                    <p class="focus"> <a href="<?php echo $t['url']; ?>" class="thumbnail" target="_blank">
                                            <span class='item'><span class='thumb-span'><img src=" <?php echo dr_thumb($t['thumb'], 200, 200); ?> " class='thumb lazy'></span></span>
                                        </a> </p>
                                    <div class="posts-default-content">
                                        <div class="posts-text"><?php echo dr_strcut($t['description'], 120); ?>...</div>
                                        <div class="posts-default-info">
                                            <ul>
                                                <li class="post-author"> <i class="fa fa-user"></i><a>小澈</a> </li>
                                                <li class="ico-cat"> <i class="fa fa-list-ul"></i> <a href="[field:typeurl /]" rel="nofollow"><?php echo $cat['name']; ?></a> </li>
                                                <li class="ico-time"> <i class="fa fa-clock-o"></i><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?> </li>
                                                <!--<li class="ico-like"> <i class="fa fa-eye"></i><?php echo dr_show_hits($t['id']); ?></li>-->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> <?php } } ?> 
                            <?php $list_return = $this->list_tag("action=module module=news num=2"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="ajax-load-con content excerpt-one">
                                <div class="content-box posts-image-box">
                                    <div class="posts-default-title">
                                        <div class="post-entry-categories"><?php if (isset($tags) && is_array($tags)) { $key_url=-1;$count_url=dr_count($tags);foreach ($tags as $name=>$url) { $key_url++; $is_first=$key_url==0 ? 1 : 0;$is_last=$count_url==$key_url+1 ? 1 : 0; ?> <a href="<?php echo $url; ?>" target="_blank"><?php echo $name; ?></a> <?php } } ?></div>
                                        <h2><a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank"><?php echo $t['title']; ?></a></h2> </div>
                                    <p class="focus"> <a href="<?php echo $t['url']; ?>" class="thumbnail" target="_blank">
                                            <span class='item'><span class='thumb-span'><img src="/pic/<?php echo $t['title']; ?>.jpg" class='thumb lazy'></span></span>
                                        </a> </p>
                                    <div class="posts-default-content">
                                        <div class="posts-text"><?php echo dr_strcut($t['description'], 120); ?>...</div>
                                        <div class="posts-default-info">
                                            <ul>
                                                <li class="post-author"> <i class="fa fa-user"></i><a>小澈</a> </li>
                                                <li class="ico-cat"> <i class="fa fa-list-ul"></i> <a href="<?php echo $cat['url']; ?>" rel="nofollow"><?php echo $cat['name']; ?></a> </li>
                                                <li class="ico-time"> <i class="fa fa-clock-o"></i><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?> </li>
                                                <!--<li class="ico-like"> <i class="fa fa-eye"></i><?php echo dr_show_hits($t['id']); ?></li>-->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> <?php } } ?> 
<?php $list_return = $this->list_tag("action=module module=article num=5"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <div class="ajax-load-con content excerpt-one">
                                <div class="content-box posts-image-box">
                                    <div class="posts-default-title">
                                        <div class="post-entry-categories"><?php if (isset($tags) && is_array($tags)) { $key_url=-1;$count_url=dr_count($tags);foreach ($tags as $name=>$url) { $key_url++; $is_first=$key_url==0 ? 1 : 0;$is_last=$count_url==$key_url+1 ? 1 : 0; ?> <a href="<?php echo $url; ?>" target="_blank"><?php echo $name; ?></a> <?php } } ?></div>
                                        <h2><a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank"><?php echo $t['title']; ?></a></h2> </div>
                                    <p class="focus"> <a href="<?php echo $t['url']; ?>" class="thumbnail" target="_blank">
                                            <span class='item'><span class='thumb-span'><img src="/pic/<?php echo $t['title']; ?>.jpg" class='thumb lazy'></span></span>
                                        </a> </p>
                                    <div class="posts-default-content">
                                        <div class="posts-text"><?php echo dr_strcut($t['description'], 120); ?>...</div>
                                        <div class="posts-default-info">
                                            <ul>
                                                <li class="post-author"> <i class="fa fa-user"></i><a>小澈</a> </li>
                                                <li class="ico-cat"> <i class="fa fa-list-ul"></i> <a href="<?php echo $cat['url']; ?>" rel="nofollow"><?php echo $cat['name']; ?></a> </li>
                                                <li class="ico-time"> <i class="fa fa-clock-o"></i><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?> </li>
                                                <!--<li class="ico-like"> <i class="fa fa-eye"></i><?php echo dr_show_hits($t['id']); ?></li>-->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> <?php } } ?> </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="sidebar col-xs-12 col-sm-4 col-md-4">
                        <div class="widget widget_suxingme_postlist">
                            <h3><span>随便看看</span></h3>
                            <ul class="recent-posts-widget"> <?php $list_return = $this->list_tag("action=module module=article order=RAND num=1"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                                <li class="one">
                                    <a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank">
                                        <div class="overlay"></div> <img class="thumbnail lazy" data-original=" <?php echo dr_thumb($t['thumb'], 200, 200); ?>" alt="<?php echo $keywords; ?>" />
                                        <div class="title"> <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span>
                                            <h4><?php echo $t['title']; ?></h4> </div>
                                    </a>
                                </li> <?php } } ?> <?php $list_return = $this->list_tag("action=module module=article order=rand num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                                <li class="others">
                                    <div class="image">
                                        <a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank"> <img data-original=" <?php echo dr_thumb($t['thumb'], 200, 200); ?>" alt="<?php echo $keywords; ?>" class="thumbnail" /></a>
                                    </div>
                                    <div class="title">
                                        <h4><a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank"><?php echo $t['title']; ?></a></h4> <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span> </div>
                                </li> <?php } } ?> </ul>
                        </div>
                        <div class="widget widget_suxingme_hotpost">
                            <h3><span>热门文章</span></h3>
                            <ul class="widget_suxingme_post"> <?php $list_return = $this->list_tag("action=module module=article order=hits num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                                <li>
                                    <a href="<?php echo $t['url']; ?>" title="<?php echo $keywords; ?>" target="_blank">
                                        <div class="overlay"></div> <img class="thumbnail lazy" data-original=" <?php echo dr_thumb($t['thumb'], 200, 200); ?>" alt="<?php echo $keywords; ?>" />
                                        <div class="title">
                                            <div class="entry-meta"> <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span> </div>
                                            <h4><?php echo $t['title']; ?></h4> </div>
                                    </a>
                                </li> <?php } } ?> </ul>
                        </div>
                        <div class="widget suxingme_tag">
                            <h3>
            <span>热门标签</span></h3>
                            <div class="widge_tags">
                                <div class="tag-items"> <?php $list_return_t2 = $this->list_tag("action=tag num=20 order=rand  return=t2"); if ($list_return_t2 && is_array($list_return_t2)) extract($list_return_t2, EXTR_OVERWRITE); $count_t2=dr_count($return_t2); if (is_array($return_t2)) { $key_t2=-1;  foreach ($return_t2 as $t2) { $key_t2++; $is_first=$key_t2==0 ? 1 : 0;$is_last=$count_t2==$key_t2+1 ? 1 : 0; ?>
 <a href="<?php echo $t2['url']; ?>" rel="nofollow" title="<?php echo $t['name']; ?>" target="_blank"><?php echo $t2['name']; ?></a>
<?php } } ?> </div>


                            </div>
                        </div>
                        <div class="widget suxingme_social">
                            <h3>
            <span>关注我们 么么哒！</span></h3>
                            <div class="attentionus">
                                <ul class="items clearfix"> <span class="social-widget-link social-link-qq">
                    <span class="social-widget-link-count">
                        <i class="fa fa-qq"></i>2794138804</span> <span class="social-widget-link-title">QQ号</span>
                                    <a href="http://wpa.qq.com/msgrd?v=3&uin={dede:global.cfg_qq/}&site=qq&menu=yes" rel="nofollow"></a>
                                    </span> <span class="social-widget-link social-link-email">
                    <span class="social-widget-link-count">
                        <i class="fa fa-envelope"></i>2794138804@qq.com</span> <span class="social-widget-link-title">邮箱</span>
                                    <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=2794138804@qq.com" target="_blank" rel="nofollow"></a>
                                    </span> <span class="social-widget-link social-link-wechat">
                    <span class="social-widget-link-count">
                        <i class="fa fa-weixin"></i>运营贩</span> <span class="social-widget-link-title">百家号</span>
                                    <a id="tooltip-s-weixin" href="javascript:void(0);"></a>
                                    </span>
                                    <!--<span class="social-widget-link social-link-wechat">
                    <span class="social-widget-link-count">
                        <i class="fa fa-weixin"></i>澈逆凡博客</span>
                    <span class="social-widget-link-title">微信公众号</span>
                    <a id="tooltip-s-weixin" href="javascript:void(0);"></a>
                </span>--></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="clearfix"></div> 
    <div id="footer" class="two-s-footer clearfix">
    <div class="footer-box">
        <div class="container">
            <div class="social-footer">
                <a class="weiboii" href="http://weibo.com/"  rel="nofollow" target="_blank">
                    <i class="fa fa-weibo"></i>
                </a>
                <a class="ttweiboii" href="http://t.qq.com/" target="_blank" rel="nofollow">
                    <i class="fa fa-tencent-weibo"></i>
                </a>
                <a class="mailii" href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=1812215600@qq.com" rel="nofollow" target="_blank">
                    <i class="fa fa-envelope"></i>
                </a>
                 <a class="qqii" href="http://wpa.qq.com/msgrd?v=1&uin=1812215600&site=qq&menu=yes" rel="nofollow"  target="_blank">
                    <i class="fa fa-qq"></i>
                </a>
                <a id="tooltip-f-weixin" class="wxii" href="javascript:void(0);">
                    <i class="fa fa-weixin"></i>
                </a>
            </div>
            <div class="nav-footer">
                <a href="/">首页</a>
                <?php $list_return = $this->list_tag("action=category module=share pid=0"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?> 
                <a href="<?php echo $t['url']; ?>"><?php echo $t['name']; ?></a>
                <?php } } ?>
            </div>
            <div class="copyright-footer">
                <!--<p>Copyright ©     备案号：<a href="https://beian.miit.gov.cn/" rel="nofollow" target="_blank"></a></p>-->
            </div>
            <div class="links-footer">
                <span>友情链接：</span>
                <?php $yqlj=dr_site_value('yqlj');  if (isset($yqlj) && is_array($yqlj)) { $key_a=-1;$count_a=dr_count($yqlj);foreach ($yqlj as $a) { $key_a++; $is_first=$key_a==0 ? 1 : 0;$is_last=$count_a==$key_a+1 ? 1 : 0;?>
<a href="<?php echo $a[2]; ?>" target="_blank"><?php echo $a[1]; ?></a>
<?php } } ?>
            </div>
        </div>
    </div>
</div>
<div class="search-form">
    <!--##form class="sidebar-search" method="get" action="/search.php">-->
    <?php if (isset($kws) && is_array($kws)) { $key_url=-1;$count_url=dr_count($kws);foreach ($kws as $name=>$url) { $key_url++; $is_first=$key_url==0 ? 1 : 0;$is_last=$count_url==$key_url+1 ? 1 : 0; ?>
<a href="<?php echo $url; ?>" target="_blank"><?php echo $name; ?></a>
<?php } } ?>
        <input type="hidden" name="kwtype" value="0" />
        <div class="search-form-inner">
            <div class="search-form-box">
                <input class="form-search" type="text" name="q" placeholder="键入搜索关键词">
                <button type="submit" id="btn-search">
                    <i class="fa fa-search"></i>
                </button>
            </div>
        </div>

    <div class="close-search">
        <span class="close-top"></span>
        <span class="close-bottom"></span>
    </div>
</div>
<div class="f-weixin-dropdown">
    
    <div class="tooltip-weixin-inner">
        <h3>关注站长百家号</h3>
        <div class="qcode"><img src="/skin/img/bjh.png" width="160" height="160" alt="百家号"></div>
    </div>
    <div class="close-weixin">
        <span class="close-top"></span>
        <span class="close-bottom"></span>
    </div>
</div>
<script type="text/javascript" src='/skin/js/fancybos.js'></script>
<script type='text/javascript' src='/skin/js/bootstrap.min.js'></script>
<script type='text/javascript' src='/skin/js/jquery.mcustomscrollbar.concat.min.js'></script>
<script type='text/javascript' src='/skin/js/jquery.resizeend.js'></script>
<script type='text/javascript' src='/skin/js/jquery.sticky-kit.min.js'></script>
<script type='text/javascript'>/* <![CDATA[ */
    var suxingme_url = {
        "roll": "",
        "headfixed": "1",
        "slidestyle": "index_no_slide",
        "wow": "1"
    };
    /* ]]> */
    </script>
<script type='text/javascript' src='/skin/js/suxingme.js'></script>
<script type='text/javascript' src='/skin/js/jquery.bootstrap-autohidingnavbar.min.js'></script>
<script type='text/javascript' src='/skin/js/jquery.lazyload.min.js'></script>
<script type='text/javascript' src='/skin/js/wow.min.js'></script>
<script type='text/javascript' src='/skin/js/ajax-comment.js'></script>
<script type='text/javascript' src='/skin/js/fancybox.js'></script>
<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>
<script>
(function(){
var src = "https://s.ssl.qhres2.com/ssl/ab77b6ea7f3fbf79.js";
document.write('<script src="' + src + '" id="sozz"><\/script>');
})();
</script>

</body>
</html>