<?php
// 栏目

if (!$dirname) {
    $dirname = 'share';
}

$module = \Phpcmf\Service::L('cache')->get('module-'.$system['site'].'-'.$dirname);
if (!$module) {
    return $this->_return($system['return'], "模块({$dirname})尚未安装");
} elseif (!$module['category']) {
    return $this->_return($system['return'], "模块({$dirname})没有栏目数据");
}

$show = isset($param['show']) ? 1 : 0; // 有show参数表示显示隐藏栏目
$return = [];

if (isset($param['id']) && $param['id']) {
    $arr = explode(',', $param['id']);
    if ($arr) {
        $new = [];
        foreach ($arr as $t) {
            if ($t && isset($module['category'][$t]) && $module['category'][$t]) {
                $new[$t] = $module['category'][$t];
            }
        }
        $module['category'] = $new;
    }
}

if ($module['category']) {
    foreach ($module['category'] as $t) {
        if (!$t['show'] && !$show) {
            continue;
        } elseif (isset($param['pid']) && $t['pid'] != (int)$param['pid']) {
            continue;
        } elseif (isset($param['mid']) && $t['mid'] != $param['mid']) {
            continue;
        } elseif (isset($param['child']) && $t['child'] != (int)$param['child']) {
            continue;
        } elseif (isset($param['ismain']) && $t['ismain'] != (int)$param['ismain']) {
            continue;
        } elseif (isset($system['more']) && !$system['more']) {
            unset($t['field'], $t['setting']);
        }
        if ($t['tid'] == 2) {
            // 外链栏目
        } else {
            $t['url'] = dr_url_prefix($t['url'], $dirname, $system['site'], $this->_is_mobile);
        }
        $return[] = $t;
    }
}

// num参数
if ($system['num']) {
    if (is_numeric($system['num'])) {
        $return = array_slice($return, 0, $system['num']);
    } elseif (strpos($system['num'], ',') !== false) {
        list($a, $b) = explode(',', $system['num']);
        $return = array_slice($return, max(0, $a - 1), $b);
    }
}

// order
if ($system['order']) {
    $arr = explode(',', $system['order']);
    foreach ($arr as $t) {
        $a = explode('_', $t);
        $b = strtolower(end($a));
        if (in_array($b, ['desc', 'asc', 'instr'])) {
            $a = str_replace('_'.$b, '', $t);
        } else {
            $a = $t;
            $b = 'desc';
        }
        if ($b == 'instr') {

        } else {
            $return = dr_array_sort($return, $a, $b);
        }
    }
}

if (!$return) {
    return $this->_return($system['return'], '没有匹配到内容');
}

return $this->_return($system['return'], $return, '');