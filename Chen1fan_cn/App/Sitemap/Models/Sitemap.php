<?php namespace Phpcmf\Model\Sitemap;

class Sitemap extends \Phpcmf\Model {

    private $zzconfig;

    // 配置信息
    public function getConfig() {

        if ($this->zzconfig) {
            return $this->zzconfig;
        }

        if (is_file(WRITEPATH.'config/sitemap.php')) {
            $this->zzconfig = require WRITEPATH.'config/sitemap.php';
            return $this->zzconfig;
        }

        return [];
    }

    // 配置信息
    public function setConfig($data) {
        \Phpcmf\Service::L('Config')->file(WRITEPATH.'config/sitemap.php', '站长配置文件', 32)->to_require($data);
    }

    // 网站地图
    public function sitemap_xml() {

        $config = $this->getConfig();
        $module = \Phpcmf\Service::L('input')->get('mid');
        $cache_file = '';
        if (isset($config['autotime']) && $config['autotime']) {
            dr_mkdirs(WRITEPATH.'app/sitemap/');
            $cache_file = WRITEPATH.'app/sitemap/xml_'.$module.'.txt';
            $time = filectime($cache_file);
            if (SYS_TIME - $time < 3600*intval($config['autotime'])) {
                // 没有超时，不生成
                if (is_file($cache_file)) {
                    return file_get_contents($cache_file);
                }
                $cache_file = '';
            }
        }

        $xml = '<?xml version="1.0" encoding="utf-8"?>'.PHP_EOL;
        $xml.= '<urlset>'.PHP_EOL;
        if ($config['sitemap']) {
            // 判断站点id
            $site_domain = []; // 全网域名对应的站点id
            if (is_file(WRITEPATH.'config/domain_site.php')) {
                $site_domain = require WRITEPATH.'config/domain_site.php';
            }
            $siteid = max(1, intval($site_domain[DOMAIN_NAME]));
            // 显示数量
            $limit = intval($config['sitemap_limit']);
            !$limit && $limit = 1000;

            // 共享栏目
            if (isset($config['sitemap_cat']) && $config['sitemap_cat']) {
                $cat = \Phpcmf\Service::L('cache')->get('module-'.$siteid.'-share', 'category');
                if ($cat) {
                    foreach ($cat as $t) {
                        if ($t['tid'] == 2) {
                            continue;
                        }
                        $xml.= '    <url>'.PHP_EOL;
                        $xml.= '        <loc>'.htmlspecialchars(dr_url_prefix($t['url'], '', $siteid)).'</loc>'.PHP_EOL;
                        $xml.= '        <lastmod>'.date('Y-m-d', SYS_TIME).'</lastmod>'.PHP_EOL;
                        $xml.= '        <changefreq>daily</changefreq>'.PHP_EOL;
                        $xml.= '        <priority>1.0</priority>'.PHP_EOL;
                        $xml.= '    </url>'.PHP_EOL;
                    }
                }
            }

            if ($module) {
                // 单独模块
                $data = $this->_sitemap_module_data($siteid, $module, $limit);
                if ($data) {
                    foreach ($data as $t) {
                        $xml.= $t['xml'].PHP_EOL;
                    }
                }
            } else {
                // 全站模块
                $data = [];
                foreach ($config['sitemap'] as $mid => $t) {
                    $my = $this->_sitemap_module_data($siteid, $mid, $limit);
                    $my && $data = array_merge($data, $my);
                }
                if ($data) {
                    usort($data, function($a, $b) {
                        if ($a['time'] == $b['time'])
                            return 0;
                        return ($a['time'] > $b['time']) ? -1 : 1;
                    });
                    foreach ($data as $t) {
                        $xml.= $t['xml'].PHP_EOL;
                    }
                }
            }
        }

        $xml.= '</urlset>'.PHP_EOL;

        if ($cache_file) {
            file_put_contents($cache_file, $xml);
        }

        return $xml;
    }

    // 网站地图
    public function sitemap_txt() {

        $config = $this->getConfig();
        $module = \Phpcmf\Service::L('input')->get('mid');
        $cache_file = '';
        if (isset($config['autotime']) && $config['autotime']) {
            dr_mkdirs(WRITEPATH.'app/sitemap/');
            $cache_file = WRITEPATH.'app/sitemap/txt_'.$module.'.txt';
            $time = filectime($cache_file);
            if (SYS_TIME - $time < 3600*intval($config['autotime'])) {
                // 没有超时，不生成
                if (is_file($cache_file)) {
                    return file_get_contents($cache_file);
                }
                $cache_file = '';
            }
        }

        /*$xml = '<?xml version="1.0" encoding="utf-8"?>'.PHP_EOL;
        $xml.= '<urlset>'.PHP_EOL;*/
        $xml = '';
        if ($config['sitemap']) {
            // 判断站点id
            $site_domain = []; // 全网域名对应的站点id
            if (is_file(WRITEPATH.'config/domain_site.php')) {
                $site_domain = require WRITEPATH.'config/domain_site.php';
            }
            $siteid = max(1, intval($site_domain[DOMAIN_NAME]));
            // 显示数量
            $limit = intval($config['sitemap_limit']);
            !$limit && $limit = 1000;

            if ($module) {
                // 单独模块
                // 栏目
                if (isset($config['sitemap_cat']) && $config['sitemap_cat']) {
                    $mod = \Phpcmf\Service::L('cache')->get('module-'.$siteid.'-'.$module);
                    if (!$mod['share']) {
                        if ($mod['category']) {
                            foreach ($mod['category'] as $t) {
                                if ($t['tid'] == 2) {
                                    continue;
                                }
                                $xml.= (dr_url_prefix($t['url'], $module, $siteid)).PHP_EOL;
                            }
                        }
                    }
                }
                $data = $this->_sitemap_module_data($siteid, $module, $limit);
                if ($data) {
                    foreach ($data as $t) {
                        $xml.= $t['txt'].PHP_EOL;
                    }
                }
            } else {
                // 全站模块

                // 栏目
                if (isset($config['sitemap_cat']) && $config['sitemap_cat']) {
                    // 共享
                    $cat = \Phpcmf\Service::L('cache')->get('module-'.$siteid.'-share', 'category');
                    if ($cat) {
                        foreach ($cat as $t) {
                            if ($t['tid'] == 2) {
                                continue;
                            }
                            $xml.= (dr_url_prefix($t['url'], '', $siteid)).PHP_EOL;
                        }
                    }
                    // 独立
                    foreach ($config['sitemap'] as $mid => $t) {
                        $mod = \Phpcmf\Service::L('cache')->get('module-'.$siteid.'-'.$mid);
                        if (!$mod['share']) {
                            if ($mod['category']) {
                                foreach ($mod['category'] as $t) {
                                    if ($t['tid'] == 2) {
                                        continue;
                                    }
                                    $xml.= (dr_url_prefix($t['url'], '', $siteid)).PHP_EOL;
                                }
                            }
                        }
                    }
                }
                $data = [];
                foreach ($config['sitemap'] as $mid => $t) {
                    $my = $this->_sitemap_module_data($siteid, $mid, $limit);
                    $my && $data = array_merge($data, $my);
                }
                if ($data) {
                    usort($data, function($a, $b) {
                        if ($a['time'] == $b['time'])
                            return 0;
                        return ($a['time'] > $b['time']) ? -1 : 1;
                    });
                    foreach ($data as $t) {
                        $xml.= $t['txt'].PHP_EOL;
                    }
                }
            }

        }

        //$xml.= '</urlset>'.PHP_EOL;
        if ($cache_file) {
            file_put_contents($cache_file, $xml);
        }

        return $xml;
    }

    // 模块内容生成
    private function _sitemap_module_data($siteid, $mid, $limit) {

        if (!$this->is_table_exists($siteid.'_'.$mid)) {
            return '';
        }

        $data = [];
        $config = $this->getConfig();
        $db = $this->db->table($siteid.'_'.$mid)->select('url,updatetime');
        if ($config['where'][$mid]) {
            $db->where($config['where'][$mid]);
        }
        $query = $db->orderBy('updatetime desc')->limit($limit)->get();
        if ($query) {
            $rows = $query->getResultArray();
            if ($rows) {
                foreach ($rows as $t) {
                    $xml = '';
                    $xml.= '    <url>'.PHP_EOL;
                    $xml.= '        <loc>'.htmlspecialchars(dr_url_prefix($t['url'], $mid, $siteid)).'</loc>'.PHP_EOL;
                    $xml.= '        <lastmod>'.date('Y-m-d', $t['updatetime']).'</lastmod>'.PHP_EOL;
                    $xml.= '        <changefreq>daily</changefreq>'.PHP_EOL;
                    $xml.= '        <priority>1.0</priority>'.PHP_EOL;
                    $xml.= '    </url>'.PHP_EOL;

                    $data[] = [
                        'txt' => urldecode(dr_url_prefix($t['url'], $mid, $siteid)),
                        'xml' => $xml,
                        'time' => $t['updatetime'],
                    ];
                }
            }
        }

        return $data;
    }

}