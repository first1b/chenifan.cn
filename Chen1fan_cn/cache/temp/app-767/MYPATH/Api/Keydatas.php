<?php

//简数采集免登陆接口：version 1.0.2    
//支持 XunRuiCMS-V4.5.1

	$_REQ = keydatas_mergeRequest();

	$this->_module_init('news');
	if (isset($_SERVER["HTTPS"]) && strtolower($_SERVER["HTTPS"]) == "on") {
		$http = "https://";
	} else {
		$http =  "http://";
	}
	$domain = $http.str_replace('\\', '/', $_SERVER['HTTP_HOST']);
	if (isset($_REQ["__kds_flag"])){	
		if ($_REQ["__kds_flag"] == "post") {//提交

			$rt = \Phpcmf\Service::M()->db->table("keydatasset")->where('id', 1)->get();
			if ($rt) {
				$rows = $rt->getResultArray();
				$setdata = json_decode($rows[0]["setdata"], true); 
			}else{
				keydatas_failRsp(1402, "keydatasset table does not exist", "简数采集发布插件配置表keydatasset不存在，请检查并创建配置表");
			}
			//$auth = $authdata['authcode'];

		
			//密码校验
			if (empty($_REQ['kds_password']) || $_REQ['kds_password'] != $setdata['kds_password']) {
				keydatas_failRsp(1403, "password error", "提交的发布密码错误");
			}
			
		
			//检查标题		
			$title  = isset($_REQ['title']) ? addslashes($_REQ['title']) : '';//标题	
			if (empty($title)) {
				keydatas_failRsp(1404, "title is empty", "标题不能为空");
			}
			//检查内容		
			$content  = isset($_REQ['content']) ? $_REQ['content'] : '';
			if (empty($content)) {
				keydatas_failRsp(1405, "content is empty", "内容不能为空");
			}
			//检查栏目		
			$catid  = isset($_REQ['catid']) ? addslashes($_REQ['catid']) : '';
			if (empty($catid)) {
				keydatas_failRsp(1406, "catid is empty", "栏目ID不能为空");
			}
			
			$category = \Phpcmf\Service::M()->db->table("1_share_category")->where('id', $catid)->get();
			if ($category) {
				$categoryrows = $category->getResultArray();
				$setting = json_decode($categoryrows[0]["setting"], true); 
				$urlrule = $setting['urlrule']; 
				//如结果是"urlrule":0是动态，伪静态是"urlrule":1	
				//{SITE_NAME}","list_keywords":"","list_description":""},"urlrule":1,"html":0}
				//{SITE_NAME}","list_keywords":"","list_description":""},"urlrule":0,"html":0}			  		
				if($urlrule){
					$ifwzt = true;
				}else{
					$ifwzt = false;
				}
			}else{
				keydatas_failRsp(1402, "catid is error", "栏目ID错误，无法在迅睿CMS此找到此ID");
			}
			
			//标题重复检查
			
			if($setdata['titleUnique']){
				$rowid = $this->content_model->find_id('title',$_REQ['title']);
				if ($rowid>0){
					if ($ifwzt){
						//show-139.html
						$docFinalUrl =$domain."/show-".$rowid.'.html';
					}else{
						$docFinalUrl =$domain."/index.php?c=show&id=".$rowid;
					}
					return keydatas_successRsp(array("url" => $docFinalUrl),'标题已存在');
			
				}			
			}
			
	
			///////////////////////////////////////
	
			
			$uid  = isset($_REQ['uid']) ? $_REQ['uid'] : 0;
			//keywords,description
			$keywords  = isset($_REQ['keywords']) ? $_REQ['keywords'] : '';
			$description  = isset($_REQ['description']) ? $_REQ['description'] : '';
			
			$status = isset($_REQ['status']) ? $_REQ['status'] : 9;   //9发布，1审核
			$hits  = isset($_REQ['hits']) ? $_REQ['hits'] : 0;
			$displayorder  = isset($_REQ['displayorder']) ? $_REQ['displayorder'] : 0;
			$author  = isset($_REQ['author']) ? $_REQ['author'] : '';
			$inputip  = isset($_REQ['inputip']) ? $_REQ['inputip'] : '127.0.0.1';
			$inputtime  = isset($_REQ['inputtime']) ? $_REQ['inputtime'] : SYS_TIME;
			$updatetime  = isset($_REQ['updatetime']) ? $_REQ['updatetime'] : SYS_TIME;
			
			
			
			// 主表字段
			$fields[1] = $this->get_cache('table-'.SITE_ID, $this->content_model->dbprefix(SITE_ID.'_'.MOD_DIR));
			$cache = $this->get_cache('table-'.SITE_ID, $this->content_model->dbprefix(SITE_ID.'_'.MOD_DIR.'_category_data'));
			$cache && $fields[1] = array_merge($fields[1], $cache);
			
			// 附表字段
			$fields[0] = $this->get_cache('table-'.SITE_ID, $this->content_model->dbprefix(SITE_ID.'_'.MOD_DIR.'_data_0'));
			$cache = $this->get_cache('table-'.SITE_ID, $this->content_model->dbprefix(SITE_ID.'_'.MOD_DIR.'_category_data_0'));
			$cache && $fields[0] = array_merge($fields[0], $cache);
			
			// 去重
			$fields[0] = array_unique($fields[0]);
			$fields[1] = array_unique($fields[1]);
			
			$save = [];
			
			// 主表附表归类
			foreach ($fields as $ismain => $field) {
				foreach ($field as $name) {
					isset($_REQ[$name]) && $save[$ismain][$name] = $_REQ[$name];
				}
			}		
			
			
			$save[1]['catid'] = $catid;		
			$save[1]['title'] = $title;
			//$save[1]['content'] = $content;
			$save[1]['keywords'] = $keywords;
			$save[1]['description'] = $description;
	
			$save[1]['uid'] = $uid; 
			$save[1]['author'] =  $author ;
			$save[1]['status'] = $status;
			$save[1]['hits'] = $hits;
			$save[1]['displayorder'] = $displayorder;
			$save[1]['inputtime'] = $inputtime;
			$save[1]['updatetime'] = $updatetime;
			$save[1]['inputip'] = $inputip;
			
			//直接到http开头的链接进行图片下载，对于图片暂停简数的情况，系统会自动取得第一张图片的相对地址写入到表字段中。
			if (strpos($_REQ['thumb'], 'http') === 0 ){
				$thumburl =  downloadThumb($_REQ['thumb'],$domain);
				$save[1]['thumb'] = $thumburl;
			}
			
			$rt = $this->content_model->save_content(0, $save);
			if ($rt['code']>0) {
				if ($ifwzt){
					//show-139.html
					$docFinalUrl=$domain.'/show-'.$rt['code'].'.html';
				}else{
					$docFinalUrl=$domain.'/index.php?c=show&id='.$rt['code'];
				}
				//$docFinalUrl=$domain.'/index.php?c=show&id='.$rt['code'];
				/////图片http下载，不能用_POST
				downloadImages($_REQ);	
				keydatas_successRsp(array("url" => $docFinalUrl));
				
			}else{
				keydatas_failRsp(1407, "insert dr_1_news error", "文章发布错误");
			}

		}
			
	}
			


	 /**
     * 获取文件完整路径
     * @return string
     */
	 function getFilePath(){
		//$rootUrl=$this->options->siteUrl();
		//使用php的方法试试
		///uploads/ueditor/20200620/1-20062010343IR.jpeg
		$rootUrl=dirname(dirname(dirname(dirname(__FILE__))));
		return $rootUrl.'/uploadfile/ueditor/image';
	}
	
    /**
     * 查找文件夹，如不存在就创建并授权
     * @return string
     */
	 function createFolders($dir){ 
		return is_dir($dir) or (createFolders(dirname($dir)) and mkdir($dir, 0777)); 
	}	
	////图片http下载，下载缩略图
	function  downloadThumb($thumb,$domain){	
	  try{

		//$downloadFlag = isset($post['__kds_download_imgs_flag']) ? $post['__kds_download_imgs_flag'] : '';
		//if (!empty($downloadFlag) && $downloadFlag== "true") {
			$docImgsStr = isset($thumb) ? $thumb : '';
			$file = '';
			
			if (!empty($docImgsStr)) {
				$docImgs = explode(',',$docImgsStr);
				if (is_array($docImgs)) {
					$uploadDir = getFilePath();
					foreach ($docImgs as $imgUrl) {
						$urlItemArr = explode('/',$imgUrl);
						$itemLen=count($urlItemArr);
						if($itemLen>=3){
							//最后的相对路径,如  2018/06
							$fileRelaPath=$urlItemArr[$itemLen-3].'/'.$urlItemArr[$itemLen-2];
							$imgName=$urlItemArr[$itemLen-1];
							$finalPath=$uploadDir. '/'.$fileRelaPath;
							$thumburl=$domain.'/uploadfile/ueditor/image/'.$fileRelaPath. '/' . $imgName;
							
							if (createFolders($finalPath)) {
								$file = $finalPath . '/' . $imgName;
								
								if(!file_exists($file)){
									$doc_image_data = file_get_contents($imgUrl);
									file_put_contents($file, $doc_image_data);
									
								}
								return $thumburl;
							}
						}
					}
				}
			}				
		//}
	 } catch (Exception $ex) {
		//error_log('error:'.$e->
	 }		
	}	
		
	////图片http下载
	//private 
	function  downloadImages($post){	
	  try{

		$downloadFlag = isset($post['__kds_download_imgs_flag']) ? $post['__kds_download_imgs_flag'] : '';
		if (!empty($downloadFlag) && $downloadFlag== "true") {
			$docImgsStr = isset($post['__kds_docImgs']) ? $post['__kds_docImgs'] : '';
			
			if (!empty($docImgsStr)) {
				$docImgs = explode(',',$docImgsStr);
				if (is_array($docImgs)) {
					$uploadDir = getFilePath();
					foreach ($docImgs as $imgUrl) {
						$urlItemArr = explode('/',$imgUrl);
						$itemLen=count($urlItemArr);
						if($itemLen>=3){
							//最后的相对路径,如  2018/06
							$fileRelaPath=$urlItemArr[$itemLen-3].'/'.$urlItemArr[$itemLen-2];
							$imgName=$urlItemArr[$itemLen-1];
							$finalPath=$uploadDir. '/'.$fileRelaPath;
							if (createFolders($finalPath)) {
								$file = $finalPath . '/' . $imgName;
								
								if(!file_exists($file)){
									$doc_image_data = file_get_contents($imgUrl);
									file_put_contents($file, $doc_image_data);
								}
							}
						}
					}
				}
			}				
		}
	 } catch (Exception $ex) {
		//error_log('error:'.$e->
	 }		
	}	
	
	function keydatas_mergeRequest() {
		if (isset($_GET['__kds_flag'])) {
			$_REQ  = array_merge($_GET, $_POST);
		} else {
			$_REQ  = $_POST;
		}
		return $_REQ ;
	}

	 function keydatas_successRsp($data = "", $msg = "") {
		keydatas_rsp(1,0, $data, $msg);
	}

	 function keydatas_failRsp($code = 0, $data = "", $msg = "") {
		keydatas_rsp(0,$code, $data, $msg);
	}
	
	 function keydatas_rsp($result = 1,$code = 0, $data = "", $msg = "") {
		die(json_encode(array("rs" => $result, "code" => $code, "data" => $data, "msg" => urlencode($msg))));
	}
