<?php

/**
 * URL解析规则
 * 例如：  114.html 对应 index.php?s=demo&c=show&id=114
 * 可以解析：  "114.html"  => 'index.php?s=demo&c=show&id=114',
 * 动态id解析：  "([0-9]+).html"  => 'index.php?s=demo&c=show&id=$1',
 */

return [

    /***********************下面写你自己的URL解析规则********************/

// 共享栏目测试规则---解析规则----开始
    "([A-za-z0-9 \-\_]+)\/list_([0-9]+)_([0-9]+)\.html" => "index.php?c=category&dir=$1&page=$3",  //【共享栏目测试规则】模块栏目列表(分页)（{dirname}/list_{id}_{page}.html）
    "([A-za-z0-9 \-\_]+)" => "index.php?c=category&dir=$1",  //【共享栏目测试规则】模块栏目列表（{dirname}）
    "([A-za-z0-9 \-\_]+)\/([0-9]+)_([0-9]+)\.html" => "index.php?c=show&id=$2&page=$3",  //【共享栏目测试规则】模块内容页(分页)（{dirname}/{id}_{page}.html）
    "([A-za-z0-9 \-\_]+)\/([0-9]+)\.html" => "index.php?c=show&id=$2",  //【共享栏目测试规则】模块内容页（{dirname}/{id}.html）

// 共享栏目测试规则---解析规则----结束

// 共享模块测试规则---解析规则----开始
    "([a-z]+)\/search\/(.+)\.html" => "index.php?s=$1&c=search&rewrite=$2",  //【共享模块测试规则】模块搜索页(分页)（{modname}/search/{param}.html）
    "([a-z]+)\/search\.html" => "index.php?s=$1&c=search",  //【共享模块测试规则】模块搜索页（{modname}/search.html）

// 共享模块测试规则---解析规则----结束

// 独立模块测试规则---解析规则----开始
    "([a-z]+)\.html" => "index.php?s=$1",  //【独立模块测试规则】模块首页（{modname}.html）
   "([a-z]+)\/list\/([0-9]+)\/([0-9]+)\.html" => "index.php?s=$1&c=category&id=$2&page=$3",  //【独立模块测试规则】模块栏目列表(分页)（{modname}/list/{id}/{page}.html）
    "([a-z]+)\/list\/([0-9]+)\.html" => "index.php?s=$1&c=category&id=$2",  //【独立模块测试规则】模块栏目列表（{modname}/list/{id}.html）
    "([a-z]+)\/show\/([0-9]+)\/([0-9]+)\.html" => "index.php?s=$1&c=show&id=$2&page=$3",  //【独立模块测试规则】模块内容页(分页)（{modname}/show/{id}/{page}.html）
    "([a-z]+)\/show\/([0-9]+)\.html" => "index.php?s=$1&c=show&id=$2",  //【独立模块测试规则】模块内容页（{modname}/show/{id}.html）
    "^/pic\/(.*?)\.jpg$" => "/pic/pic.php?k=$1",//图片自动
// 独立模块测试规则---解析规则----结束
'sitemap.txt' => 'index.php?s=sitemap&page=999', // 地图规则
'sitemap.xml' => 'index.php?s=sitemap&c=home&m=xml&page=998', // 地图规则





];