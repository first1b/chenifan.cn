<?php
// 内容格式化函数
namespace Phpcmf\Model\Webcollector; // Webcollector表示插件目录

class Fields extends \Phpcmf\Model
{
    /** 
     * 入库前格式化数据
     * @param  type 数据字段
     * @return string 
     */
    public function format($type)
    {
        // 键值名->格式化时使用的函数（方法）名
        $array = array(
            'Text' => 'format_text',
            'Textarea' => 'format_textarea',
            'Editor' => 'format_editor',
            'Radio' => 'format_select',
            'Select' => 'format_select',
            'Selects' => 'format_select',
            'Checkbox' => 'format_select',
            'Date' => 'format_date',
            'Time' => 'format_time',
            'File' => 'format_file',
            'Files' => 'format_files',
            'Linkage' => 'format_linkage',
            'Linkages' => 'format_linkages',
            'Image' => 'format_image',
            'Ftable' => 'format_ftable',
        );
        $result = $array[$type];
        return $result;
    }

    /** 
     * 处理Text
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据 
     * @return string 
     */
    public function format_text($field, $data)
    {
        $data = trim($data);
        $data = dr_array2string($data);
        $data = trim($data, '"');
        return $data;
    }

    /** 
     * 处理Textarea
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据 
     * @return string
     */
    public function format_textarea($field, $data)
    {
        $data = trim($data);
        $data = dr_array2string($data);
        $data = trim($data, '"');
        return $data;
    }

    /** 
     * 处理Editor编辑器
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据 
     * @return string
     * 其中包含的图片应该为全路径，即可以复制到浏览器中地址栏直接访问的url
     */
    public function format_editor($field, $data)
    {
        $attachment = dr_string2array($field['setting'])['option']['attachment'];
        $attachment = $attachment ? $attachment : 0;
        $imgs = dr_get_content_img($data); //包含的图片url数组
        // 如果data中有图片要处理
        if (preg_match_all("/(src)=([\"|']?)([^ \"'>]+\.(gif|jpg|jpeg|png))\\2/i", $data, $imgs)) {
            // 遍历要处理的图片url地址
            foreach ($imgs[3] as $img) {
                // 如果包含指定的字符串，跳过剩下代码执行下一次循环；
                if (strpos($img, '/api/ueditor/') !== false || strpos($img, '/api/umeditor/') !== false) {
                    continue;
                }
                //检查是否以http开头
                if (strpos($img, 'http') === 0) {
                    // 判断域名白名单
                    $arr = parse_url($img);
                    $domain = $arr['host'];
                    // 如果域名存在
                    if ($domain) {
                        $sites = WRITEPATH . 'config/domain_site.php';
                        // 如果域名不在站点域名和附件白名单中,则下载
                        if (!isset($sites[$domain]) || strpos(SYS_UPLOAD_URL, $domain) == false) {
                            $zj = 0;
                            $remote = \Phpcmf\Service::C()->get_cache('attachment');
                            if ($remote) {
                                foreach ($remote as $t) {
                                    if (strpos($t['url'], $domain) !== false) {
                                        $zj = 1;
                                        break;
                                    }
                                }
                            }

                            if ($zj == 0) {
                                // 可以下载文件，同步模式，下载远程文件
                                $rt = \Phpcmf\Service::L('upload')->down_file([
                                    'url' => $img,
                                    'attachment' => \Phpcmf\Service::M('Attachment')->get_attach_info($attachment),
                                ]);
                                if ($rt['code']) {
                                    // 归档
                                    $att = \Phpcmf\Service::M('Attachment')->save_data($rt['data'], '采集上传');
                                    if ($att['code']) {
                                        // 归档成功
                                        $data = str_replace($img, $rt['data']['url'], $data);
                                        $img = $att['code'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $data;
    }

    /** 
     * 处理单选按钮Radio、下拉单选Select、下拉多选Select、及复选框Checkbox
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据；单选格式为："值";多选格式为："值1,值2,值3";
     * @return string
     */
    function format_select($field, $data)
    {
        $result = '';
        //移除两端空白字符串
        $data = $data ? trim($data) : '不显示';  //如果没有数据，则插入值为不显示时的值

        if ($field) {
            // 配置信息
            $setting = dr_string2array($field["setting"])["option"]["options"];
            $setting = explode("\r\n", $setting); //setting数组
            $type = strtolower(strval($field["fieldtype"]));  //radio单选；checkbox//多选
            $array = [];
            foreach ($setting as $value) {
                $value = explode("|", $value);
                array_push($array, $value);
            }
            unset($setting);

            if ($type == 'radio' || $type == 'select') { // 单选
                foreach ($array as $key => $value) {
                    if ($value[0] == $data) {
                        // 如果设置了对应的值
                        if ($array[$key][1]) {
                            $result = $array[$key][1];
                        } else {
                            $result = $array[$key][0];
                        }
                    }
                }
            } elseif ($type == 'selects' || $type == 'checkbox') { // 多选
                $data = explode(",", $data);
                $rs = [];
                foreach ($array as $key => $value) {
                    foreach ($data as $i => $val) {
                        if ($value[0] == $data[$i]) {
                            // 如果设置了对应的值
                            if ($array[$key][1]) {
                                array_push($rs, $array[$key][1]);
                            } else {
                                array_push($rs, $array[$key][0]);
                            }
                        }
                    }
                }
                $result = dr_array2string($rs);
            } else { //都不是[类型错误]
                $result == $result;
            }
        }
        return $result;
    }

    /** 
     * 格式化日期，返回时间戳;
     * 处理单选按钮Radio、下拉单选Select、下拉多选Select、及复选框Checkbox
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据；支持Y年m月d日；Y-m-d;Y-m-d h:m:s；等形式；
     * @return string
     */
    function format_date($field, $data)
    {
        $time = preg_replace('/[\x{4e00}-\x{9fa5}]/u', '-', $data);
        $time = trim($time, '-');
        $result = strtotime($time);

        return $result;
    }

    /** 
     * 格式化时间项;
     * 处理单选按钮Radio、下拉单选Select、下拉多选Select、及复选框Checkbox
     * @param  field 系统中指定字段的配置信息
     * @param data 传入的数据；Y-m-d h:m:s；h:m:s；或h:m等形式；
     * @return string 返回xx:xx 或xx:xx:xx格式
     */
    function format_time($field, $data)
    {
        $setting = dr_string2array($field["setting"])["option"]["format2"];
        $time = trim(strstr(trim($data), " "));
        $time = explode(':', $time);
        $count = count($time);

        // 时分格式
        if ($setting = 0) {
            $result = $time[0] . ':' . $time[1];
        }
        // 时分秒格式
        else {
            if ($count == 2) {
                $result = $time[0] . ':' . $time[1] . ':00';
            } else {
                $result = $time[0] . ':' . $time[1] . ':' . $time[2];
            }
        }

        return $result;
    }

    /** 
     * 格式化单文件;
     * @param  field 系统中指定字段的配置信息
     * @param data 为文件url地址（可访问）。格式为："值1";
     * @return string 返回xx:xx 或xx:xx:xx格式
     */
    function format_file($field, $data)
    {
        $id = dr_string2array($field["setting"])["option"]["attachment"];

        $data = $data ? trim($data) : '';
        if ($data) {
            $result = \Phpcmf\Service::M('my', 'webcollector')->downfile($data, $id, '采集上传')['code'];
            return $result;
        } else {
            $result = null;
        }
        return $result;
    }

    /** 
     * 格式化多文件;
     * @param  field 系统中指定字段的配置信息
     * @param data 为多个文件url地址（可访问）。多选格式为："值1,值2,值3";
     * @return string 返回xx:xx 或xx:xx:xx格式
     */
    function format_files($field, $data)
    {
        $id = dr_string2array($field["setting"])["option"]["attachment"];
        $id = $id ? $id : 0;

        $imgurls = $data ? explode(",", $data) : [];  //如果没有数据，则插入值为不显示时的值
        $result = [
            "file" => [],
            "title" => [],
            "description" => []
        ];
        foreach ($imgurls as $key => $value) {
            $imgurl = trim($imgurls[$key]);
            $imgArray = \Phpcmf\Service::M('my', 'webcollector')->downfile($imgurl, $id, '采集上传');
            array_push($result['file'], $imgArray['code']);
            array_push($result['title'], $imgArray['info']['name']);
            array_push($result['description'], '');
        };
        return dr_array2string($result);
    }


    /** 
     * 格式化单选联动菜单;
     * @param  field 系统中指定字段的配置信息
     * @param data 联动菜单的名称。如：青羊区；
     * @return string 返回xx:xx 或xx:xx:xx格式
     */
    function format_linkage($field, $data)
    {
        //所关联的联动菜单名称
        $code = dr_string2array($field["setting"])["option"]["linkage"];

        $data = trim($data);
        $rt = \Phpcmf\Service::M()->db->table('linkage')->select('id')->where("code", $code)->get();
        if ($rt) {
            $rows = $rt->getResultArray();
            $codeid = strval($rows[0]["id"]);
        }
        $rt = \Phpcmf\Service::M()->db->table('linkage_data_' . $codeid)->select('id')->where("name", $data)->get();
        if ($rt) {
            $rows = $rt->getResultArray();
            $result = strval($rows[0]["id"]);
        }

        return $result ? $result : NULL;
    }


    /** 
     * 格式化多选联动菜单;
     * @param  field 系统中指定字段的配置信息
     * @param data 联动菜单的名称。如：青羊区；
     * @return array 返回["1","2","3"]
     */
    function format_linkages($field, $data)
    {
        //所关联的联动菜单名称
        $code = dr_string2array($field["setting"])["option"]["linkage"];

        $data = explode(",", trim($data));

        //获取表格后缀名
        $rt = \Phpcmf\Service::M()->db->table('linkage')->select('id')->where("code", $code)->get();
        if ($rt) {
            $rows = $rt->getResultArray();
            $codeid = strval($rows[0]["id"]);
        }

        $result = [];
        foreach ($data as $key => $value) {
            $rs = \Phpcmf\Service::M()->db->table('linkage_data_' . $codeid)->select('id')->where("name", trim($value))->get();
            $rows = $rs->getResultArray();

            if (strval($rows[0]['id'])) {
                array_push($result, strval($rows[0]["id"]));
            }
        }

        $result = dr_array2string($result);

        return $result;
    }

    /** 
     * 格式化图片;
     * @param  field 系统中指定字段的配置信息
     * @param data 为多个文件url地址（可访问）。多选格式为："值1,值2,值3";
     * @return string 返回xx:xx 或xx:xx:xx格式
     */
    function format_image($field, $data)
    {
        $id = dr_string2array($field["setting"])["option"]["attachment"];
        $id = $id ? $id : 0;

        $imgurls = $data ? explode(",", $data) : [];  //如果没有数据，则插入值为不显示时的值
        $result = [];
        foreach ($imgurls as $key => $value) {
            $imgurl = trim($imgurls[$key]);
            $imgid = \Phpcmf\Service::M('my', 'webcollector')->downfile($imgurl, $id, '采集上传')['code'];
            array_push($result, $imgid);
        };
        return dr_array2string($result);
    }


    /** 
     * 格式化表格;
     * @param  field 系统中指定字段的配置信息
     * @param data data格式{"第1列":"第1列内容","第3列":["选项1|选项2"]};["1":"第二行第1列内容","2":"第二行第二列内容"]；
     * @return array 返回["1","2","3"]
     */
    function format_ftable($field, $data)
    {
        //所关联的联动菜单名称
        $setting = dr_string2array($field["setting"])["option"];
        $hang = $setting["hang"];  //首行数据
        $field = $setting["field"];  //列配置[共10个]
        $attachment = $setting["attachment"];  //存储策略
        $attachment = $attachment ? $attachment : 0;

        $lines = explode("##", $data);
        $lines = array_filter($lines);
        $result = array();

        foreach ($lines as $linekey => $line) {
            $items = explode("|", $line);
            $item_array = array();
            foreach ($items as $itemkey => $item) {
                $parts = explode('":', $item);
                // type说明：
                // 0:不使用；1：文本；2：下拉选项；3：文件；4：复选框；5：日期；6：日期带时间；
                $type = $field[$itemkey + 1]["type"];
                $key = preg_replace("/[^0-9]/", "", $parts[0]);
                if (count($parts) > 1) {
                    $parts[1] = trim($parts[1], '"[]}');
                    // 不使用，设为空
                    if ($type == '0' || !$type) {
                        $parts[1] = '';
                    }
                    // 复选框
                    if ($type == '4') {
                        $parts[1] = explode(',', $parts[1]);
                        $part1array = [];
                        foreach ($parts[1] as $v1) {
                            $v1 = trim($v1, '"');
                            array_push($part1array, $v1);
                        }
                        $parts[1] = $part1array;
                        $parts[1] = \dr_array2string($parts[1]);
                    }
                    // 文件
                    if ($type == '3') {
                        $parts[1] = \Phpcmf\Service::M('my', 'webcollector')->downfile($parts[1], $attachment, '采集上传')['code'];
                        $parts[1] = dr_array2string($parts[1]);
                    }
                    // 日期，可处理xxxx年xx月xx日
                    if ($type == '5') {
                        $parts[1] = preg_replace('/[\x{4e00}-\x{9fa5}]/u', '-', $parts[1]);
                        $parts[1] = trim($parts[1], '-');
                    }
                    // 日期带时间
                    if ($type == '6') {
                    }
                    $item_array[$key] = $parts[1];
                }
            }
            $result[$linekey + 1] = $item_array;
        }
        $result = json_encode($result, JSON_UNESCAPED_UNICODE);
        $result = trim($result, '[]');
        $result = str_replace('\"', '"', $result);
        $result = str_replace('"["', '["', $result);
        $result = str_replace('"]"', ']"', $result);
        return $result;
    }
}
