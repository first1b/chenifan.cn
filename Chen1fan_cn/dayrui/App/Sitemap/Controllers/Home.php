<?php namespace Phpcmf\Controllers;

class Home extends \Phpcmf\Common
{

    public function index() {
        header('Content-Type: text/plain');
        echo \Phpcmf\Service::M('sitemap', 'sitemap')->sitemap_txt();exit;
    }

    public function xml() {
        header('Content-Type: text/xml');
        echo \Phpcmf\Service::M('sitemap', 'sitemap')->sitemap_xml();exit;
    }

    public function tag() {
        header('Content-Type: text/plain');
        echo \Phpcmf\Service::M('sitemap', 'sitemap')->tag_txt();exit;
    }


}
