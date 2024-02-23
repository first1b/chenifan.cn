
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title; ?>-澈逆凡博客</title>
<meta content="<?php echo $meta_keywords; ?>" name="keywords" />
<meta content="<?php echo $meta_description; ?>" name="description" />
<link rel="Shortcut Icon" href="/favicon.ico" type="image/x-icon" />
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE;chrome=1">
<link rel='stylesheet' id='animate-css' href='/skin/css/font-awesome.css' type='text/css' media='all' />
<link rel='stylesheet' id='mcustomscrollbar-css' href='/skin/css/jquery.mcustomscrollbar.min.css' type='text/css' media='all' />
<link rel='stylesheet' id='animate-css' href='/skin/css/animate.css' type='text/css' media='all' />
<link rel='stylesheet' id='fontello-css' href='/skin/css/fontello.css' type='text/css' media='all' />
<link rel='stylesheet' id='bootstrap-css' href='/skin/css/bootstrap.min.css' type='text/css' media='all' />
<link rel='stylesheet' id='Grace-style-css' href='/skin/css/style.css' type='text/css' media='all' />
<script type='text/javascript' src='/skin/js/jquery.js'></script>
<script type='text/javascript' src='/skin/js/jquery-migrate.min.js'></script>
<!--[if lt IE 9]>
    <script type='text/javascript' src='/skin/js/html5shiv.js'></script>
<![endif]-->
<!--[if lt IE 9]>
    <script type='text/javascript' src='/skin/js/respond.min.js'></script>
<![endif]-->
</head>
<body class="post-template-default single single-post postid-917 single-format-aside off-canvas-nav-left">
    <?php if ($fn_include = $this->_include("head.html")) include($fn_include); ?>
    <div id="page-content">
        <div class="container">
            <div class="row">
                <div class="article col-xs-12 col-sm-8 col-md-8">
                    <div class="breadcrumbs">
                        <span itemprop="itemListElement"><i class="fa fa-map-marker"></i></span>
                        <a href="/">首页</a> > <?php echo dr_catpos($catid, '', true, ' <a href="[url]">[name]</a> '); ?> > <?php echo $title; ?>
                    </div>
                    <div class="post">
                        <div class="post-title">
                          
                            <h1 class="title"><?php echo $title; ?></h1>
                            <div class="post_icon">
                                <span class="postauthor"><i class="fa fa-user"></i><?php echo $author; ?></span>
                                <span class="postcat">
                                    <i class="fa fa-list-ul"></i>
                                    <a href="<?php echo $cat['url']; ?>"><?php echo $cat['name']; ?></a></span>
                                <span class="postclock">
                                    <i class="fa fa-clock-o"></i>发布时间：<?php echo dr_date($_updatetime, 'Y-m-d'); ?></span>
                                <span class="postlike">
                                    <i class="fa fa-eye"></i>
                                    <i id="eyou_arcclick" class="eyou_arcclick" style="font-style:normal"><?php echo dr_show_hits($id); ?></i>
                                </span>
                            </div>
                        </div>
                        <div class="post-content" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <img src="/pic/<?php echo $title; ?>.jpg" alt="<?php echo $title; ?>">
                            <?php echo dr_content_link($kws, $content, 1); ?><br>本文链接：<?php echo $my_web_url; ?><br>
                            
<p style="color:#C0C0C0">>>免责声明：本网站部分内容来源于互联网或用户投稿，内容版权归原作者所有，文章观点为原作者独立发表，不代表澈逆凡博客立场，不对其真实性、准确性负责！如本站内容侵犯了您的权益，我们也会在第一时间予以删除！</br> >  <?php echo $title; ?> </p>
                        </div>

                        <div class="su-dropdown paydropdown">
                            <a href="javascript:;" class="pay-author" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="打赏站长">
                                <i class="fa fa-qrcode"></i>
                                <span>打赏</span></a>
                            <div class="su-dropbox pay-allqr" aria-labelledby="pay-qr">
                                <ul>
                                    <li class="alipay">
                                        <img alt="打赏" src="/skin/img/alipay.jpg">
                                        <!--<b>支付宝扫一扫</b>-->
                                    </li>
                                    <li class="weixinpay">
                                        <!--<img alt="打赏" src="/skin/img/wx.jpg">-->
                                        <b>微信扫一扫</b>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="posts-cjtz content-cjtz clearfix"></div>
                    <div class="next-prev-posts clearfix">
                        <div class="prev-post"><?php if ($prev_page) { ?><a href="<?php echo $prev_page['url']; ?>" class="prev has-background"><span>上一篇：</span><h4><?php echo $prev_page['title']; ?></h4></a><?php } else { ?><a class="prev has-background"><span>上一篇：</span><h4>没有了</h4></a><?php } ?></div>
                        <div class="next-post"><?php if ($next_page) { ?><a href="<?php echo $next_page['url']; ?>" class="nextv has-background"><span>下一篇：</span><h4><?php echo $next_page['title']; ?></h4></a><?php } else { ?><a class="nextv has-background"><span>下一篇：</span><h4>没有了</h4></a><?php } ?></div>
                    </div>
                    <div class="related-post">
                        <h3><span>猜你喜欢</span></h3>
                        <ul>
                            <?php $list_return = $this->list_tag("action=module module=article catid=$cat[id] order=RAND num=6"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                            <li>
                                <div class="item">
                                    <a href="<?php echo $t['url']; ?>" title="<?php echo $t['title']; ?>">
                                        <div class="overlay"></div>
                                        <img class="thumbnail" src="<?php echo dr_thumb($t['thumb'], 200, 200); ?>" alt="<?php echo $t['description']; ?>">
                                        <h4><span><?php echo $t['title']; ?></span></h4>
                                    </a>
                                </div>
                            </li>
                            <?php } } ?>
                        </ul>
                    </div>
                    <div class="clear"></div>
                </div>
    <?php if ($fn_include = $this->_include("sidebar_arc.html")) include($fn_include); ?>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <?php if ($fn_include = $this->_include("foot.html")) include($fn_include); ?>
</body>
</html>