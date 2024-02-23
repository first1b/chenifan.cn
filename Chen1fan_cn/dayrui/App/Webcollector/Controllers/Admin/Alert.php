<?php

namespace Phpcmf\Controllers\Admin;

// 这里是相关的API调用文件
// 后台提示信息
class Alert extends \Phpcmf\Common
{

  public function index()
  {
    exit;
  }

  /** 
   * 接口文件，获取栏目名称
   * @return string
   */
  public function simple()
  {
    $get = dr_safe_replace(\Phpcmf\Service::L('input')->get('code'));
    $result = '';
    if ($get == 'nofile') {
      $result = '目标文件不存在，请检查以下文件是否存在：<br/><br/>一、'.WEBPATH.'api/webcollector.php<br>如果不存在，请将' . APPPATH.'config/source/api更改为webcollector.php并添加到'.WEBPATH.'api/文件夹下。<br><br>二、'.MYPATH.'Api/Webcollector.php<br>如果不存在，请将'.APPPATH.'config/source/dayapi更名为Webcollecotor.php并添加到'.MYPATH.'Api/文件夹下<br><br>注意：<br>文件夹及名称大小写必须与上述一致<br>如果没有对应的文件夹，就创建';
    }
    //获取接口文件标识码
    echo $result;
  }
}
