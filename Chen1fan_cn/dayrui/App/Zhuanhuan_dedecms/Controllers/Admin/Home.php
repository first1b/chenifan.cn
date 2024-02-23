<?php namespace Phpcmf\Controllers\Admin;

class Home extends \Phpcmf\App
{

    public function index() {

        if (IS_POST) {
            $post = \Phpcmf\Service::L('input')->post('data');
            if (!$post['host']) {
                $this->_json(0, '数据库信息必须填写');
            }
            $custom = [
                'DSN'      => '',
                'hostname' => $post['host'],
                'username' => $post['user'],
                'password' => $post['pass'],
                'database' => $post['name'],
                'DBDriver' => 'MySQLi',
                'DBPrefix' => $post['prefix'],
                'pConnect' => false,
                'DBDebug'  => false,
                'cacheOn'  => false,
                'cacheDir' => '',
                'charset'  => 'utf8',
                'DBCollat' => 'utf8_general_ci',
                'swapPre'  => '',
                'encrypt'  => false,
                'compress' => false,
                'strictOn' => false,
                'failover' => [],
                'port'     => '',
            ];
            $db = \Config\Database::connect($custom);
            if ($db->simpleQuery('SELECT * FROM `'.$post['prefix'].'arctype`'))
            {
                $custom['DBDebug'] = true;
                file_put_contents(WRITEPATH.'config/dedecms.php', '<?php return '.var_export($custom, true).';');
                $this->_json(1, '数据库识别成功', [
                    'url' => dr_url(APP_DIR.'/home/add', ['st'=>1])
                ]);
            }
            else
            {
                $this->_json(0, '数据库识别失败,检查表前缀是否正确');
            }
        }

        $data = [];
        if (is_file(WRITEPATH.'config/dedecms.php')) {
            $data = require WRITEPATH.'config/dedecms.php';
        }

        \Phpcmf\Service::V()->assign([
            'form' => dr_form_hidden(),
            'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
                [
                    'Dedecms 数据迁入' => [APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/index', 'fa fa-database'],
                ]
            ),
            'data' => $data,
        ]);

        \Phpcmf\Service::V()->display('home.html');
    }

    public function add() {

        $table = [
            'arctype' => [
                'name' => '栏目表',
            ],
        ];
        foreach ($table as $i => $t) {
            $table[$i]['total'] = $this->_db()->table($i)->countAllResults();
        }

        $module = $this->_db()->table('channeltype')->get()->getResultArray();
        if ($module) {
            foreach ($module as $i => $t) {
                $module[$i]['total'] = $this->_db()->table(str_replace('dede_', '', $t['maintable']))->where('channel='.$t['id'])->countAllResults();
            }
        }

        \Phpcmf\Service::V()->assign([
            'form' => dr_form_hidden(),
            'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
                [
                    'Dedecms 数据迁入' => [APP_DIR.'/home/add', 'fa fa-database'],
                ]
            ),
            'table' => $table,
            'module' => $module,
        ]);

        \Phpcmf\Service::V()->display('add.html');
    }

    private function dede_table($table) {
        $pre = $this->_prefix('');
        return str_replace('dede_', $pre, strtolower($table));
    }

    public function edit() {

        $st = (int)\Phpcmf\Service::L('input')->get('st');
        $page = (int)\Phpcmf\Service::L('input')->get('page');
        if ($st == 0) {
            if ($page) {
                $list = $this->_db()->table('arctype')->get()->getResultArray();
                $ntable = \Phpcmf\Service::M()->dbprefix(SITE_ID.'_share_category');
                $itable = \Phpcmf\Service::M()->dbprefix(SITE_ID.'_share_index');
                if ($list) {
                    $mod = [];
                    $module = $this->_db()->table('channeltype')->get()->getResultArray();
                    if ($module) {
                        foreach ($module as $i => $t) {
                            $mod[$t['id']] = $t['nid'];
                        }
                    }

                    $sql = 'TRUNCATE `'.$ntable.'`';
                    \Phpcmf\Service::M()->query($sql);

                    $sql = 'TRUNCATE `'.$itable.'`';
                    \Phpcmf\Service::M()->query($sql);
                    foreach ($list as $t) {
                        $dir = str_replace('{cmspath}', '', $t['typedir']);
                        $dir = trim($dir, '/');
                        if (strpos($dir, '/')) {
                            $arr = explode('/', $dir);
                            $end = end($arr);
                            if ($end) {
                                $dir = $end;
                            }
                        }
                        $dir = str_replace('/', '-', $dir);

                        $tid = 1;
                        $url = '';
                        if ($t['ispart'] == 2) {
                            $tid = 2;
                            $url = $t['typedir'];
                        }
                        \Phpcmf\Service::M()->db->table($ntable)->replace(array(
                            'id' => $t['id'],
                            'pid' => $t['reid'],
                            'name' => $t['typename'],
                            'dirname' => $dir,
                            'mid' => trim($mod[$t['channeltype']]),
                            'displayorder' => intval($mod[$t['sortrank']]),
                            'tid' => $tid,
                            'pids' => '',
                            'pdirname' => '',
                            'childids' => '',
                            'thumb' => '',
                            'content' => htmlspecialchars($t['content']),
                            'setting' => dr_array2string(
                                array(
                                    'disabled' => '0',
                                    'linkurl' => $url,
                                    'urlrule' => '0',
                                    'seo' =>
                                         array(
                                            'list_title' => $t['seotitle'] ? $t['seotitle'] : '[第{page}页{join}]{catpname}{join}{modname}{join}{SITE_NAME}',
                                            'list_keywords' => $t['keywords'] ? $t['keywords'] : '',
                                            'list_description' => $t['description'] ? $t['description'] : '',
                                        ),
                                    'template' =>
                                        array(
                                            'pagesize' => '10',
                                            'mpagesize' => '10',
                                            'page' => 'page.html',
                                            'list' => 'list.html',
                                            'category' => 'category.html',
                                            'search' => 'search.html',
                                            'show' => 'show.html',
                                        ),
                                    'cat_field' => '',
                                    'module_field' => '',
                                )),
                        ));

                    }

                }

                $this->_admin_msg(1, '导入成功', dr_url(APP_DIR.'/home/add'));
            }
            $this->_admin_msg(1, '在在转入数据', dr_url(APP_DIR.'/home/edit', ['st'=>$st, 'page'=>1]), 1);
        } else {
            // 内容库
            $mod = $this->_db()->table('channeltype')->where('id', $st)->get()->getRowArray();
            $module = \Phpcmf\Service::M()->db->table('module')->where('dirname', $mod['nid'])->get()->getRowArray();
            if (!$page) {
                $mod['nid'] = strtolower($mod['nid']);
                if (dr_is_module($mod['nid'])) {
                    $this->_admin_msg(1, '【'.$mod['nid'].'】模块已经安装', dr_url(APP_DIR.'/home/edit', ['st'=>$st, 'page'=>1]), 1);
                } else {
                    // 创建模块
                    if (in_array($mod['nid'], ['case', 'class', 'extends', 'site',
                        'new', 'var', 'member', 'category', 'linkage', 'api',
                        'module', 'form', 'admin', 'weixin'])) {
                        $this->_admin_msg(0, $mod['nid'].'是系统保留的关键字，建议手动修改dede表数据和表名称');
                    }
                    if (!preg_match('/^[a-z]+$/i', $mod['nid'])) {
                        $this->_admin_msg(0, dr_lang($mod['nid'].'只能是英文字母，不能带数字或其他符号，建议手动修改dede表数据和表名称：https://www.xunruicms.com/doc/1171.html'));
                    }
                    // 开始复制到指定目录
                    $path = APPSPATH.ucfirst($mod['nid']).'/';
                    \Phpcmf\Service::L('File')->copy_file(TEMPPATH.'Module/', $path);
                    if (!is_file($path.'Config/App.php')) {
                        $this->_admin_msg(0, dr_lang('目录（'.$path.'）创建失败，请检查文件权限'), ['field' => 'dirname']);
                    }

                    // 替换模块配置文件
                    $app = file_get_contents($path.'Config/App.php');
                    $app = str_replace(['{name}', '{icon}'], [dr_safe_filename($mod['typename']), 'fa fa-code'], $app);
                    file_put_contents($path.'Config/App.php', $app);

                    // 安装模块
                    $cfg = require $path.'Config/App.php';
                    if (!$cfg) {
                        $this->_admin_msg(0, dr_lang('文件[%s]不存在', 'App/'.ucfirst($mod['nid']).'/Config/App.php'));
                    }

                    $cfg['share'] = 1;

                    $rt = \Phpcmf\Service::M('module')->install($mod['nid'], $cfg);
                    !$rt['code'] && $this->_admin_msg($rt['code'], $rt['msg']);
                    \Phpcmf\Service::M('cache')->sync_cache(''); // 自动更新缓存

                    $this->_admin_msg(1, '【'.$mod['nid'].'】模块创建成功', dr_url(APP_DIR.'/home/edit', ['st'=>$st, 'page'=>1]), 1);
                }
            } elseif ($page ==1) {
                // 创建字段
                $dtable = $this->dede_table($mod['addtable']);
                $fields = $this->_db()->query('SHOW FULL COLUMNS FROM `'.$dtable.'`')->getResultArray();
                if (!$fields) {
                    $this->_admin_msg(0, dr_lang('表[%s]没有可用字段', $dtable));
                }
                $mod['nid'] = strtolower($mod['nid']);
                $table = \Phpcmf\Service::M()->prefix.SITE_ID.'_'.$mod['nid'];
                foreach ($fields as $t) {
                    $f = $t['Field'];
                    if (in_array($f, ['aid', 'typeid', 'redirecturl', 'templet', 'userip', 'redirecturl', 'body', 'content'])) {
                        continue;
                    }
                    // 创建字段
                    if (!\Phpcmf\Service::M()->db->fieldExists($f, $table)) {
                        if (strpos($t['Type'], 'char') !== false) {
                            \Phpcmf\Service::M()->query('ALTER TABLE `'.$table.'` ADD `'.$f.'` VARCHAR(200) DEFAULT NULL');
                        } elseif (strpos($t['Type'], 'int') !== false) {
                            \Phpcmf\Service::M()->query('ALTER TABLE `'.$table.'` ADD `'.$f.'` int(10) DEFAULT NULL');
                        } else {
                            \Phpcmf\Service::M()->query('ALTER TABLE `'.$table.'` ADD `'.$f.'` Text DEFAULT NULL');
                        }

                    }
                    $this->_add_field($f, $module['id']);
                }
                $this->_admin_msg(1, '【'.$mod['nid'].'】字段创建成功', dr_url(APP_DIR.'/home/edit', ['st'=>$st, 'page'=>2]), 1);
            } elseif ($page ==2) {
                // 入库数据
                $url = dr_url(APP_DIR.'/home/edit', ['st'=>$st, 'page'=>2]);
                $cpage = intval(\Phpcmf\Service::L('input')->get('cpage'));
                $table = $this->dede_table($mod['maintable']);
                $dtable = $this->dede_table($mod['addtable']);
                $where = 'channel='.$mod['id'];
                if (!$cpage) {
                    // 计算数量
                    $total = $this->_db()->table($table)->where($where)->countAllResults();
                    if (!$total) {
                        $this->_admin_msg(0, dr_lang('无可用内容'));
                    }
                    $this->_admin_msg(1, dr_lang('【'.$mod['nid'].'】正在执行中...'), $url.'&total='.$total.'&cpage='.($cpage+1));
                }

                $psize = 50;
                $total = (int)\Phpcmf\Service::L('input')->get('total');
                $tpage = ceil($total / $psize); // 总页数
                // 更新完成
                if ($cpage > $tpage) {
                    $this->_admin_msg(1, dr_lang('【'.$mod['nid'].'】入库完成，请关闭此页面'));
                }
                $fields = \Phpcmf\Service::M()->db->table('field')
                    ->where('displayorder', 10)
                    ->where('relatedid', $module['id'])
                    ->where('relatedname', 'module')->get()->getResultArray();

                $dede = explode(PHP_EOL, $mod['fieldset']);
                $ueditor = [];
                foreach ($dede as $p) {
                    if (strpos($p, 'itemname=')) {
                        $s = substr($p, 7);
                        $a = explode(' ', $s);
                        $f = $a[0];
                        if (strpos($p, 'type="htmltext"')) {
                            $ueditor[] = $f;
                        }
                    }
                }

                $list = $this->_db()->table($table)->where($where)->limit($psize, $psize * ($cpage - 1))->orderBy('id DESC')->get()->getResultArray();
                foreach ($list as $row) {
                    $data = $this->_db()->table($dtable)->where('aid', $row['id'])->get()->getRowArray();
                    if ($data) {
                        $save = [
                            1 => [
                                'id' => $row['id'],
                                'catid' => $row['typeid'],
                                'hits' => $row['click'],
                                'title' => $row['title'],
                                'thumb' => $row['litpic'],
                                'uid' => $this->uid,
                                'url' => '/index.php?c=show&id='.$row['id'],
                                'author' => $row['source'] ? $row['source'] : $this->member['username'],
                                'keywords' => $row['keywords'],
                                'description' => $row['description'],
                                'inputtime' => $row['pubdate'],
                                'updatetime' => $row['senddate'],
                                'status' => 9,
                                'tableid' => 0,
                                'displayorder' => intval($row['weight']),
                            ],
                            0 => [
                                'id' => $row['id'],
                                'catid' => $row['typeid'],
                                'uid' => $this->uid,
                                'content' => htmlspecialchars($data['body'] ? $data['body'] : ($data['content'] ? $data['content'] : '')),
                            ],
                        ];

                        if ($fields) {
                            foreach ($fields as $t) {
                                $value = (string)$data[$t['fieldname']];
                                if (strpos($value, 'dede:img text') && preg_match_all("/'}(.+){\/dede:img}/sU", $value, $mt)) {
                                    // 图片
                                    if (count($mt[1]) == 1) {
                                        // dantu
                                        $value = $mt[1];
                                        \Phpcmf\Service::M()->table('field')->update($t['id'], [
                                            'fieldtype' => 'File',
                                            'setting' => dr_array2string(array (
                                                'option' =>
                                                    array (
                                                        'input' => '1',
                                                        'size' => '10',
                                                        'count' => '20',
                                                        'ext' => 'jpg,gif,png,webp',
                                                        'attachment' => '0',
                                                        'image_reduce' => '',
                                                        'is_ext_tips' => '0',
                                                        'css' => '',
                                                    ),
                                                'validate' =>
                                                    array (
                                                        'required' => '0',
                                                        'pattern' => '',
                                                        'errortips' => '',
                                                        'check' => '',
                                                        'filter' => '',
                                                        'formattr' => '',
                                                        'tips' => '',
                                                    ),
                                            ))
                                        ]);
                                    } else {
                                        $rt = [
                                            'file' => [],
                                            'title' => [],
                                        ];
                                        preg_match_all("/text=\'(.+)\'/sU", $value, $mt2);
                                        foreach ($mt[1] as $i => $b) {
                                            $rt['file'][] = trim($b);
                                            if (isset($mt2[1][$i]) && $mt2[1][$i]) {
                                                $rt['title'][] = $mt2[1][$i];
                                            }
                                        }
                                        $value = dr_array2string($rt);
                                        \Phpcmf\Service::M()->table('field')->update($t['id'], [
                                            'fieldtype' => 'Files',
                                            'setting' => dr_array2string(array (
                                                'option' =>
                                                    array (
                                                        'input' => '1',
                                                        'size' => '10',
                                                        'count' => '20',
                                                        'ext' => 'jpg,gif,png,webp',
                                                        'attachment' => '0',
                                                        'image_reduce' => '',
                                                        'is_ext_tips' => '0',
                                                        'css' => '',
                                                    ),
                                                'validate' =>
                                                    array (
                                                        'required' => '0',
                                                        'pattern' => '',
                                                        'errortips' => '',
                                                        'check' => '',
                                                        'filter' => '',
                                                        'formattr' => '',
                                                        'tips' => '',
                                                    ),
                                            ))
                                        ]);
                                    }
                                } elseif (strpos($value, 'dede:img ddimg=') && preg_match_all("/'}(.+){\/dede:img}/sU", $value, $mt)) {
                                    // 图片字段转换
                                    $rt = [
                                        'file' => [],
                                        'title' => [],
                                    ];
                                    preg_match_all("/text=\'(.+)\'/sU", $value, $mt2);
                                    foreach ($mt[1] as $i => $b) {
                                        $rt['file'][] = trim($b);
                                        if (isset($mt2[1][$i]) && $mt2[1][$i]) {
                                            $rt['title'][] = $mt2[1][$i];
                                        }
                                    }
                                    $value = dr_array2string($rt);
                                    \Phpcmf\Service::M()->table('field')->update($t['id'], [
                                        'fieldtype' => 'Files',
                                        'setting' => dr_array2string(array (
                                            'option' =>
                                                array (
                                                    'input' => '1',
                                                    'size' => '10',
                                                    'count' => '20',
                                                    'ext' => 'jpg,gif,png,webp',
                                                    'attachment' => '0',
                                                    'image_reduce' => '',
                                                    'is_ext_tips' => '0',
                                                    'css' => '',
                                                ),
                                            'validate' =>
                                                array (
                                                    'required' => '0',
                                                    'pattern' => '',
                                                    'errortips' => '',
                                                    'check' => '',
                                                    'filter' => '',
                                                    'formattr' => '',
                                                    'tips' => '',
                                                ),
                                        ))
                                    ]);
                                } elseif (strpos($value, 'dede:specnote') && preg_match_all("/idlist='(.+)'/sU", $value, $mt)) {
                                    // 专题节点
                                    $rt = '';
                                    foreach ($mt[1] as $b) {
                                        $rt.=','.$b;
                                    }
                                    $value = trim($rt, ',');
                                    \Phpcmf\Service::M()->table('field')->update($t['id'], [
                                        'fieldtype' => 'Related',
                                        'setting' => dr_array2string(array (
                                            'option' =>
                                                array (
                                                    'module' => 'article',
                                                    'title' => '文章',
                                                    'limit' => '100',
                                                    'pagesize' => '100',
                                                ),
                                            'validate' =>
                                                array (
                                                    'required' => '0',
                                                    'pattern' => '',
                                                    'errortips' => '',
                                                    'check' => '',
                                                    'filter' => '',
                                                    'formattr' => '',
                                                    'tips' => '',
                                                ),
                                        ))
                                    ]);
                                } elseif (dr_in_array($t['fieldname'], $ueditor)) {
                                    $value = htmlspecialchars($value);
                                    \Phpcmf\Service::M()->table('field')->update($t['id'], [
                                        'fieldtype' => 'Ueditor',
                                        'setting' => dr_array2string(array (
                                            'option' =>
                                                array (
                                                    'down_img' => '0',
                                                    'autofloat' => '0',
                                                    'remove_style' => '0',
                                                    'div2p' => '0',
                                                    'autoheight' => '0',
                                                    'page' => '0',
                                                    'mode' => '1',
                                                    'tool' => '\'bold\', \'italic\', \'underline\'',
                                                    'mode2' => '1',
                                                    'tool2' => '\'bold\', \'italic\', \'underline\'',
                                                    'mode3' => '1',
                                                    'tool3' => '\'bold\', \'italic\', \'underline\'',
                                                    'simpleupload' => '0',
                                                    'attachment' => '0',
                                                    'image_reduce' => '',
                                                    'image_endstr' => '',
                                                    'value' => '',
                                                    'width' => '100%',
                                                    'height' => '300',
                                                    'css' => '',
                                                ),
                                            'validate' =>
                                                array (
                                                    'required' => '0',
                                                    'pattern' => '',
                                                    'errortips' => '',
                                                    'check' => '',
                                                    'filter' => '',
                                                    'formattr' => '',
                                                    'tips' => '',
                                                ),
                                        ))
                                    ]);
                                }
                                $save[1][$t['fieldname']] = $value;
                            }
                        }

                        $this->_save_content($mod['nid'], $save);
                    } else {
                        log_message('error', 'DEDE转换插件：'.$dtable.'-ID('.$row['id'].')缺少附表数据，跳过导入');
                    }

                }

                $this->_admin_msg(1, dr_lang('【'.$mod['nid'].'】正在执行中【%s】...', "$tpage/$cpage"), $url.'&total='.$total.'&cpage='.($cpage+1), 0);
            }
        }

    }

    private function _db() {

        $custom = require WRITEPATH.'config/dedecms.php';
        $db = \Config\Database::connect($custom);
        return $db;
    }

    private function _prefix($table) {
        $db = $this->_db();
        return $db->DBPrefix.$table;
    }

    private function _save_content($mid, $data) {

        // 主索引
        $id = $data[1]['id'];
        \Phpcmf\Service::M()->table(SITE_ID.'_share_index')->replace(
            [
                'id' => $id,
                'mid' => $mid
            ]
        );
        // 模块索引
        \Phpcmf\Service::M()->table(SITE_ID.'_'.$mid.'_index')->replace(
            [
                'id' => $id,
                'uid' => (int)$data[1]['uid'],
                'catid' => (int)$data[1]['catid'],
                'status' => (int)$data[1]['status'],
                'inputtime' => (int)$data[1]['inputtime'],
            ]
        );
        $data[1]['tableid'] = $tid = floor($id / 50000);
        \Phpcmf\Service::M()->is_data_table(SITE_ID.'_'.$mid.'_data_', $tid);
        \Phpcmf\Service::M()->table(SITE_ID.'_'.$mid)->replace($data[1]);
        \Phpcmf\Service::M()->table(SITE_ID.'_'.$mid.'_data_'.$tid)->replace($data[0]);

    }

    private function _add_field($name,  $rid) {

        if (\Phpcmf\Service::M()->db->table('field')
            ->where('fieldname', $name)
            ->where('relatedid', $rid)
            ->where('relatedname', 'module')->countAllResults()) {
            return;
        }

        \Phpcmf\Service::M()->db->table('field')->insert(array(
            'name' => $name,
            'ismain' => 1,
            'setting' => '',
            'issystem' => 0,
            'ismember' => 0,
            'disabled' => 0,
            'fieldname' => $name,
            'fieldtype' => 'Text',
            'relatedid' => $rid,
            'relatedname' => 'module',
            'displayorder' => 10,
        ));
    }

}
