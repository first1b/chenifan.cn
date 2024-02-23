<?php namespace Phpcmf\Library\Chtml; // 这里的Test是应用目录

class Html {


    //==================生成静态部分 - 创建文件=========================


    // 生成栏目静态页面
    public function _Create_Category_Html($ci, $mid, $catid, $page = 0, $is_mobile = -1) {

        if (!$catid) {
            return dr_return_data(0, '栏目id不存在');
        } elseif (!$ci->module) {
            return dr_return_data(0, '模块未被初始化');
        } elseif (IS_CLIENT) {
            return dr_return_data(0, '终端域名下不能生成静态文件');
        }

        $cat = dr_cat_value($ci->module['mid'], $catid);
        if (!$cat) {
            return dr_return_data(0, '模块['.$ci->module['name'].']栏目#'.$catid.'不存在');
        } elseif ($ci->module['setting']['search']['catsync'] && $cat['tid'] == 1) {
            return dr_return_data(0, '此模块开启了搜索集成栏目页，因此栏目无法生成静态');
        } elseif (!$cat['setting']['html']) {
            return dr_return_data(0, '栏目没有开启静态生成，因此栏目无法生成静态');
        }

        // 无权限访问栏目内容
        /*
        if ($this->member_cache['auth2'][SITE_ID][$this->module['dirname']]['category'][$catid]['show']) {
            return dr_return_data(0, '请关闭栏目访问权限');
        } elseif ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['home']) {
            return dr_return_data(0, '请关闭模块访问权限');
        } elseif ($this->member_cache['auth_site'][SITE_ID]['home']) {
            return dr_return_data(0, '请关闭站点访问权限');
        }*/

        $url = $page > 0 ?\Phpcmf\Service::L('Router')->category_url($ci->module, $cat, $page) : $cat['url'];
        $file = \Phpcmf\Service::L('Router')->remove_domain($url); // 从地址中获取要生成的文件名

        $root = \Phpcmf\Service::L('html')->get_webpath(SITE_ID, $ci->module['dirname']);

        $hfile = dr_to_html_file($file, $root);  // 格式化生成文件
        if (!$hfile) {
            if (strpos($url, 'index.php?')!==false) {
                return dr_return_data(0, '地址【'.$url.'】是动态，请把栏目URL设置为静态地址');
            }
            return dr_return_data(0, '地址【'.$cat['url'].'】不规范');
        }

        // 标识变量
        !defined('SC_HTML_FILE') && define('SC_HTML_FILE', 1);

        \Phpcmf\Service::V()->assign('my_php_url', SITE_URL.'index.php?not301=2&'.($ci->module['share'] ? '' : 's='.$ci->module['dirname'].'&').'c=category&id='.$catid);

        if ($is_mobile == -1) {
            // 自动化
            ob_start();
            // 生成静态路由纠正
            \Phpcmf\Service::L('router')->class = 'category';
            \Phpcmf\Service::L('router')->method = 'index';
            $_GET['page'] = $page;
            \Phpcmf\Service::V()->init('pc');
            $ci->_Category($catid, '', $page);
            $html = ob_get_clean();

            // 格式化生成文件
            if (!file_put_contents($hfile, $html, LOCK_EX)) {
                unlink($hfile);
                return dr_return_data(0, '文件【'.$hfile.'】写入失败');
            }

            // 移动端生成
            if (SITE_IS_MOBILE && SITE_IS_MOBILE_HTML) {
                ob_start();
                \Phpcmf\Service::V()->init('mobile');
                $_GET['page'] = $page;
                $ci->_Category($catid, '', $page);
                $html = ob_get_clean();
                $hfile = dr_to_html_file($file, $root . SITE_MOBILE_DIR.'/');
                $size = file_put_contents($hfile, $html, LOCK_EX);
                if (!$size) {
                    unlink($hfile);
                    return dr_return_data(0, '无权限写入文件【' . $hfile . '】');
                }
            }
        } elseif (!$is_mobile) {
            // 开启ob函数
            ob_start();
            // 生成静态路由纠正
            \Phpcmf\Service::L('router')->class = 'category';
            \Phpcmf\Service::L('router')->method = 'index';
            $_GET['page'] = $page;
            \Phpcmf\Service::V()->init('pc');
            $ci->_Category($catid, '', $page);
            $html = ob_get_clean();

            // 格式化生成文件
            if (!file_put_contents($hfile, $html, LOCK_EX)) {
                unlink($hfile);
                return dr_return_data(0, '文件【'.$hfile.'】写入失败');
            }
        } else {
            ob_start();
            \Phpcmf\Service::V()->init('mobile');
            $_GET['page'] = $page;
            $ci->_Category($catid, '', $page);
            $html = ob_get_clean();
            $hfile = dr_to_html_file($file, $root . SITE_MOBILE_DIR.'/');
            $size = file_put_contents($hfile, $html, LOCK_EX);
            if (!$size) {
                unlink($hfile);
                return dr_return_data(0, '无权限写入文件【' . $hfile . '】');
            }
        }

        return dr_return_data(1, 'ok');
    }

    // 生成内容静态页面
    public function _Create_Show_Html($ci, $mid, $id, $page = 0) {

        if (!$id) {
            return dr_return_data(0, '内容id不存在');
        } elseif (IS_CLIENT) {
            return dr_return_data(0, '终端域名下不能生成静态文件');
        }

        // 标识变量
        !defined('SC_HTML_FILE') && define('SC_HTML_FILE', 1);

        // 开启ob函数
        ob_start();
        // 修复前缀
        $ci->content_model->_init($ci->module['dirname'], SITE_ID);
        // 生成静态路由纠正
        \Phpcmf\Service::L('router')->class = 'show';
        \Phpcmf\Service::L('router')->method = 'index';
        \Phpcmf\Service::V()->init('pc');
        \Phpcmf\Service::V()->module($ci->module['share'] ? 'share' : $ci->module['dirname']);
        \Phpcmf\Service::V()->assign('my_php_url', SITE_URL.'index.php?not301=2&'.($ci->module['share'] ? '' : 's='.$ci->module['dirname'].'&').'c=show&id='.$id);
        $data = $ci->_Show($id, '', $page);
        $html = ob_get_clean();
        if (!$data) {
            return dr_return_data(0, '模块'.$ci->content_model->mytable.'('.$id.')内容不存在不执行生成');
        }
        $cat = dr_cat_value($ci->module['share'] ? 'share' : $ci->module['dirname'], $data['catid']);
        if (!$cat['setting']['chtml']) {
            return dr_return_data(0, '模块['.$ci->content_model->mytable.']-栏目['.$cat['name'].']-没有开启内容静态生成');
        }

        // 无权限访问栏目内容
        /*
        if ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['category'][$data['catid']]['show']) {
            return dr_return_data(0, '请关闭栏目访问权限');
        } elseif ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['home']) {
            return dr_return_data(0, '请关闭模块访问权限');
        } elseif ($this->member_cache['auth_site'][SITE_ID]['home']) {
            return dr_return_data(0, '请关闭站点访问权限');
        } elseif ($this->module['setting']['html']) {
            return dr_return_data(0, '栏目没有开启静态生成，因此栏目无法生成静态');
        }*/

        // 同步数据不执行生成
        if ($data['link_id'] > 0) {
            return dr_return_data(0, '同步数据不执行生成');
        }

        $url = $page > 0 ? \Phpcmf\Service::L('Router')->show_url($ci->module, $data, $page) : $data['url'];
        if (!$data) {
            return dr_return_data(0, 'URL为空白不执行生成');
        }

        $file = \Phpcmf\Service::L('Router')->remove_domain($url); // 从地址中获取要生成的文件名
        $root = \Phpcmf\Service::L('html')->get_webpath(SITE_ID, $ci->module['dirname']);
        $hfile = dr_to_html_file($file, $root);  // 格式化生成文件

        if (!$hfile) {
            if (strpos($data['url'], 'index.php?')!==false) {
                $url = \Phpcmf\Service::L('Router')->show_url($ci->module, $data, $page);
                $file = \Phpcmf\Service::L('Router')->remove_domain($url); // 从地址中获取要生成的文件名
                $hfile = dr_to_html_file($file, $root);  // 格式化生成文件
                if (!$hfile) {
                    return dr_return_data(0, '地址【'.$url.'】是动态，请更新内容URL为静态地址模式');
                }
            } else {
                return dr_return_data(0, '地址【'.$data['url'].'】不规范');
            }
        }

        if (!file_put_contents($hfile, $html, LOCK_EX)) {
            unlink($hfile);
            return dr_return_data(0, '文件【'.$hfile.'】写入失败');
        }

        // 移动端生成
        if (SITE_IS_MOBILE && SITE_IS_MOBILE_HTML) {
            ob_start();
            \Phpcmf\Service::V()->init('mobile');
            \Phpcmf\Service::V()->module($ci->module['share'] ? 'share' : $ci->module['dirname']);
            $data = $ci->_Show($id, '', $page);
            $html = ob_get_clean();
            $hfile = dr_to_html_file($file, $root.SITE_MOBILE_DIR.'/');
            $size = file_put_contents($hfile, $html, LOCK_EX);
            if (!$size) {
                unlink($hfile);
                return dr_return_data(0, '无权限写入文件【'.$hfile.'】');
            }
        }

        // 生成分页的页面
        if ($page == 0 && $data['content_page']) {
            foreach ($data['content_page'] as $i => $t) {
                if ($i > 1) {
                    $this->_Create_Show_Html($ci, $mid,$id, $i);
                }
            }
        }

        return dr_return_data(1, 'ok');
    }


    //==================生成静态部分 - 单个文件生成（继承，用于增加修改时实时生成）=========================


    // 生成栏目静态页
    public function _Category_Html_File($ci, $mid) {

        $ck = 0;
        $id = intval(\Phpcmf\Service::L('input')->get('id'));

        // 判断权限
        if (isset($_GET['atcode']) && $_GET['atcode']) {
            $rid = \Phpcmf\Service::L('cache')->get_auth_data(trim($_GET['atcode']), SITE_ID);
            if ($rid && $rid == $id) {
                // 验证成功
                $ck = 1;
            }
        }

        if (!$ck && !dr_html_auth()) {
            $ci->_json(0, '权限验证超时，请重新执行生成');
        }

        // 初始化模块

        $ci->_module_init($mid ? $mid : 'share');

        /*
        if ($this->member_cache['auth_site'][SITE_ID]['home']) {
            $this->_json(0, '当前网站设置了访问权限，无法生成静态');
        } elseif ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['home']) {
            $this->_json(0, '当前模块设置了访问权限，无法生成静态');
        }*/

        $rt = $this->_Create_Category_Html($ci, $mid, intval(\Phpcmf\Service::L('input')->get('id')));
        $ci->_json($rt['code'], $rt['msg']);
        exit;

    }

    // 生成内容静态单页
    public function _Show_Html_File($ci, $mid) {

        $ck = 0;
        $id = intval(\Phpcmf\Service::L('input')->get('id'));

        // 判断权限
        if (isset($_GET['atcode']) && $_GET['atcode']) {
            $rid = \Phpcmf\Service::L('cache')->get_auth_data(trim($_GET['atcode']), SITE_ID);
            if ($rid && $rid == $id) {
                // 验证成功
                $ck = 1;
            }
        }

        if (!$ck && !dr_html_auth()) {
            $ci->_json(0, '权限验证超时，请重新执行生成');
        }

        // 初始化模块
        $ci->_module_init();

        /*
        if ($this->member_cache['auth_site'][SITE_ID]['home']) {
            $this->_json(0, '当前网站设置了访问权限，无法生成静态');
        } elseif ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['home']) {
            $this->_json(0, '当前模块设置了访问权限，无法生成静态');
        }*/

        $rt = $this->_Create_Show_Html($ci, $mid, $id);
        $ci->_json($rt['code'], $rt['msg']);
        exit;
    }


    //==================生成静态部分 - 后台操作Ajax生成执行=========================


    // 生成首页静态选项列表
    public function _Index_Html($ci) {

        // 判断权限
        if (!dr_html_auth()) {
            $ci->_json(0, '权限验证超时，请重新执行生成');
        }
        /*
        if ($this->member_cache['auth_site'][SITE_ID]['home']) {
            $this->_json(0, '当前网站设置了访问权限，无法生成静态');
        } elseif ($this->member_cache['auth_module'][SITE_ID][APP_DIR]['home']) {
            $this->_json(0, '当前模块设置了访问权限，无法生成静态');
        }*/

        // 标识变量
        !defined('SC_HTML_FILE') && define('SC_HTML_FILE', 1);
        !$ci->module && $ci->_module_init();

        /*
         * if (!$ci->module['setting']['module_index_html']) {
            $ci->_json(0, '当前模块未开启首页静态功能');
        } else*/
        if ($ci->module['setting']['search']['indexsync']) {
            $ci->_json(0, '当前模块设置了集成搜索页，无法生成静态');
        }

        $root = \Phpcmf\Service::L('html')->get_webpath(SITE_ID, $ci->module['dirname']);
        if ($ci->module['domain']) {
            // 绑定域名时
            $file = 'index.html';
        } else {
            $file = ltrim(\Phpcmf\Service::L('Router')->remove_domain(MODULE_URL), '/'); // 从地址中获取要生成的文件名;
            if (!$file) {
                $ci->_json(0, dr_lang('生成文件名不合法: %s', MODULE_URL));
            }
        }

        // 生成静态文件
        ob_start();
        // 生成静态路由纠正
        \Phpcmf\Service::L('router')->class = 'home';
        \Phpcmf\Service::L('router')->method = 'index';
        \Phpcmf\Service::V()->init('pc');
        $ci->_Index(1);
        $html = ob_get_clean();
        $pc = file_put_contents(dr_format_html_file($file, $root), $html, LOCK_EX);
        $mobile = 0;

        if (SITE_IS_MOBILE || $ci->module['mobile_domain']) {
            ob_start();
            \Phpcmf\Service::V()->init('mobile');
            $ci->_Index(1);
            $html = ob_get_clean();
            $mfile = dr_format_html_file(SITE_MOBILE_DIR.'/' . $file, $root);
            $mobile = file_put_contents($mfile, $html, LOCK_EX);
            !$mobile && log_message('error', '模块【'.MOD_DIR.'】移动端首页生成失败：'.$mfile);
        } else {
            log_message('error', '模块【'.MOD_DIR.'】移动端首页生成失败：移动端未绑定域名');
        }

        $ci->_json(1, dr_lang('电脑端 （%s），移动端 （%s）', dr_format_file_size($pc), dr_format_file_size($mobile)));
    }

    // 生成内容静态选项列表
    public function _Show_Html($ci, $mid) {

        // 判断权限
        if (!dr_html_auth()) {
            $ci->_json(0, '权限验证超时，请重新执行生成');
        }

        $page = max(1, intval($_GET['pp']));
        $name = 'show-'.$mid.'-html-file-data';
        $name2 = 'show-'.$mid.'-html-file';
        $pcount = $this->get_auth_data($name2);
        if (!$pcount) {
            $ci->_json(0, '临时数据不存在：'.$name2);
        } elseif ($page > $pcount) {
            // 完成
            $this->del_auth_data($name);
            $this->del_auth_data($name2);
            $ci->_json(-1, '');
        }

        $cache = $this->get_auth_data($name);
        if (!$cache) {
            $ci->_json(0, '临时数据不存在：'.$name);
        } elseif (!$cache['sql']) {
            $ci->_json(0, '临时数据SQL未生成成功：'.$name);
        }

        $sql = $cache['sql']. ' order by id asc limit '.($cache['pagesize'] * ($page - 1)).','.$cache['pagesize'];
        $data = \Phpcmf\Service::M()->db->query($sql)->getResultArray();
        if (!$data) {
            // 完成
            $this->del_auth_data($name);
            $this->del_auth_data($name2);
            $ci->_json(-1, '');
        }

        $html = '';
        foreach ($data as $t) {

            // 初始化模块
            if (!$mid) {
                if (!$t['is_module_dirname']) {
                    $ci->module = null;
                } else {
                    $ci->is_module_init = false;
                    $ci->_module_init($t['is_module_dirname']);
                }
            } else {
                $ci->_module_init($mid);
            }

            $class = '';
            if (!$ci->module) {
                $ok = "<a class='error' href='".dr_url_prefix($t['url'])."' target='_blank'>模块".$t['mid']."未被初始化</a>";
                $class = ' p_error';
                /*
            } elseif (!$ci->module['category'][$t['catid']]['setting']['html']) {
                $ok = "<a class='error' href='".dr_url_prefix($t['url'])."' target='_blank'>它是动态模式</a>";
                $class = ' p_error';
            } elseif ($this->member_cache['auth_module'][SITE_ID][$this->module['dirname']]['category'][$t['id']]['show']) {
                $ok = "<a class='error' href='".$t['url']."' target='_blank'>设置的有访问权限</a>";
                $class = ' p_error';*/
            } else {
                $rt = $this->_Create_Show_Html($ci, $mid, $t['id']);
                $this->set_auth_data($name2.'-error', $page); // 设置断点
                if ($rt['code']) {
                    $ok = "<a class='ok' href='".dr_url_prefix($t['url'])."' target='_blank'>生成成功</a>";
                } else {
                    $ok = "<a class='error' href='".dr_url_prefix($t['url'])."' target='_blank'>".$rt['msg']."</a>";
                    $class = ' p_error';
                }
            }

            $html.= '<p class="todo_p '.$class.'"><label class="rleft">(#'.$t['id'].')'.$t['title'].'</label><label class="rright">'.$ok.'</label></p>';

        }

        $ci->_json($page + 1, $html, ['pcount' => $pcount + 1]);
    }

    // 生成内容静态选项列表
    public function _Category_Html($ci, $mid) {

        // 判断权限
        if (!dr_html_auth()) {
            $ci->_json(0, '权限验证超时，请重新执行生成');
        }

        $page = max(1, intval($_GET['pp']));
        $is_mobile = intval($_GET['is_mobile']);
        if ($is_mobile && !SITE_IS_MOBILE_HTML) {
            $ci->_json(0, '没有开启移动端生成静态功能，项目设置-手机设置-开启静态生成');
        }

        $name2 = 'category-'.$mid.$is_mobile.'-html-file';
        $pcount = $this->get_auth_data($name2);
        if (!$pcount) {
            $ci->_json(0, '临时数据不存在：'.$name2);
        } elseif ($page > $pcount) {
            // 完成
            $this->del_auth_data($name2, true);
            $ci->_json(-1, '');
        }

        $name = 'category-'.$mid.$is_mobile.'-html-file-'.$page;
        $cache = $this->get_auth_data($name);
        if (!$cache) {
            $ci->_json(0, '临时数据不存在：'.$name);
        }

        if ($mid) {
            $ci->_module_init($mid);
        }


        $html = '';
        foreach ($cache as $t) {

            // 初始化模块
            if (!$mid) {
                $ci->_module_init($t['mid'] ? $t['mid'] : 'share');
            }

            $class = '';
            if (!$ci->module) {
                $ok = "<a class='error' href='".dr_url_prefix($t['url'], $mid, SITE_ID, $is_mobile)."' target='_blank'>模块".$t['mid']."未被初始化</a>";
                $class = ' p_error';
                /*
            } elseif (!$t['html']) {
                $ok = "<a class='error' href='".dr_url_prefix($t['url'], $mid, SITE_ID, $is_mobile)."' target='_blank'>它是动态模式</a>";
                $class = ' p_error';
            } elseif ($this->member_cache['auth_module'][SITE_ID][($this->module['share'] ? 'share' : $this->module['dirname'])]['category'][$t['id']]['show']) {
                $ok = "<a class='error' href='".$t['url']."' target='_blank'>设置的有访问权限</a>";
                $class = ' p_error';*/
            } else {
                $rt = $this->_Create_Category_Html($ci, $mid, $t['id'], $t['page'], $is_mobile);
                $this->set_auth_data($name2.'-error', $page); // 设置断点
                if ($rt['code']) {
                    $ok = "<a class='ok' href='".dr_url_prefix($t['url'], $mid, SITE_ID, $is_mobile)."' target='_blank'>生成成功</a>";
                } else {
                    $ok = "<a class='error' href='".dr_url_prefix($t['url'], $mid, SITE_ID, $is_mobile)."' target='_blank'>".$rt['msg']."</a>";
                    $class = ' p_error';
                }

            }
            $html.= '<p class="todo_p '.$class.'"><label class="rleft">(#'.$t['id'].')'.$t['name'].'</label><label class="rright">'.$ok.'</label></p>';

        }

        //$this->del_auth_data($name);

        $ci->_json($page + 1, $html, ['pcount' => $pcount + 1]);
    }


    public function set_auth_data($name, $data) {
        $path = WRITEPATH.'chtml/';
        dr_mkdirs($path);
        $file = $path.SITE_ID.'-'.$name.'.json';
        file_put_contents($file, json_encode($data));
    }

    public function get_auth_data($name) {
        $path = WRITEPATH.'chtml/';
        dr_mkdirs($path);
        $file = $path.SITE_ID.'-'.$name.'.json';
        $json = file_get_contents($file);
        return json_decode($json, true);
    }

    public function clear($name) {
        $this->del_auth_data($name);
    }
    public function del_auth_data($name, $is_all = false) {
        $path = WRITEPATH.'chtml/';
        $file = $path.SITE_ID.'-'.$name.'.json';
        if ($is_all && is_file($file)) {
            $max = (int)file_get_contents($file);
            for ($i = 0; $i < $max; $i++) {
                if (is_file($path.SITE_ID.'-'.$name.'-'.$i.'.json')) {
                    @unlink($path.SITE_ID.'-'.$name.'-'.$i.'.json');
                }
            }
        }
        @unlink($file);
    }

}