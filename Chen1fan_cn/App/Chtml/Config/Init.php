<?php

function chtml_counts($value, $param = [], $data = [], $field = []) {

    $cts = intval($data['counts']);
    if ($cts == 0) {
        return '<a href="javascript:dr_iframe_show(\'统计生成数量\', \''.dr_url('chtml/time/ct_index', ['id' => $data['id']]).'\');" class="btn red btn-xs">开始统计生成数量</a>';
    }

    return '共计'.$cts.'条 / 已生成'.intval($data['htmls'])
        .'条 <a href="javascript:dr_iframe_show(\'统计生成数量\', \''.dr_url('chtml/time/ct_index', ['id' => $data['id']]).'\');" class="btn red btn-xs">重新统计</a>'.
    '<font color="red">'.$data['error'].'</font>';
}