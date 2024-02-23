<?php

// index.php?s=appname&c=html&m=showfile&id=ID
$chtml = \Phpcmf\Service::M()->table('app_chtml')->where('status', 1)->getAll();
if ($chtml) {
    $is_html = 0;
    foreach ($chtml as $data) {
        if ($is_html) {
            break;
        }
        $path = WRITEPATH.'chtml/'.$data['id'].'/';
        if (is_file($path.'info')) {
            if ($fp = opendir($path)) {
                while (FALSE !== ($file = readdir($fp))) {
                    if (strpos($file, 'page_') !== false) {
                        $ids = file_get_contents($path.$file);
                        if ($ids) {
                            $arr = explode(',', $ids);
                            $url = \Phpcmf\Service::C()->site_info[$data['siteid']]['SITE_URL'].'index.php?s='.$data['mid'].'&c=html&m=showfile';
                            $error = [];
                            foreach ($arr as $id) {
                                $atcode = 'chtml_'.$data['siteid'].'_'.$data['mid'].'_'.$id;
                                \Phpcmf\Service::L('cache')->set_auth_data($atcode, $id, $data['siteid']);
                                $rt = json_decode(dr_catcher_data($url.'&atcode='.$atcode.'&id='.$id), true);
                                if (is_array($rt)) {
                                    if ($rt['code']) {
                                        // 生成成功
                                        $new = $data['htmls'] + 1;
                                        $save = [
                                            'htmls' => $data['htmls'] + 1,
                                            'updatetime' => SYS_TIME,
                                        ];
                                        if ($new >= $data['counts']) {
                                            $save['status'] = 0;
                                            $save['error'] = '';
                                        }
                                        \Phpcmf\Service::M()->table('app_chtml')->update($data['id'], $save);
                                    } else {
                                        // 生成失败
                                        $error[] = $id;
                                        \Phpcmf\Service::M()->table('app_chtml')->update($data['id'], [
                                            'error' => $rt['msg']
                                        ]);
                                        log_message('debug', '定时生成静态插件：'.$rt['msg']);
                                    }
                                } else {
                                    $error[] = $id;
                                    \Phpcmf\Service::M()->table('app_chtml')->update($data['id'], [
                                        'error' => '无法被访问执行'
                                    ]);
                                }
                            }
                            if ($error) {
                                file_put_contents($path.$file, implode(',', $error));
                            }
                            $is_html = 1;
                            break;
                        }
                    }
                }
                closedir($fp);
            }
        }
    }
}


