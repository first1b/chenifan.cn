
DROP TABLE IF EXISTS `{dbprefix}keydatasset`;

CREATE TABLE `{dbprefix}keydatasset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setdata` text(0) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


insert  into `{dbprefix}keydatasset`(`id`,`setdata`) values (1,'{"kds_password":"keydatas.com","titleUnique":"true"}');