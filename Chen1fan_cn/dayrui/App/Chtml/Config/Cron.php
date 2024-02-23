<?php

// index.php?s=appname&c=html&m=showfile&id=ID
!$is_test && $is_test = '';
$chtml = \Phpcmf\Service::M()->table('app_chtml')->where('status', 1)->getAll();
if (($chtml && !$is_test) or ($chtml && $is_test = 'time')) {
    $is_html = 0;
    foreach ($chtml as $data) {
        if ($is_html) {
            if ($is_test) {
                $this->_json(1, '执行提交完毕');
            }
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
                                if (!$id) {
                                    continue;
                                }
                                $atcode = 'chtml_'.$data['siteid'].'_'.$data['mid'].'_'.$id;
                                \Phpcmf\Service::L('cache')->set_auth_data($atcode, $id, $data['siteid']);
                                $curl = $url.'&atcode='.$atcode.'&id='.$id.'&';
                                $code = dr_catcher_data($curl);
                                if (!$code) {
                                    $error[] = $id;
                                    \Phpcmf\Service::M()->table('app_chtml')->update($data['id'], [
                                        'error' => '无法访问：'.$curl
                                    ]);
                                } else {
                                    $rt = json_decode($code, true);
                                    $atcode = 'chtml_'.SITE_ID.'_'.$data['mid'].'_'.$rt['code'];
                                    \Phpcmf\Service::L('cache')->set_auth_data($atcode, $rt['code'], SITE_ID);
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
                                            'error' => '无法访问：'.$url
                                        ]);
                                    }
                                }
                            }
                            if ($error) {
                                file_put_contents($path.$file, implode(',', $error));
                            }
                            $is_html = 1;
                            if ($is_test) {
                                $this->_json(1, '执行提交任务完毕');
                            }
                            break;
                        }
                    }
                }
                closedir($fp);
            }
        }
    }
}

$chtml = \Phpcmf\Service::M()->table('app_chtml_cat')->where('status', 1)->getAll();
if (($chtml && !$is_test) or ($chtml && $is_test = 'ctime')) {
    $is_html = 0;
    foreach ($chtml as $data) {
        if ($data['updatetime'] && (SYS_TIME - $data['updatetime']) < (intval($data['param']) * 3600 * 24)) {
            continue;
        }
        $cat = \Phpcmf\Service::M('html', 'chtml')->cron_category_data($data, 0);
        if ($cat) {
            if (SITE_IS_MOBILE_HTML) {
                $cat = array_merge($cat, \Phpcmf\Service::M('html', 'chtml')->cron_category_data($data, 1));
            }
            $error = [];
            foreach ($cat as $c) {
                foreach ($c as $t) {
                    if ($t['is_mobile']) {
                        $url = \Phpcmf\Service::C()->site_info[$data['siteid']]['SITE_MURL'].'index.php?s='.($data['mid'] == 'share' ? '' : $data['mid']).'&c=html&m=categoryfile';
                    } else {
                        $url = \Phpcmf\Service::C()->site_info[$data['siteid']]['SITE_URL'].'index.php?s='.($data['mid'] == 'share' ? '' : $data['mid']).'&c=html&m=categoryfile';
                    }
                    $id = $t['id'];
                    if (!$id) {
                        continue;
                    }
                    $atcode = 'chtml_'.$data['siteid'].'_'.$data['mid'].'_'.$id;
                    \Phpcmf\Service::L('cache')->set_auth_data($atcode, $id, $data['siteid']);
                    $curl = $url.'&atcode='.$atcode.'&id='.$id.'&page='.$t['page'];
                    $code = dr_catcher_data($curl);
                    if (!$code) {
                        $error[] = $id;
                        \Phpcmf\Service::M()->table('app_chtml_cat')->update($data['id'], [
                            'error' => '无法被访问执行：'.$curl
                        ]);
                    } else {
                        $rt = json_decode($code, true);
                        $atcode = 'chtml_cat_'.SITE_ID.'_'.$data['mid'].'_'.$rt['code'];
                        \Phpcmf\Service::L('cache')->set_auth_data($atcode, $rt['code'], SITE_ID);
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
                                \Phpcmf\Service::M()->table('app_chtml_cat')->update($data['id'], $save);
                            } else {
                                // 生成失败
                                $error[] = $id;
                                \Phpcmf\Service::M()->table('app_chtml_cat')->update($data['id'], [
                                    'error' => $rt['msg']
                                ]);
                                log_message('debug', '定时生成静态插件：'.$rt['msg']);
                            }
                        } else {
                            $error[] = $id;
                            \Phpcmf\Service::M()->table('app_chtml_cat')->update($data['id'], [
                                'error' => '无法被访问执行：'.$url
                            ]);
                        }
                    }
                }
            }
            $is_html++;
        }
    }
    if ($is_html) {
        $this->_json(1, '执行提交任务完毕');
    }
}

if ($is_test) {
    $this->_json(0, '没有执行任务');
}

