<?php
/*
	相关seo插件推荐：
	
	1、文章双标题插件
	https://item.taobao.com/item.htm?spm=a1z10.5-c.w4002-14546933259.10.4e1666e2GWk2IQ&id=670166926939

	2、关键词裂变工具
	https://item.taobao.com/item.htm?spm=a1z10.5-c.w4002-14546933259.16.1d6966e2TmFt6B&id=670520267237

	3、问答聚合采集器：
	https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-24255808009.18.6d157ed0yxTFah&id=673364199067

	4、微信头条关键词采集器：
	https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-24255808009.4.6d157ed0yxTFah&id=670195501741
	
	5、安装教程在word文件中，必看哦！
*/


//防盗链技术
if(isset($_SERVER['HTTP_REFERER'])){
  if(strpos($_SERVER['HTTP_REFERER'],"http://localhost")==0){
	pic();
  }
  else{
    echo "<title>404</title>";
  }
}
elseif(checkrobot()){
	pic();
}else{
	echo "<title>404</title>";
}

function pic(){
	
	$img_array = glob("./image/*.{jpg,png}",GLOB_BRACE);
	
	$dst_path = $img_array[array_rand($img_array)]; //随机调用文件夹图片，如需固定，换成固定图片路径即可
	
	$font = './Alibaba-PuHuiTi-Bold.ttf';
	$fontsize = 20;
	$dst_nr = mb_substr($_GET["k"],0,12,'utf-8');//文字内容(默认截取10个汉字)
	$dst = imagecreatefromstring(file_get_contents($dst_path));
	$color= imagecolorallocatealpha($dst,9,37,93,0);
	$imgHeight = imagesy($dst);
	$imgWidth = imagesx($dst);
	
	$fontWidth = imagefontwidth($fontsize);
	$fontHeight = imagefontheight($fontsize);
	$x = ($imgWidth-$fontWidth*strlen($dst_nr))/2;
	$y = ($imgHeight-$fontHeight)/1.75;
	
	imagefttext($dst, $fontsize, 0, $x, $y, $color, $font, $dst_nr);
	header('Content-Type: image/jpg');
	imagejpeg($dst);
	imagedestroy($dst);	
	
}

//判断是不是蜘蛛
function checkrobot($useragent=''){
	static $kw_spiders = array('bot', 'crawl', 'spider' ,'slurp', 'sohu-search', 'lycos', 'robozilla');
	static $kw_browsers = array('msie', 'netscape', 'opera', 'konqueror', 'mozilla');

	$useragent = strtolower(empty($useragent) ? $_SERVER['HTTP_USER_AGENT'] : $useragent);
	if(strpos($useragent, 'http') === false && dstrpos($useragent, $kw_browsers)) return false;
	if(dstrpos($useragent, $kw_spiders)) return true;
	return false;
}

function dstrpos($string, $arr, $returnvalue = false) {
	if(empty($string)) return false;
	foreach((array)$arr as $v) {
		if(strpos($string, $v) !== false) {
			$return = $returnvalue ? $v : true;
			return $return;
		}
	}
	return false;
}



?>

