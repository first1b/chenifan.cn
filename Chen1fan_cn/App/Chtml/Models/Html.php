<?php namespace Phpcmf\Model\Chtml;

/**
 * 静态生成
 */

class Html extends \Phpcmf\Model
{
    protected $webpath;
    protected $psize = 20; // 每页生成多少条

    // 栏目的数量统计
    public function get_category_data($app, $cat, $maxsize, $is_mobile = 0) {

        // 获取生成栏目
        if (!$cat) {
            \Phpcmf\Service::C()->_json(0, '没有可用生成的栏目数据');
        }

        $name = 'category-'.$app.$is_mobile.'-html-file';
        \Phpcmf\Service::L('html', 'chtml')->del_auth_data($name);

        $list = [];
        foreach ($cat as $i => $t) {
            if ($t['tid'] == 0) {
                // 单网页
                $list[$t['mid']][] = [
                    'id' => $t['id'],
                    'mid' => $t['mid'],
                    'url' => $t['url'],
                    'page' => 0,
                    'name' => $t['name'],
                    'html' => $t['setting']['html'],
                ];
            } elseif ($t['tid'] == 1) {
                // 模块
                // 判断模块表是否存在被安装
                if (!\Phpcmf\Service::M()->db->tableExists(\Phpcmf\Service::M()->dbprefix(dr_module_table_prefix($t['mid'])))) {
                    unset($list[$t['mid']]);
                    continue;
                }
                $fields = \Phpcmf\Service::L('cache')->get('module-'.SITE_ID.'-'.$t['mid'], 'field');
                if ($t['child'] && !$t['pcatpost'] && $t['setting']['template']['list'] != $t['setting']['template']['category']) {
                    // 判断是封面页面
                    $list[$t['mid']][] = [
                        'id' => $t['id'],
                        'url' => $t['url'],
                        'mid' => $t['mid'],
                        'page' => 0,
                        'name' => $t['name'],
                        'html' => $t['setting']['html'],
                    ];
                } else {
                    // 内容列表页面
                    $db = \Phpcmf\Service::M()->db->table(dr_module_table_prefix($t['mid']));
                    $wh = [];
                    if ($t['child'] && $t['childids']) {
                        $wh[] = 'catid in ('. $t['childids'].')';
                    } else {
                        $wh[] = 'catid='. (int)$t['id'];
                    }
                    // 副栏目判断
                    if (isset($fields['catids']) && $fields['catids']['fieldtype'] = 'Catids') {
                        if (version_compare(\Phpcmf\Service::M()->db->getVersion(), '5.7.0') < 0) {
                            // 兼容写法
                            $wh[] = '`catids` LIKE "%\"'.intval($t['id']).'\"%"';
                        } else {
                            // 高版本写法
                            $wh[] = "(`catids` <>'' AND JSON_CONTAINS (`catids`->'$[*]', '\"".intval($t['id'])."\"', '$'))";
                        }
                    }
                    $db->where('('.implode(' OR ', $wh).')');
                    // 查找mwhere目录
                    if (is_dir(dr_get_app_dir($t['mid']).'Mwhere/')) {
                        $files = dr_file_map(dr_get_app_dir($t['mid']).'Mwhere/');
                        if ($files) {
                            $mid = $t['mid'];
                            $field = \Phpcmf\Service::L('cache')->get('table-'.SITE_ID, \Phpcmf\Service::M()->dbprefix(dr_module_table_prefix($t['mid'])));
                            $siteid = SITE_ID;
                            foreach ($files as $f) {
                                $w = require dr_get_app_dir($t['mid']).'Mwhere/'.$f;
                                if ($w) {
                                    $db->where($w);
                                }
                            }
                            $find = 0;
                        }
                    }
                    $total = $db->countAllResults(); // 统计栏目的数据量
                    $list[$t['mid']][] = [
                        'id' => $t['id'],
                        'mid' => $t['mid'],
                        'url' => $t['url'],
                        'page' => 0,
                        'name' => $t['name'],
                        'html' => $t['setting']['html'],
                    ];
                    if ($total) {
                        // 分页
                        if ($is_mobile) {
                            $pagesize = (int)$t['setting']['template']['mpagesize']; // 每页数量
                        } else {
                            $pagesize = (int)$t['setting']['template']['pagesize']; // 每页数量
                        }
                        !$pagesize && $pagesize = 10; // 默认10条分页
                        $count = ceil($total/$pagesize); // 计算总页数
                        if ($maxsize && $count > $maxsize) {
                            $count = $maxsize;
                        }
                        if ($count > 1) {
                            for ($i = 1; $i <= $count; $i++) {
                                $list[$t['mid']][] = [
                                    'id' => $t['id'],
                                    'mid' => $t['mid'],
                                    'url' => $t['url'],
                                    'page' => $i,
                                    'name' => $t['name'].'【第'.$i.'页】',
                                    'html' => $t['setting']['html'],
                                ];
                            }
                        }
                    }
                }
            }
        }

        if (!dr_count($list)) {
            \Phpcmf\Service::C()->_json(0, '没有可用生成的栏目数据');
        }

        $ct = 0;

        $cache = [];
        foreach ($list as $data) {
            $ct+= dr_count($data);
            $arr = array_chunk($data, $this->psize);
            $cache = dr_array2array($cache, $arr);
        }
        foreach ($cache as $i => $t) {
            \Phpcmf\Service::L('html', 'chtml')->set_auth_data($name.'-'.($i+1), $t);
        }

        $count = dr_count($cache);

        \Phpcmf\Service::L('html', 'chtml')->set_auth_data($name, $count);

        \Phpcmf\Service::C()->_json(1, '共'.$ct.'个，分'.$count.'页');
    }

    // 内容的数量统计
    public function get_show_data($app, $param) {

        $name = 'show-'.$app.'-html-file';
        \Phpcmf\Service::L('html', 'chtml')->del_auth_data($name);

        // 获取生成栏目
        $cids = [];
        $mids = [];
        if ($param['catids']) {
            $catids = explode(',', $param['catids']);
            if ($catids) {
                $cats = \Phpcmf\Service::C()->get_cache('module-'.SITE_ID.'-'.($app ? $app : 'share'), 'category');
                foreach ($catids as $id) {
                    if ($cats[$id]) {
                        $cids = dr_array2array($cids, explode(',', $cats[$id]['childids']));
                        $cats[$id]['mid'] && $mids[$cats[$id]['mid']] = $cats[$id]['mid'];
                    }
                }
                $cids = array_unique($cids);
            }
        }

        if (!$app) {
             \Phpcmf\Service::C()->_json(0, '模块参数app不存在');
        } else {
            $where = [];
            if (isset($param['date_form']) && $param['date_form']) {
                $where[] = ('`updatetime` BETWEEN ' . strtotime($param['date_form'].' 00:00:00') . ' AND ' . ($param['date_to'] ? strtotime($param['date_to'].' 23:59:59') : SYS_TIME));
            } elseif (isset($param['date_to']) && $param['date_to']) {
                $where[] = ('`updatetime` BETWEEN 0 AND ' . strtotime($param['date_to'].' 23:59:59'));
            }
            if (isset($param['id_to']) && $param['id_form']) {
                $where[] = ('`id` BETWEEN '.(int)$param['id_form'].' AND ' . (int)$param['id_to']);
            }
            if ($cids) {
                $where[] = ('catid IN ('. implode(',', $cids).')');
            }
            // 查找mwhere目录
            $tb = dr_module_table_prefix($app);
            $mwhere = \Phpcmf\Service::Mwhere_Apps();
            if ($mwhere) {
                $field = \Phpcmf\Service::L('cache')->get('table-'.SITE_ID, \Phpcmf\Service::M()->dbprefix($tb));
                $siteid = SITE_ID;
                foreach ($mwhere as $mapp) {
                    $w = require dr_get_app_dir($mapp).'Config/Mwhere.php';
                    if ($w) {
                        $where[] = ($w);
                    }
                }
            }
            $db = \Phpcmf\Service::M()->table($tb);
            $sql = 'select id,catid,title,url from `'.\Phpcmf\Service::M()->dbprefix($tb).'`';
            if ($where) {
                $where = implode(' AND ', $where);
                $db->where($where);
                $sql.= ' where '.$where;
            }
            $count = $db->counts();
        }

        if (!$count) {
            \Phpcmf\Service::C()->_json(0, '没有可用生成的内容数据');
        }

        $psize = $param['pagesize'] ? $param['pagesize'] : $this->psize;
        \Phpcmf\Service::L('html', 'chtml')->set_auth_data($name, $count);
        \Phpcmf\Service::L('html', 'chtml')->set_auth_data($name.'-data', [
            'sql' => $sql,
            'pagesize' => $psize,
        ]);

        \Phpcmf\Service::C()->_json(1, '共'.$count.'条，分'.ceil($count/$psize).'页');
    }

}