<?php namespace Phpcmf\Controllers\Admin;

// 生成静态
class Cat extends \Phpcmf\Common
{

    public function __construct(...$params) {
        parent::__construct(...$params);
        // 生成权限文件
        if (!dr_html_auth(1)) {
            $this->_admin_msg(0, dr_lang('/cache/html/ 无法写入文件'));
        }
    }

    // 生成静态
    public function index() {

        \Phpcmf\Service::V()->assign([
            'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
                [
                    '生成静态' => [APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/'.\Phpcmf\Service::L('Router')->method, 'fa fa-file-code-o'],
                    'help' => [417],
                ]
            ),
            'module' => \Phpcmf\Service::L('cache')->get('module-'.SITE_ID.'-content'),
            'pagesize' => 10,
        ]);
        \Phpcmf\Service::V()->display('html_cat.html');
    }

    // 栏目
    public function category_index() {

        $app = \Phpcmf\Service::L('input')->get('app');
        $ids = \Phpcmf\Service::L('input')->get('ids');
        if ($ids && is_array($ids)) {
            $ids = implode(',', $ids);
        }

        $maxsize = \Phpcmf\Service::L('input')->get('maxsize');
        $is_mobile = (int)\Phpcmf\Service::L('input')->get('is_mobile');

        \Phpcmf\Service::V()->assign([
            'spage' => 1,
            'todo_url' => WEB_DIR.'index.php?'.($app ? 's='.$app.'&' : '').'c=html&m=category&ids='.$ids.'&maxsize='.$maxsize.'&is_mobile='.$is_mobile,
            'count_url' => \Phpcmf\Service::L('Router')->url(APP_DIR.'/'.'cat/category_count_index', ['app' => $app, 'ids' => $ids, 'is_mobile' => $is_mobile, 'maxsize' => $maxsize]),
        ]);
        \Phpcmf\Service::V()->display('html_bfb.html');exit;
    }

    // 断点生成栏目
    public function category_point_index() {

        $app = \Phpcmf\Service::L('input')->get('app');
        $name = 'category-'.$app.'-html-file';
        $page = \Phpcmf\Service::L('cache')->get_auth_data($name.'-error'); // 设置断点
        if (!$page) {
            $this->_json(0, dr_lang('没有找到上次中断生成的记录'));
        }

        $ids = \Phpcmf\Service::L('input')->get('ids');
        if ($ids && is_array($ids)) {
            $ids = implode(',', $ids);
        }

        $is_mobile = (int)\Phpcmf\Service::L('input')->get('is_mobile');

        \Phpcmf\Service::V()->assign([
            'spage' => $page,
            'todo_url' => WEB_DIR.'index.php?'.($app ? 's='.$app.'&' : '').'c=cat&m=category&ids='.$ids.'&is_mobile='.$is_mobile.'&',
            'count_url' => \Phpcmf\Service::L('Router')->url(APP_DIR.'/'.'cat/category_point_count_index', ['app' => $app, 'is_mobile' => $is_mobile]),
        ]);
        \Phpcmf\Service::V()->display('html_bfb.html');exit;
    }
    // 断点栏目的数量统计
    public function category_point_count_index() {

        $app = \Phpcmf\Service::L('input')->get('app');
        $name = 'category-'.$app.'-html-file';
        $page = \Phpcmf\Service::L('cache')->get_auth_data($name.'-error'); // 设置断点
        if (!$page) {
            $this->_json(0, dr_lang('没有找到上次中断生成的记录'));
        } elseif (!\Phpcmf\Service::L('cache')->get_auth_data($name)) {
            $this->_json(0, dr_lang('生成记录已过期，请重新开始生成'));
        } elseif (!\Phpcmf\Service::L('cache')->get_auth_data($name.'-'.$page)) {
            $this->_json(0, dr_lang('生成记录已过期，请重新开始生成'));
        }

        $this->_json(1, 'ok');
    }

    // 获取生成的栏目
    private function _category_data($ids, $cats) {

        if (!$ids) {
            return $cats;
        }

        $rt = [];
        $arr = explode(',', $ids);
        foreach ($arr as $id) {
            if ($id && $cats[$id]) {
                $rt[$id] = $cats[$id];
            }
        }

        return $rt;
    }

    // 栏目的数量统计
    public function category_count_index() {

        $app = \Phpcmf\Service::L('input')->get('app');
        $ids = \Phpcmf\Service::L('input')->get('ids');
        $maxsize = (int)\Phpcmf\Service::L('input')->get('maxsize');
        $is_mobile = (int)\Phpcmf\Service::L('input')->get('is_mobile');

        if ($app) {
            $cat = $this->get_cache('module-'.SITE_ID.'-'.$app, 'category');
        } else {
            $cat = $this->get_cache('module-'.SITE_ID.'-share', 'category');
        }

        \Phpcmf\Service::M('html', APP_DIR)->get_category_data($app, $this->_category_data($ids, $cat), $maxsize, $is_mobile);
    }


}
