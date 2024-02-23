<?php

// 写自定义函数，把函数放在里面，当前模块都能调用它
if (!is_file(dr_get_app_dir('module').'Libraries/Category.php')) {
    $this->_admin_msg(0, '内容系统插件需要升级到最新版本');
}

// 获取模型ID
// $name 模型名称
function get_module_id($name)
{
    $rt = \Phpcmf\Service::M()->db->table('module')->select('id')->where("dirname", $name)->get();
    $rows = $rt->getResultArray();
    $result = $rows[0]['id'];
    return $result;
}