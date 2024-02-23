<?php
// 本程序用于WebCollector火车头采集插件，如果您未使用，可以删除
define('IS_API', basename(__FILE__, '.php')); // 项目标识
define('SELF', pathinfo(__FILE__, PATHINFO_BASENAME)); // 该文件的名称
define('rootUrl', dirname(__FILE__)); // url目录
require("../index.php"); // 引入主文件
