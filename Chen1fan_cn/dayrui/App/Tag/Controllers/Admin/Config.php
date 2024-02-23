<?php namespace Phpcmf\Controllers\Admin;

class Config extends \Phpcmf\Common
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
                    '插件设置' => [APP_DIR.'/config/index', 'fa fa-cog'],
                    //'help' => [564],
                ]
            ),
        ]);
        \Phpcmf\Service::V()->display('config.html');

	}




}
