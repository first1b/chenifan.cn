<?php
// 模块的相关文章

if (!$param['tag']) {
    $return_data = $this->_return($system['return'], '没有传入tag参数的内容'); // 没有查询到内容
    return;
}

$sql = [];
$array = explode(',', urldecode($param['tag']));
foreach ($array as $name) {
    $name && $sql[] = '(`title` LIKE "%'.dr_safe_replace($name).'%" OR `keywords` LIKE "%'.dr_safe_replace($name).'%")';
}
$sql && $where[] = [
    'adj' => 'SQL',
    'value' => '('.implode(' OR ', $sql).')'
];
unset($param['tag']);
if (isset($where['tag'])) {
    unset($where['tag']);
}
// 跳转到module方法
if (strpos($system['module'], ',') || $system['module'] == 'all') {
    if (!$system['field']) {
        $system['field'] = 'id,title,url,keywords';
    } elseif (strpos($system['field'], 'keywords') === false) {
        $system['field'] = trim($system['field'], ',');
        $system['field'].= ',keywords';
    }
    require 'Modules.php';
} else {
    require 'Module.php';
}