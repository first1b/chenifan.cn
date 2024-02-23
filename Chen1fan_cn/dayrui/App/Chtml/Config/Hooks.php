<?php

if (!function_exists('dr_to_html_file')) {

    /**
     * 生成静态文件名
     */
    function dr_to_html_file($url, $root = WEBPATH) {

        if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
            return '';
        } elseif (strpos($url, 'index.php') !== false) {
            return '';
        }

        return dr_format_html_file($url, $root);
    }


// 格式化生成文件
    function dr_format_html_file($file, $root = WEBPATH) {

        if (strpos($file, 'http://') !== false) {
            return '';
        }

        $dir = dirname($file);
        $nfile = basename($file);
        if ($dir != '.' && !is_dir($root.$dir)) {
            dr_mkdirs($root.$dir, TRUE);
        }

        $hfile = str_replace('./', '', $root.$dir.'/'.$nfile);
        $hfile = str_replace('////', '/', $hfile);
        $hfile = str_replace('///', '/', $hfile);
        $hfile = str_replace('//', '/', $hfile);


        // 判断是否为目录形式
        if (strpos($nfile, '.html') === FALSE
            && strpos($nfile, '.htm') === FALSE
            && strpos($nfile, '.shtml') === FALSE) {
            $hfile = rtrim($hfile, '/').'/';
            mkdir ($hfile,0777,true);
        }

        // 如果是目录就生成一个index.html
        if (is_dir($hfile)) {
            $dir.= '/'.$nfile;
            $nfile = 'index.html';
            $hfile = str_replace('./', '', $root.$dir.'/'.$nfile);
        }

        return $hfile;
    }

// 删除静态文件
    function dr_delete_html_file($url, $root = WEBPATH) {

        $file = dr_format_html_file($url, $root);
        if (is_file($file)) {
            unlink($file);
        }
    }

}
