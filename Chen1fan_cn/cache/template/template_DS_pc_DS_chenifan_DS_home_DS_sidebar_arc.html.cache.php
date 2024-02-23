 <div class="sidebar col-xs-12 col-sm-4 col-md-4"> 
   <div class="widget widget_suxingme_postlist"> 
    <h3> <span> 随便看看</span></h3> 
    <ul class="recent-posts-widget">
      <?php $list_return = $this->list_tag("action=module module=news order=rand num=1"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?> 
     <li class="one"> <a href="<?php echo $t['url']; ?>" target="_blank" title="<?php echo $t['title']; ?>"> 
       <div class="overlay"> 
       </div><img class="thumbnail lazy" data-original="<?php echo dr_thumb($t['thumb'], 200, 200); ?>" alt=" <?php echo $t['description']; ?>" />
       <div class="title ">
        <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span>
        <h4><?php echo $t['title']; ?></h4>
       </div></a></li> <?php } } ?> <?php $list_return = $this->list_tag("action=module module=article order=rand num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?> 
     <li class="others ">
      <div class="image ">
       <a href=" <?php echo $t['url']; ?>" target="_blank " title="<?php echo $t['title']; ?>"><img data-original="/pic/<?php echo $t['title']; ?>.jpg" alt="<?php echo $t['title']; ?>" class="thumbnail lazy " /></a>
      </div>
      <div class="title ">
       <h4><a href=" <?php echo $t['url']; ?>" title="<?php echo $t['title']; ?>"><?php echo $t['title']; ?></a></h4>
       <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span>
      </div></li> <?php } } ?> 
    </ul>
   </div>
   <div class="widget widget_suxingme_hotpost ">
    <h3><span>最新发布文章</span></h3>
    <ul class="widget_suxingme_post ">
      <?php $list_return = $this->list_tag("action=module order=updatetime num=3"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?> 
     <li><a href=" <?php echo $t['url']; ?>" target="_blank " title="<?php echo $t['title']; ?>">
       <div class="overlay "></div><img class="thumbnail lazy " data-original="/pic/<?php echo $t['title']; ?>.jpg" alt="<?php echo $t['title']; ?>" />
       <div class="title ">
        <div class="entry - meta ">
         <span><?php echo dr_date($t['_updatetime'], 'Y-m-d'); ?></span>
        </div>
        <h4><?php echo $t['title']; ?></h4>
       </div></a></li> <?php } } ?> 
    </ul>
   </div>
   <div class="widget suxingme_tag ">
    <h3><span>标签</span></h3>
    <div class="widge_tags ">
     <div class="tag - items ">
   <?php $list_return = $this->list_tag("action=tag num=20 order=rand retuen=t2"); if ($list_return && is_array($list_return)) extract($list_return, EXTR_OVERWRITE); $count=dr_count($return); if (is_array($return)) { $key=-1; foreach ($return as $t) { $key++; $is_first=$key==0 ? 1 : 0;$is_last=$count==$key+1 ? 1 : 0; ?>
<a href="<?php echo $t['url']; ?>" title="点击量：<?php echo $t2['name']; ?>"><?php echo $t['name']; ?></a>
<?php } } ?>
      <a href=""></a> 
     </div>
    </div>
   </div>
<div class="widget suxingme_social">
                            <h3>
            <span>关注我们 么么哒！</span></h3>
                            <div class="attentionus">
                                <ul class="items clearfix"> <span class="social-widget-link social-link-qq">
                    <span class="social-widget-link-count">
                        <i class="fa fa-qq"></i>2794138804</span> <span class="social-widget-link-title">QQ号</span>
                                    <a href="http://wpa.qq.com/msgrd?v=3&amp;uin={dede:global.cfg_qq/}&amp;site=qq&amp;menu=yes" rel="nofollow"></a>
                                    </span> <span class="social-widget-link social-link-email">
                    <span class="social-widget-link-count">
                        <i class="fa fa-envelope"></i>2794138804@qq.com</span> <span class="social-widget-link-title">邮箱</span>
                                    <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=2794138804@qq.com" target="_blank" rel="nofollow"></a>
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