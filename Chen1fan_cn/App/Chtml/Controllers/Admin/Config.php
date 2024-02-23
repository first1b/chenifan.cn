<?php namespace Phpcmf\Controllers\Admin;

class Config extends \Phpcmf\App
{

    public function index() {

        $data = \Phpcmf\Service::M('app')->get_config(APP_DIR);

        if (IS_AJAX_POST) {

            $post = \Phpcmf\Service::L('input')->post('data');
            \Phpcmf\Service::M('app')->save_config(APP_DIR, $post);

            $this->_json(1, dr_lang('操作成功'));
        }

        $page = intval(\Phpcmf\Service::L('input')->get('page'));

        \Phpcmf\Service::V()->assign([
            'page' => $page,
            'data' => $data,
            'form' => dr_form_hidden(['page' => $page]),
            'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
                [
                    '插件设置' => [APP_DIR.'/'.\Phpcmf\Service::L('Router')->class.'/index', 'fa fa-cog'],
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

}
