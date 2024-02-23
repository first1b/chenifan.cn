<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo dr_strcut($title, 40); ?>|澈逆凡博客-专注优质内容</title>
<meta content="<?php echo $meta_keywords; ?>" name="keywords" />
<meta content="<?php echo $meta_description; ?>" name="description" />
<link rel="Shortcut Icon" href="/favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Language" content="zh-CN" />
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
<body class="archive category category-szj category-12 off-canvas-nav-left">
    <?php if ($fn_include = $this->_include("head.html")) include($fn_include); ?>
    <div id="page-content">
        <div class="container">
            <div class="row">
                <div class="article col-xs-12 col-sm-8 col-md-8">
                    <div class="breadcrumbs">
                        <span itemprop="itemListElement"><i class="fa fa-map-marker"></i></span>
                        <a href="/">首页</a> > <?php echo dr_catpos($catid, '', true, ' <a href="[url]">[name]</a> '); ?>
                    </div>
                    <div class="actions">
                                <div class="btn-group">
                                    <a href="<?php echo \Phpcmf\Service::L('Router')->search_url($params, 'order', null); ?>" class="btn btn-default <?php if (!$params['order'] || $params['order']=='updatetime') { ?>active<?php } ?>"> <i class="fa fa-clock-o"></i> 时间 </a>
                                    <a href="<?php echo \Phpcmf\Service::L('Router')->search_url($params, 'order', 'hits'); ?>" class="btn btn-default <?php if ($params['order']=='hits') { ?>active<?php } ?>"> <i class="fa fa-eye"></i> 浏览量 </a>
            
                                    <a href="<?php echo \Phpcmf\Service::L('Router')->search_url($params, 'order', 'support'); ?>" class="btn btn-default <?php if ($params['order']=='support') { ?>active<?php } ?>"> <i class="fa fa-digg"></i> 点赞 </a>
                                </div>
                            </div>
                    <div class="ajax-load-box posts-con" id="list001">
                        <?php $list_return = $this->list_tag("action=module module=news catid=$cat[id] page=1 num=10"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                        <div class="ajax-load-con content excerpt-one">
                            <div class="content-box posts-image-box">
                                <div class="posts-default-title">
                                  
                                    <h2>
                                        <a href="<?php echo $t['url']; ?>" tsarget="_blank"  title="<?php echo $t['title']; ?>"><?php echo $t['title']; ?></a>
                                    </h2>
                                </div>
                                <p class="focus">
                                    <a href="<?php echo $t['url']; ?>" target="_blank" class="thumbnail">
                                        <span class='item'><span class='thumb-span'><img src="/pic/<?php echo $t['title']; ?>.jpg" class='thumbnail lazy'></span></span>
                                    </a>
                                </p>
                                <div class="posts-default-content">
                                    <div class="posts-text"><?php echo $t['description']; ?>...</div>
                                    <div class="posts-default-info">
                                        <ul>
                                            <li class="post-author">
                                                <i class="fa fa-user"></i><a target="_blank">小澈</a>
                                            </li>
                                            <li class="ico-cat">
                                                <i class="fa fa-list-ul"></i><a href="<?php echo $cat['url']; ?>" target="_blank"><?php echo $cat['name']; ?></a>
                                            </li>
                                            <li class="ico-time">
                                                <i class="fa fa-clock-o"></i><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?>
                                            </li>
                                            <li class="ico-like">
                                                <i class="fa fa-eye"></i><?php echo $t['hits']; ?>
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
            </div><?php if ($fn_include = $this->_include("sidebar.html")) include($fn_include); ?>
        </div>
    </div>
    <div class="clearfix"></div>
    <?php if ($fn_include = $this->_include("foot.html")) include($fn_include); ?>
</body>
</html>