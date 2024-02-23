<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>【<?php echo $tag['name']; ?>】-澈逆凡-专注分享优质内容</title>
<meta content="<?php echo $tag['name']; ?>,澈逆凡博客,文案,资源,分享快乐.神评论" name="keywords" />
<meta content="【<?php echo $tag['name']; ?>澈逆凡博客（blog）:一个专注分享网络优质内容的自我成长博客;内容涵盖朋友圈句子,网络神评论,惊艳文案短句等.记录生活点滴，随手记-爱分享,才快乐" name="description" />
<link rel="Shortcut Icon" href="/favicon.ico" type="image/x-icon" />
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE;chrome=1">
<meta http-equiv="Content-Language" content="zh-CN" />
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
<body class="archive category category-szj category-12 off-canvas-nav-left">
     <?php if ($fn_include = $this->_include("head.html")) include($fn_include); ?>
    <div id="page-content">
        <div class="container">
            <div class="row">
                <div class="article col-xs-12 col-sm-8 col-md-8">
                    <div class="breadcrumbs">
                        <span itemprop="itemListElement"><i class="fa fa-map-marker"></i></span>
                         <a href="/">首页</a> > <a href='tags.php'>TAG标签</a> ><?php echo $tag['name']; ?> 
                    <h1 style="font-size:6px;">【<?php echo $tag['name']; ?>】-澈逆凡-专注分享优质内容</h1>
                    </div>
                    
                    <div class="ajax-load-box posts-con" id="list001">
                        <?php $list_return = $this->list_tag("action=related module=article field=* tag=$tag[tags] num=5"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                        <div class="ajax-load-con content excerpt-one">
                            <div class="content-box posts-image-box">
                                <div class="posts-default-title">
                                   <div class="post-entry-categories">
                                <?php $list_return_rs = $this->list_tag("action=tag tag=$tag order=rand num=5  return=rs"); if ($list_return_rs && is_array($list_return_rs)) extract($list_return_rs, EXTR_OVERWRITE); $count_rs=dr_count($return_rs); if (is_array($return_rs)) { $key_rs=-1;  foreach ($return_rs as $rs) { $key_rs++; $is_first=$key_rs==0 ? 1 : 0;$is_last=$count_rs==$key_rs+1 ? 1 : 0; ?>
<a href="<?php echo $rs['url']; ?>" title="查看更多“<?php echo $rs['name']; ?>”相关内容"><?php echo $rs['name']; ?></a>
<?php } } ?>
                                    </div>
                                    <h3>
                                        <a href="<?php echo $t['url']; ?>" title="<?php echo $t['title']; ?>"><?php echo $t['title']; ?></a>
                                    </h3>
                                </div>
                                <p class="focus">
                                    <a href="<?php echo $t['url']; ?>" target="_blank" class="thumbnail">
                                        <span class='item'><span class='thumb-span'><img src='<?php echo dr_thumb($t['thumb'], 200, 200); ?>' alt="<?php echo $t['title']; ?>" class='thumbnail lazy'></span></span>
                                    </a>
                                </p>
                                <div class="posts-default-content">
                                    <div class="posts-text"><?php echo dr_strcut($t['description'], 100); ?>...</div>
                                    <div class="posts-default-info">
                                        <ul>
                                            <li class="post-author">
                                                <i class="fa fa-user"></i><a target="_blank"><?php echo $t['author']; ?></a>
                                            </li>
                                            <li class="ico-cat">
                                                <i class="fa fa-list-ul"></i><a href="<?php echo $cat['url']; ?>" target="_blank"><?php echo $cat['name']; ?></a>
                                            </li>
                                            <li class="ico-time">
                                                <i class="fa fa-clock-o"></i><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?>
                                            </li>
                                            <li class="ico-like">
                                                <i class="fa fa-eye"></i><?php echo dr_show_hits($t['id']); ?>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                       <?php } } ?> 
                    </div>
                    <div class="clearfix"></div>
                    <div class="pagebar">
                        <?php echo $pages; ?>
                    </div>
                </div>
                 <?php if ($fn_include = $this->_include("sidebar.html")) include($fn_include); ?>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <?php if ($fn_include = $this->_include("foot.html")) include($fn_include); ?>
</body>
</html>