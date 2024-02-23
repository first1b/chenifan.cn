<?php

namespace Phpcmf\Controllers\Admin;

// 这里是相关的API调用文件
class Api extends \Phpcmf\Common
{

    public function index()
    {
        exit;
    }

    /** 
     * 接口文件，获取栏目名称
     * @return string
     */
    public function get_module_list_linkage()
    {
        //获取接口文件标识码
        $rt = \Phpcmf\Service::M()->db->table("module")->select('id,dirname,share')->get();
        if ($rt) {
            $rows = $rt->getResultArray();
        }
        $result = [
            'data' => [],
            'html' => ''
        ];
        foreach ($rows as $value) {
            $arr = [];
            $name = \Phpcmf\Service::C()->get_cache('module-' . SITE_ID . '-' . $value['dirname'])['name'];
            //var_dump($name);
            $arr['name'] = $name;
            $arr['id'] = $value['id'];
            $arr['code'] = $value['dirname'];
            $arr['share'] = $value['share'];
            array_push($result['data'], $arr);
        }
        // 获取栏目缓存
        exit(json_encode($result, JSON_UNESCAPED_UNICODE));
    }

    /** 
     * 接口文件，根据模型ID获取栏目列表
     * @param  modid 接收ID参数
     * @param pid 父栏目ID
     * @return string
     */
    public function get_category_list_linkage()
    {
        // 获取模型ID
        $modid = dr_safe_replace(\Phpcmf\Service::L('input')->get('code'));
        if (!$modid) {
            exit('参数不完整');
        }
        // 获取父栏目ID
        $pid = (int)dr_safe_replace(\Phpcmf\Service::L('input')->get('parent_id'));
        //$pid = $pid ? $pid : 0;
        // 获取模型类型
        $rt1 = \Phpcmf\Service::M()->db->table("module")->select('id,dirname,share')->where('id', $modid)->get();
        if ($rt1) {
            $rows1 = $rt1->getResultArray();
            $rows1 = $rows1[0];
        }
        if ($rows1) {
            // 获取表格参数
            if ($rows1['share'] == '1') {
                $table = 'share';
            } else {
                $table = $rows1['dirname'];
            }
        }else{
            exit("模型名称不正确");
        }

        // 独立模块
        $rt2 = \Phpcmf\Service::M()->db->table(SITE_ID . "_" . $table . "_category")->select('id,pid,name,dirname')->where('pid', $pid)->get();
        if ($rt2) {
            $rows2 = $rt2->getResultArray();
        }

        // 获取栏目缓存
        $result = [
            'data' => [],
            'html' => ''
        ];

        // 组装结果数据
        foreach ($rows2 as $value) {
            $arr = [];
            $arr['region_id'] = $value['id'];
            $arr['pid'] = $value['pid'];
            $arr['region_name'] = $value['name'];
            $arr['region_code'] = $value['dirname'];
            array_push($result['data'], $arr);
        }
        exit(json_encode($result, JSON_UNESCAPED_UNICODE));
    }

    /** 
     * 接口文件，获取模型的所有字段
     * @param  id 模型ID
     * @return string
     */
    public function get_module_fields()
    {
        // 获取模型ID
        $id = dr_safe_replace(\Phpcmf\Service::L('input')->get('id'));
        if (!$id) {
            exit('参数不完整');
        }

        // 获取模型ID
        $rt = \Phpcmf\Service::M()->db->table("field")->select('*')->where('relatedid ='.$id)->get();
        if ($rt) {
            $rows = $rt->getResultArray();
        }

        // 过滤站点公共变量
        $array = [];
        foreach ($rows as $value){
            if($value['relatedname'] != 'site'){
                array_push($array,$value);
            }
        }
        if(!$array){
            exit("没有这个栏目");
        }
        
        exit(json_encode($array, JSON_UNESCAPED_UNICODE));
    }

    /** 
     * 接口文件，获取当前栏目信息
     * @param  modid 接收ID参数
     * @param pid 父栏目ID
     * @return string
     */
    public function get_category_info()
    {
        // 获取模型ID
        $modid = dr_safe_replace(\Phpcmf\Service::L('input')->get('modid'));
        if (!$modid) {
            exit('参数不完整');
        }
        // 获取栏目ID
        $id = dr_safe_replace(\Phpcmf\Service::L('input')->get('id'));
        if (!$id) {
            exit('参数不完整');
        }
        // 获取模型类型
        $rt1 = \Phpcmf\Service::M()->db->table("module")->select('id,dirname,share')->where('id', $modid)->get();
        if ($rt1) {
            $rows1 = $rt1->getResultArray();
            $rows1 = $rows1[0];
        }
        if ($rows1) {
            // 获取表格参数
            if ($rows1['share'] == '1') {
                $table = 'share';
            } else {
                $table = $rows1['dirname'];
            }
        }else{
            exit("模型名称不正确");
        }

        // 获取当前栏目信息
        $rt2 = \Phpcmf\Service::M()->db->table(SITE_ID . "_" . $table . "_category")->select('id,tid,pid,mid,pids,name,dirname')->where('id', $id)->get();
        if ($rt2) {
            $rows2 = $rt2->getResultArray();
        }

        if(!$rows2){
            exit("没有这个栏目");
        }
        
        exit(json_encode($rows2, JSON_UNESCAPED_UNICODE));
    }

    /** 
     * 接口文件，获取单条规则记录信息
     * @param  id 规则ID
     * @return Array
     */
    public function get_rule_by_id(){
        // 获取规则ID
        $id = dr_safe_replace(\Phpcmf\Service::L('input')->get('id'));
        if (!$id) {
            exit('参数不完整');
        }

        //获取接口文件标识码
		$rt = \Phpcmf\Service::M()->db->table("webcollector_rules")->select('*')->where("id", $id)->get();
		if ($rt) {
			$rows = $rt->getResultArray();
		}

        exit(json_encode($rows, JSON_UNESCAPED_UNICODE));
    }
}
