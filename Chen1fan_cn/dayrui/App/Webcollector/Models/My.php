<?php

namespace Phpcmf\Model\Webcollector; // Webcollector表示插件目录

class My extends \Phpcmf\Model
{

	// 这是插件的类模型方法 控制器调用方法是：
	// \Phpcmf\Service::M('my', 'webcollector')->test();
	// 'my' 表示文件名，'myapp'表示插件目录

	/** 
	 * 创建随机英文字符
	 * @param  length 字符长度
	 */
	public function createRandomStr($length)
	{
		$str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; //52个字符
		$strlen = 52;
		while ($length > $strlen) {
			$str .= $str;
			$strlen += 52;
		}
		$str = str_shuffle($str);
		return substr($str, 0, $length);
	}

	/** 
	 * @param  length 字符长度
	 */
	public function create_token()
	{
		$token = $this->createRandomStr(16);
		return $token;
	}

	/** 
	 * 获取当前token对应的规则内容
	 * @param  length 字符长度
	 * @return Array 
	 */
	public function get_present_rule($token)
	{
		//获取接口文件标识码
		$rt = \Phpcmf\Service::M()->db->table("webcollector_rules")->select('*')->where("token", $token)->get();
		if ($rt) {
			$rows = $rt->getResultArray();
			return $rows;
		}
	}

	/** 
	 * 根据模型ID获取所有模型相关字段
	 * @param  id 模型ID
	 * @return Array 
	 */
	public function get_module_fields($id)
	{
		//获取接口文件标识码
		$rt = \Phpcmf\Service::M()->db->table("field")->select('*')->where("relatedid", (int)$id)->where("relatedname", "module")->get();
		if ($rt) {
			$rows = $rt->getResultArray();
			return $rows;
		}
	}

	/** 
	 * 根据模型ID获取模型信息
	 * @param  id 模型ID
	 * @return Array 
	 */
	public function get_module_name($id)
	{
		$rt = \Phpcmf\Service::M()->db->table('module')->select('*')->where("id", $id)->get();
		$rows = $rt->getResultArray();
		$result = $rows;
		return $result;
	}


	/** 
	 * 自动下载远程文件并归档，暂时不使用存储策略
	 * @param  fileurl 文件链接，完整的远程文件地址。如：https://www.xxx.com/upload/filename.png
	 * @param id 存储策略编号
	 * @param txt 存储说明
	 * @return Array 返回数组：[code]归档后的编号，[info]归档后的文件参数；
	 */
	public function downfile($fileurl, $id, $txt)
	{
		$id = $id ? $id : 0;
		$txt = $txt ? $txt : '采集上传';
		$result = [];
		// 下载远程文件
		$rt = \Phpcmf\Service::L('upload')->down_file([
			'url' => $fileurl, //url必须是完整的远程文件地址
			'attachment' => \Phpcmf\Service::M('attachment')->get_attach_info($id),
			// 0值不属于存储策略，填写策略ID号表示附件存储策略，可以是远程存储，可以是本地存储，如果不用存储策略就填0，可以在后台系统>系统维护>存储策略处看到详细的存储策略
		]);
		if ($rt['code']) {
			// 上传成功
			$result['info'] = $rt['data']; //附件入库后的信息数据

			// 附件归档 可选
			$att = \Phpcmf\Service::M('attachment')->save_data($rt['data'], $txt);
			if ($att['code']) {
				// 归档成功
				$result['code'] =  $att['code'];
			}
		} else {
			// 下载失败 返回的错误
			$rt['msg'];
		}
		return $result;
	}

	/** 
	 * 检测是否为终极栏目
	 * @param  mid 模型ID
	 * @param cid 分类ID
	 * @return boolean TRUE/FALSE
	 */
	public function check_category($mid,$cid)
	{
		
        // 获取模型类型
        $rt1 = \Phpcmf\Service::M()->db->table("module")->select('id,dirname,share')->where('id', $mid)->get();
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
        }

        // 获取当前栏目信息
        $rt2 = \Phpcmf\Service::M()->db->table(SITE_ID . "_" . $table . "_category")->select('id,pid,pids,name,dirname,child')->where('id', $cid)->get();
        if ($rt2) {
            $rows2 = $rt2->getResultArray();
        }

        return $rows2[0];
	}
}
