DROP TABLE IF EXISTS `{dbprefix}app_chtml`;
CREATE TABLE IF NOT EXISTS `{dbprefix}app_chtml` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `siteid` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mid` varchar(50) NOT NULL,
  `where` text DEFAULT NULL,
  `param` text DEFAULT NULL,
  `counts` int(10) NOT NULL,
  `htmls` int(10) NOT NULL,
  `error` text DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT NULL COMMENT '状态',
  `inputtime` int(10) unsigned NOT NULL COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL COMMENT '最近生成时间',
  PRIMARY KEY (`id`),
  KEY `siteid` (`siteid`),
  KEY `status` (`status`),
  KEY `inputtime` (`inputtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='生成静态定时内容任务';

DROP TABLE IF EXISTS `{dbprefix}app_chtml_cat`;
CREATE TABLE IF NOT EXISTS `{dbprefix}app_chtml_cat` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `siteid` int(10) NOT NULL,
 `name` varchar(100) NOT NULL,
 `mid` varchar(50) NOT NULL,
 `where` text DEFAULT NULL,
 `param` text DEFAULT NULL,
 `counts` int(10) NOT NULL,
 `htmls` int(10) NOT NULL,
 `error` text DEFAULT NULL,
 `status` tinyint(1) unsigned DEFAULT NULL COMMENT '状态',
 `inputtime` int(10) unsigned NOT NULL COMMENT '创建时间',
 `updatetime` int(10) unsigned NOT NULL COMMENT '最近生成时间',
 PRIMARY KEY (`id`),
 KEY `siteid` (`siteid`),
 KEY `status` (`status`),
 KEY `inputtime` (`inputtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='生成静态定时栏目任务';