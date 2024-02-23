-- ----------------------------
-- Table structure for dr_webcollector_rules
-- ----------------------------
DROP TABLE IF EXISTS `{dbprefix}webcollector_rules`;
CREATE TABLE IF NOT EXISTS `{dbprefix}webcollector_rules`  (
  `id` bigint(18) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL COMMENT '添加人',
  `displayorder` smallint(5) NOT NULL COMMENT '后台排序字段',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '启用状态',
  `rulename` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则名称',
  `apiurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接口地址',
  `token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接口用户名',
  `moduleid` smallint(5) NOT NULL COMMENT '关联模型ID',
  `categoryid` smallint(5) NULL DEFAULT NULL COMMENT '栏目ID',
  `setting` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置信息',
  `inputtime` int(10) NOT NULL COMMENT '添加时间',
  `updatetime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `ip` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '添加IP',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inputtime`(`inputtime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='采集规则配置表';
