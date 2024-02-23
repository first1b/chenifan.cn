<?php

namespace Phpcmf\Controllers\Admin;

class Collectrules extends \Phpcmf\Table
{

  public function __construct()
  {
    parent::__construct();
    // 表单显示名称
    $this->name = dr_lang('采集规则');
    // 模板前缀(避免混淆)
    $this->tpl_prefix = 'collectrules_';

    // 采用ajax列表请求
    $this->is_ajax_list = true;

    $json_file = str_replace('.php', '.json', __FILE__);
    if (is_file($json_file)) {
      $json = dr_string2array(file_get_contents($json_file));
      if ($json) {
        if ($json['field']) {
          $field = $json['field'];
        }
        if ($json['list']) {
          $list_field = $json['list'];
        }
      }
    }else{
      exit("没有对应的json配置文件");
    }

    // 初始化数据表
    $this->_init([
      'table' => 'webcollector_rules',  // （不带前缀的）表名字
      'field' => $field, // 可查询的字段
      'list_field' => $list_field,
      'order_by' => 'id desc', // 列表排序，默认的排序方式
      'date_field' => '', // 按时间段搜索字段，没有时间字段留空
    ]);

    // 把公共变量传入模板
    \Phpcmf\Service::V()->assign([
      // 搜索字段
      'field' => $field,
      'is_time_where' => $this->init['date_field'],
      // 后台的菜单
      'menu' => \Phpcmf\Service::M('auth')->_admin_menu(
        [
          $this->name => [APP_DIR . '/' . \Phpcmf\Service::L('Router')->class . '/index', 'fa fa-code'],
          '添加规则' => [APP_DIR . '/' . \Phpcmf\Service::L('Router')->class . '/add', 'fa fa-plus'],
          '修改' => ['hide:' . APP_DIR . '/' . \Phpcmf\Service::L('Router')->class . '/edit', 'fa fa-edit'],
        ]
      )
    ]);
  }

  // 查看列表
  public function index()
  {
    list($tpl) = $this->_List();

    $this->mytable['link_tpl'].= '<label><btn class="btn btn-xs blue" target="_blank" onclick="openTestUrl({id});"> <i class="fa fa-eye"></i>接口测试</btn></label>';
     
     \Phpcmf\Service::V()->assign([
      'mytable' => $this->mytable,
     ]);
    
    \Phpcmf\Service::V()->display($tpl);
  }

  // 添加内容
  public function add()
  {
    list($tpl) = $this->_Post(0);
    \Phpcmf\Service::V()->display($tpl);
  }

  // 修改内容
  public function edit()
  {
    list($tpl) = $this->_Post(intval(\Phpcmf\Service::L('input')->get('id')));
    \Phpcmf\Service::V()->display($tpl);
  }

  // 删除内容
  public function del()
  {
    $this->_Del(
      \Phpcmf\Service::L('Input')->get_post_ids(),
      function ($rows) {
        // 删除前的验证
        return dr_return_data(1, 'ok', $rows);
      },
      function ($rows) {
        // 删除后的处理
        return dr_return_data(1, 'ok');
      },
      \Phpcmf\Service::M()->dbprefix($this->init['table'])
    );
  }

  /**
   * 获取内容
   * $id      内容id,新增为0
   * */
  protected function _Data($id = 0)
  {
    $row = parent::_Data($id);
    // 这里可以对内容进行格式化显示操处理
    if (!$id) {
      //表示新增数据
      $row['token'] = \Phpcmf\Service::M('my', 'webcollector')->create_token();
    }
    return $row;
  }

  // 格式化保存数据
  protected function _Format_Data($id, $data, $old)
  {
    $data[1]['uid'] = (int)$this->member['uid']; //插入用户ID
    $data[1]['updatetime'] = SYS_TIME;
    $data[1]['ip'] = $_SERVER['REMOTE_ADDR'];
    if (!$id) {
      // 当提交新数据时，把当前时间插入进去
      $data[1]['inputtime'] = SYS_TIME;
    }
    return $data;
  }


  // 保存内容
  protected function _Save($id = 0, $data = [], $old = [], $func = null, $func2 = null)
  {
    return parent::_Save($id, $data, $old, function ($id, $data, $old) {
      // 验证规则名称
      if (!$data[1]['rulename']) {
        return dr_return_data(0, '规则名称不能为空', ['field' => 'rulename']);
      }
      // 验证是否有关联模型ID
      if (!$data[1]['moduleid']) {
        return dr_return_data(0, '关联模型ID不能为空', ['field' => 'moduleid']);
      }
      // 保存之前执行的函数，并返回新的数据
      if (!$id) {
        // 当提交新数据时，把当前时间插入进去
        //$data[1]['inputtime'] = SYS_TIME;
      }

      return dr_return_data(1, null, $data);
    }, function ($id, $data, $old) {
      // 保存之后执行的动作
    });
  }
}
