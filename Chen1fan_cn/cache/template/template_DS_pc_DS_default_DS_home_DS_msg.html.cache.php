<!DOCTYPE html>
<!--[if IE 8]> <html lang="zh-cn" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="zh-cn" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="zh-cn">
<!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <title><?php echo $meta_title; ?></title>
    <meta content="<?php echo $meta_keywords; ?>" name="keywords" />
    <meta content="<?php echo $meta_description; ?>" name="description" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <!-- 主要css开始 -->
    <link href="<?php echo THEME_PATH; ?>assets/icon/css/icon.css" rel="stylesheet" type="text/css" />
    <link href="<?php echo THEME_PATH; ?>assets/global/css/admin.min.css" rel="stylesheet" type="text/css" />
    <!-- 主要css结束 -->
    <!-- 风格css开始 -->
    <link href="<?php echo HOME_THEME_PATH; ?>web/css/style.css" rel="stylesheet" type="text/css" />
    <!-- 风格css结束 -->
    <!-- 系统关键js(所有自建模板必须引用) -->
    <script type="text/javascript">var is_mobile_cms = '<?php echo IS_MOBILE; ?>';</script>
    <script src="<?php echo LANG_PATH; ?>lang.js" type="text/javascript"></script>
    <script src="<?php echo THEME_PATH; ?>assets/global/plugins/jquery.min.js" type="text/javascript"></script>
    <script src="<?php echo THEME_PATH; ?>assets/js/cms.js" type="text/javascript"></script>
    <!-- 系统关键js结束 -->
    <script src="<?php echo THEME_PATH; ?>assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="<?php echo HOME_THEME_PATH; ?>web/scripts/app.min.js" type="text/javascript"></script>
</head>
<body class="page-container-bg-solid">
<div class="page-wrapper">

    <div class="page-wrapper-row">
        <div class="page-wrapper-top">
            <div class="page-header">

                <div class="page-header-top margin-top-40">
                    <div class="container">

                        <div class="page-logo">
                            <a href="<?php echo SITE_URL; ?>">
                                <img src="<?php echo SITE_LOGO; ?>" alt="<?php echo SITE_NAME; ?>" class="logo-default">
                            </a>
                        </div>
                        <div class="page-header-module">
                            <?php if (MOD_DIR && !IS_SHARE) {  echo MODULE_NAME;  } ?>
                        </div>
                        <div class="page-header-search margin-top-10">
                            <form class="search-form" action="<?php echo WEB_DIR; ?>index.php" method="get">
                                <input type="hidden" name="s" value="api">
                                <input type="hidden" name="c" value="api">
                                <input type="hidden" name="m" value="search">
                                <input type="hidden" name="dir" id="dr_search_module_dir" >
                                <div class="input-group">
                                    <div class="input-group-btn btn-group">
                                        <button id="dr_search_module_name" type="button" class="btn default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                            <i class="fa fa-angle-down"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <!--这是来列出全部可以搜索的内容模块-->
                                            <?php $top_search=[]; ?>
                                            <?php $list_return = $this->list_tag("action=cache name=module-content"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                                            <?php if ($t['search']) {  !$top_search && $top_search=$t; ?>
                                            <li><a href="javascript:dr_search_module_select('<?php echo $t['dirname']; ?>', '<?php echo $t['name']; ?>');"> <?php echo $t['name']; ?> </a></li>
                                            <?php } ?>
                                            <?php } } ?>
                                        </ul>
                                    </div>
                                    <input type="text" placeholder="搜索内容..." name="keyword" class="fc-search-keyword form-control">
                                    <div class="input-group-btn">
                                        <button class="btn default" type="submit"> <i class="fa fa-search"></i> </button>
                                    </div>
                                </div>
                                <script>
                                    // 这段js是用来执行搜索的
                                    function dr_search_module_select(dir, name) {
                                        $("#dr_search_module_dir").val(dir);
                                        $("#dr_search_module_name").html(name+' <i class="fa fa-angle-down"></i>');
                                    }
                                    dr_search_module_select('<?php echo MOD_DIR ? MOD_DIR : $top_search['dirname'] ?>', '<?php echo MOD_DIR ? MODULE_NAME : $top_search['name'] ?>');
                                </script>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="page-header-menu margin-top-10">
                    <div class="container">
                        <div class="hor-menu">
                            <ul class="nav navbar-nav">
                                <li id="dr_nav_0" class="menu-dropdown classic-menu-dropdown <?php if ($indexc) { ?>active<?php } ?>">
                                    <a href="<?php echo SITE_URL; ?>" title="<?php echo SITE_NAME; ?>">首页</a>
                                </li>

                                <!--调用共享栏目-->
                                <!--第一层：调用pid=0表示顶级-->
                                <?php $list_return = $this->list_tag("action=category module=share pid=0"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
                                <li class="menu-dropdown classic-menu-dropdown <?php if (IS_SHARE && $catid && dr_in_array($catid, $t['catids'])) { ?> active<?php } ?>">
                                    <a href="<?php echo $t['url']; ?>" title="<?php echo $t['name']; ?>" <?php if ($t['tid']==2) { ?> target="_blank"<?php } ?>><?php echo $t['name']; ?></a>
                                    <?php if ($t['child']) { ?>
                                    <ul class="dropdown-menu pull-left">
                                        <!--第二层：调用第二级共享栏目-->
                                        <?php $list_return_t2 = $this->list_tag("action=category module=share pid=$t[id]  return=t2"); if ($list_return_t2 && is_array($list_return_t2)) extract($list_return_t2, EXTR_OVERWRITE); $count_t2=dr_count($return_t2); if (is_array($return_t2)) { $key_t2=-1;  foreach ($return_t2 as $t2) { $key_t2++; $is_first=$key_t2==0 ? 1 : 0;$is_last=$count_t2==$key_t2+1 ? 1 : 0; ?>
                                        <li class="<?php if ($t2['child']) { ?> dropdown-submenu<?php }  if (IS_SHARE && $catid && dr_in_array($catid, $t2['catids'])) { ?> active<?php } ?>">
                                            <a href="<?php echo $t2['url']; ?>" class="nav-link nav-toggle " title="<?php echo $t2['name']; ?>">
                                                <?php echo $t2['name']; ?>
                                            </a>
                                            <?php if ($t2['child']) { ?>
                                            <ul class="dropdown-menu pull-left">
                                                <!--第三层：调用第三级共享栏目数据-->
                                                <?php $list_return_t3 = $this->list_tag("action=category module=share pid=$t2[id]  return=t3"); if ($list_return_t3 && is_array($list_return_t3)) extract($list_return_t3, EXTR_OVERWRITE); $count_t3=dr_count($return_t3); if (is_array($return_t3)) { $key_t3=-1;  foreach ($return_t3 as $t3) { $key_t3++; $is_first=$key_t3==0 ? 1 : 0;$is_last=$count_t3==$key_t3+1 ? 1 : 0; ?>
                                                <li class="<?php if (IS_SHARE && $catid && dr_in_array($catid, $t3['catids'])) { ?> active<?php } ?>">
                                                    <a href="<?php echo $t3['url']; ?>" title="<?php echo $t3['name']; ?>">
                                                        <?php echo $t3['name']; ?>
                                                    </a>
                                                </li>
                                                <?php } } ?>
                                            </ul>
                                            <?php } ?>
                                        </li>
                                        <?php } } ?>
                                    </ul>
                                    <?php } ?>
                                </li>
                                <?php } } ?>






                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="page-wrapper-row full-height">
        <div class="page-wrapper-middle">
            <div class="page-content">

                <div class="container">

                    <ul class="page-breadcrumb breadcrumb">
                        <li>
                            <a href="<?php echo SITE_URL; ?>">网站首页</a>
                            <i class="fa fa-circle"></i>
                        </li>
                        <li>
                            <span>提示</span>
                        </li>
                    </ul>

                    <div class="search-page">

                        <div class="portlet light ">
                            <div class="portlet-title">
                                <div class="caption">
                                    <span class="caption-subject font-green-sharp"> 提示信息 </span>
                                </div>
                            </div>
                            <div class="portlet-body">
                                <div class="row fc-msg-body">


                                    <div class="col-md-12 text-center">
                                        <?php if ($code) { ?>
                                        <i class="fa fa-check fc-msg-icon font-green-sharp"></i>
                                        <?php } else { ?>
                                        <i class="fa fa-close fc-msg-icon"></i>
                                        <?php } ?>
                                        <label class="fc-msg-info">
                                            <label class="fc-msg-title"><?php echo $msg; ?></label>
                                            <p class="fc-msg-url">
                                                <?php if ($url) { ?>
                                                <a href="<?php echo $url; ?>">如果您的浏览器没有自动跳转，请点击这里</a>
                                                <meta http-equiv="refresh" content="<?php echo $time; ?>; url=<?php echo $url; ?>">
                                                <?php } else { ?>
                                                <a href="<?php echo $backurl; ?>" >[点击返回上一页]</a>
                                                <?php } ?>
                                            </p>
                                        </label>
                                    </div>


                                    <div class="col-md-6 text-right">

                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>

    <div class="page-wrapper-row">
        <div class="page-wrapper-bottom">
            <!-- BEGIN FOOTER -->
            <div class="page-footer">
                <div class="container text-center">  Powered by <a href="http://www.xunruicms.com/" target="_blank">Xunruicms</a> <?php echo CMF_VERSION; ?> 2009-<?php echo date('Y'); ?> &copy; Xunruicms Inc.
                    <a target="_blank" href="http://www.xunruicms.com/"><?php echo SITE_ICP; ?></a>
                    <?php echo SITE_TONGJI; ?>
                </div>
            </div>
            <div class="scroll-to-top">
                <i class="fa fa-arrow-up"></i>
            </div>
        </div>
    </div>
</div>
</body>

</html>