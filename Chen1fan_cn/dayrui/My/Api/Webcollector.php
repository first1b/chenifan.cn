<?php
// 本程序用于WebCollector火车头采集插件，如果您未使用，可以删除
// 验证配置信息开始

if ($_GET['action'] == '' || $_GET['token'] == '') {
    //\Phpcmf\Service::M('member')->admin_notice(0, 'app', $this->member, "测试通知标题", 'webcollector/collectrules/index');
    exit("配置不正确，发布模块缺少必要的参数，请检查发布地址");
};
// 获取token对应的规则
$rule = \Phpcmf\Service::M('my', 'webcollector')->get_present_rule($_GET['token']);
if (!$rule) {
    exit("没有对应的配置规则，请在后台重新配置");
}
if ((int)$rule[0]['status'] !== 1) {
    exit("采集规则名称为《" . $rule[0]['rulename'] . "》的规则已被禁用，请在后台重新打开");
}
// 验证配置信息结束

$module_id = $rule[0]['moduleid'];
$module_name = \Phpcmf\Service::M('my', 'webcollector')->get_module_name($module_id)[0]['dirname'];
$this->_module_init($module_name); // news 是模块目录

if ($_GET['action'] == 'category') {
    $this->module['category'] = \Phpcmf\Service::L('category', 'module')->get_category($this->module['share'] ? 'share' : $this->module['dirname']);
    if (!$this->module['category']) {
        echo '模块【' . $this->module['dirname'] . '】没有创建栏目';
    }
    foreach ($this->module['category'] as $t) {
        if ($t['child'] == 0 && $t['tid'] == 1) {
            echo '<h1>' . $t['name'] . '<=>' . $t['id'] . '</h1>' . PHP_EOL;
        }
    }
} else {
    // 当前模型中包含的所有字段信息
    $module_fields = \Phpcmf\Service::M('my', 'webcollector')->get_module_fields($module_id);
    $data = $_POST;

    // 发布者id 1
    // $data['uid'] = 1;

    if (!$data['catid']) {
        exit('错误，栏目ID不能为空');
    }
    $catchild = \Phpcmf\Service::M('my', 'webcollector')->check_category($module_id, $data['catid'])['child'];
    if ($catchild == 1 || $catchild == NULL) {
        exit('错误，模块下没有对应的栏目或者要发布的栏目不是终级栏目');
    }
    // 发布者笔名 admin
    $data['author'] = $data['author'] ?: 'admin';

    // 主表字段
    $fields[1] = $this->get_cache('table-' . SITE_ID, $this->content_model->dbprefix(SITE_ID . '_' . MOD_DIR));
    $cache = $this->get_cache('table-' . SITE_ID, $this->content_model->dbprefix(SITE_ID . '_' . MOD_DIR . '_category_data'));
    $cache && $fields[1] = array_merge($fields[1], $cache);

    // 附表字段
    $fields[0] = $this->get_cache('table-' . SITE_ID, $this->content_model->dbprefix(SITE_ID . '_' . MOD_DIR . '_data_0'));

    // 去重复
    $fields[0] = array_unique($fields[0]);
    $fields[1] = array_unique($fields[1]);

    // 开始归类存储

    $save = [];

    // 主表附表归类
    foreach ($fields as $ismain => $field) {
        foreach ($field as $name) {
            isset($data[$name]) && $save[$ismain][$name] = $data[$name];
        }
    }

    //格式化入库字段
    for ($i = 0; $i < 2; $i++) {
        foreach ($save[$i] as $key => $value) {
            $fieldArray = [];
            foreach ($module_fields as $k => $v) {
                if ($v['fieldname'] == $key) {
                    $fieldArray = $module_fields[$k];
                }
            }
            if ($fieldArray['fieldtype']) {
                // 查找对应的格式化函数
                $fun = \Phpcmf\Service::M('fields', 'webcollector')->format($fieldArray['fieldtype']);
                //如果指定的格式化函数存在，则使用函数格式化数据
                if ($fun) {
                    $save[$i][$key] = \Phpcmf\Service::M('fields', 'webcollector')->$fun($fieldArray, $save[$i][$key]);
                }
            }
        }
    }

    // 用户ID存在，则设为用户ID，不存在，设为默认用户ID:1
    $save[1]['uid'] = $save[0]['uid'] = $data['uid'] ? $data['uid'] : 1;
    $save[1]['catid'] = $save[0]['catid'] = $data['catid'];

    $save[1]['url'] = ''; // 地址留空，系统会自动生成
    $save[1]['status'] = $save[1]['status'] ? ($save[1]['status'] == 1 ? 1 : 9) : 9; //9表示正常发布，1表示审核里面
    $save[1]['hits'] = rand(1, 2200); // 阅读数
    $save[1]['displayorder'] = 0; // 排序权重值，默认填写0
    $save[1]['link_id'] = 0; // 填写0不管他
    $save[1]['inputtime'] = $save[1]['inputtime'] ? $save[1]['inputtime'] : SYS_TIME; // 没发布时间就填入当前时间
    $save[1]['updatetime'] = $save[1]['updatetime'] ? $save[1]['updatetime'] : SYS_TIME; // 更新时间
    $save[1]['inputip'] = '127.0.0.1'; // 发布者ip地址

    //$save[1]['keywords'] = dr_get_keywords( $save[1]['title']); // 按插件提取关键词

    //$save[1]['description'] = dr_get_description( $save[0]['content'], 100); // 在内容里面提取100个子作为描述

    // 验证标题重复
    if ($this->content_model->table(SITE_ID . '_' . MOD_DIR)->where('title', $save[1]['title'])->counts()) {
        echo '重复';
        exit;
    }

    $rt = $this->content_model->save_content(0, $save);

    if ($rt['code']) {
        /*
            // 用于发布成功后生成静态文件代码
            //dr_html_auth($_SERVER['SERVER_ADDR']);
            //dr_catcher_data(SITE_URL.'index.php?s='.MOD_DIR.'&c=html&m=showfile&id='.$rt['id']);
            $atcode = 'chtml_'.SITE_ID.'_'.MOD_DIR.'_'.$rt['code'];
            \Phpcmf\Service::L('cache')->set_auth_data($atcode, $rt['code'], SITE_ID);
            dr_catcher_data(SITE_URL.'index.php?s='.MOD_DIR.'&c=html&m=showfile&id='.$rt['code'].'&atcode='.$atcode);
    $save[1]['id'] = $save[0]['id'] = $rt['code'];
    \Phpcmf\Service::L('router')->show_url(\Phpcmf\Service::C()->module, $save[1]);
            */
        exit('成功');
    } else {
        exit('失败');
    }
}
exit;
