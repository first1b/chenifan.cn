<?php namespace Phpcmf\Controllers\Admin;

class Config extends \Phpcmf\App
{

    public function index() {

        // 生成权限文件
        if (!dr_html_auth(1)) {
            $this->_admin_msg(0, dr_lang('/cache/html/ 无法写入文件'));
        }

        \Phpcmf\Service::V()->assign([
            'form' => dr_form_hidden(),
            'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
                [
                    '一键生成' => [APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/index', 'fa fa-cog'],
                ]
            ),
        ]);
        \Phpcmf\Service::V()->display('config.html');

    }
    public function sync_index() {

        $url = dr_url(APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/'.\Phpcmf\Service::L('Router')->method);
        $page = intval(\Phpcmf\Service::L('input')->get('page'));
        if (!$page) {
            // 计算数量
            $total = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->countAllResults();
            if (!$total) {
                $this->_html_msg(0, dr_lang('无可用栏目更新'));
            }
            $this->_html_msg(1, dr_lang('正在执行中...'), $url.'&total='.$total.'&page=1');
        }

        $psize = 100; // 每页处理的数量
        $total = (int)\Phpcmf\Service::L('input')->get('total');
        $tpage = ceil($total / $psize); // 总页数
        // 更新完成
        if ($page > $tpage) {
            \Phpcmf\Service::M('cache')->sync_cache('');
            $this->_html_msg(1, dr_lang('更新完成'));
        }

        $category = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->limit($psize, $psize * ($page - 1))->orderBy('id DESC')->get()->getResultArray();
        if ($category) {
            foreach ($category as $data) {
                $data['setting'] = dr_string2array($data['setting']);
                $data['setting']['html'] = 1;
                \Phpcmf\Service::M()->table_site('share_category')->update($data['id'], [
                    'setting' => dr_array2string($data['setting']),
                ]);
            }
        }

        $this->_html_msg(1, dr_lang('正在执行中【%s】...', "$tpage/$page"), $url.'&total='.$total.'&page='.($page+1));
    }

    public function sync2_index() {

        $url = dr_url(APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/'.\Phpcmf\Service::L('Router')->method);
        $page = intval(\Phpcmf\Service::L('input')->get('page'));
        if (!$page) {
            // 计算数量
            $total = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->countAllResults();
            if (!$total) {
                $this->_html_msg(0, dr_lang('无可用栏目更新'));
            }
            $this->_html_msg(1, dr_lang('正在执行中...'), $url.'&total='.$total.'&page=1');
        }

        $psize = 100; // 每页处理的数量
        $total = (int)\Phpcmf\Service::L('input')->get('total');
        $tpage = ceil($total / $psize); // 总页数
        // 更新完成
        if ($page > $tpage) {
            \Phpcmf\Service::M('cache')->sync_cache('');
            $this->_html_msg(1, dr_lang('更新完成'));
        }

        $category = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->limit($psize, $psize * ($page - 1))->orderBy('id DESC')->get()->getResultArray();
        if ($category) {
            foreach ($category as $data) {
                $data['setting'] = dr_string2array($data['setting']);
                $data['setting']['html'] = 0;
                \Phpcmf\Service::M()->table_site('share_category')->update($data['id'], [
                    'setting' => dr_array2string($data['setting']),
                ]);
            }
        }

        $this->_html_msg(1, dr_lang('正在执行中【%s】...', "$tpage/$page"), $url.'&total='.$total.'&page='.($page+1));
    }
    public function csync_index() {

        $url = dr_url(APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/'.\Phpcmf\Service::L('Router')->method);
        $page = intval(\Phpcmf\Service::L('input')->get('page'));
        if (!$page) {
            // 计算数量
            $total = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->countAllResults();
            if (!$total) {
                $this->_html_msg(0, dr_lang('无可用栏目更新'));
            }
            $this->_html_msg(1, dr_lang('正在执行中...'), $url.'&total='.$total.'&page=1');
        }

        $psize = 100; // 每页处理的数量
        $total = (int)\Phpcmf\Service::L('input')->get('total');
        $tpage = ceil($total / $psize); // 总页数
        // 更新完成
        if ($page > $tpage) {
            \Phpcmf\Service::M('cache')->sync_cache('');
            $this->_html_msg(1, dr_lang('更新完成'));
        }

        $category = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->limit($psize, $psize * ($page - 1))->orderBy('id DESC')->get()->getResultArray();
        if ($category) {
            foreach ($category as $data) {
                $data['setting'] = dr_string2array($data['setting']);
                $data['setting']['chtml'] = 1;
                \Phpcmf\Service::M()->table_site('share_category')->update($data['id'], [
                    'setting' => dr_array2string($data['setting']),
                ]);
            }
        }

        $this->_html_msg(1, dr_lang('正在执行中【%s】...', "$tpage/$page"), $url.'&total='.$total.'&page='.($page+1));
    }

    public function csync2_index() {

        $url = dr_url(APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/'.\Phpcmf\Service::L('Router')->method);
        $page = intval(\Phpcmf\Service::L('input')->get('page'));
        if (!$page) {
            // 计算数量
            $total = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->countAllResults();
            if (!$total) {
                $this->_html_msg(0, dr_lang('无可用栏目更新'));
            }
            $this->_html_msg(1, dr_lang('正在执行中...'), $url.'&total='.$total.'&page=1');
        }

        $psize = 100; // 每页处理的数量
        $total = (int)\Phpcmf\Service::L('input')->get('total');
        $tpage = ceil($total / $psize); // 总页数
        // 更新完成
        if ($page > $tpage) {
            \Phpcmf\Service::M('cache')->sync_cache('');
            $this->_html_msg(1, dr_lang('更新完成'));
        }

        $category = \Phpcmf\Service::M()->db->table(SITE_ID.'_share_category')->limit($psize, $psize * ($page - 1))->orderBy('id DESC')->get()->getResultArray();
        if ($category) {
            foreach ($category as $data) {
                $data['setting'] = dr_string2array($data['setting']);
                $data['setting']['chtml'] = 0;
                \Phpcmf\Service::M()->table_site('share_category')->update($data['id'], [
                    'setting' => dr_array2string($data['setting']),
                ]);
            }
        }

        $this->_html_msg(1, dr_lang('正在执行中【%s】...', "$tpage/$page"), $url.'&total='.$total.'&page='.($page+1));
    }

}
