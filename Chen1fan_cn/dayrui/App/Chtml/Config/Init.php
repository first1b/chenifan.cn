<?php

if (!is_file(dr_get_app_dir('module').'Libraries/Category.php')) {
    $this->_admin_msg(0, '内容系统插件需要升级到最新版本');
}

function chtml_counts($value, $param = [], $data = [], $field = []) {

    $cts = intval($data['counts']);
    if ($cts == 0) {
        return '<a href="javascript:dr_iframe_show(\'统计生成数量\', \''.dr_url('chtml/time/ct_index', ['id' => $data['id']]).'\');" class="btn red btn-xs">开始统计生成数量</a>';
    }

    return '共计'.$cts.'条 / 已生成'.intval($data['htmls'])
        .'条 <a href="javascript:dr_iframe_show(\'统计生成数量\', \''.dr_url('chtml/time/ct_index', ['id' => $data['id']]).'\');" class="btn red btn-xs">重新统计</a>'.
    '<font color="red">'.$data['error'].'</font>';
}

function chtml_cat_counts($value, $param = [], $data = [], $field = []) {

    $cts = intval($data['counts']);
    if ($cts == 0) {
        return '<a class="btn red btn-xs">未生成</a>'.
            '<font color="red">'.$data['error'].'</font>';
    }

    return '共计'.$cts.'条 / 已生成'.intval($data['htmls'])
        .'条 '.
    '<font color="red">'.$data['error'].'</font>';
}