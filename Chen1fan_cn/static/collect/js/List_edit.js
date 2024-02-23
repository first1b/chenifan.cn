/***
 * 2020-1-14
 * 新增功能
 *
 *    采集，JSON模式   引用layui.js  展示字段 用树形图结构。
 *
 *     页面html 已定义layUI 树形插件
 *	   var LayuiTree = layui.tree;
 *
 *     此文件js LayuiTree 引用 渲染树形图
 *
 * */

 //**************添加测试规则 按钮**************
 /**
  * @date 2021-05-18 星期二 11:18  晴天
  * */
  function testrulesFunc(){
      $('#testrules_Modal').modal('show');

  }



//--------------------------------面板的收起展开全局监听-------------------------------------

    $("body").on("click", ".portlet > .portlet-title > .tools .collapse",function(){

           if( $(this).hasClass('rotate180') ){

                $(this).removeClass('rotate180');

            }else{
                $(this).addClass('rotate180');
            }

           let tarGet = $(this).parent().parent().parent();

           tarGet.find('.portlet-body').slideToggle("fast");
     });

//--------------------------------------从RUL地址中获取Id，ajax请求当前页面的数据----------------------------------------
/**
 * @desc 获取当前页面URL的信息，提取出编辑id
 *
 * */
 function getCode() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
      arr.forEach((item) => {
        let tempArr = item.substring(1).split('=');
        let key = decodeURIComponent(tempArr[0]);
        let val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
  }
  return obj;
}

    //获取当前的页面信息
    function AJaxPageData(){
            let getPage = getCode();

            let loading = layer.load(2, {
                shade: [0.8, '#fff'],
                content:'加载数据中...',
                success: function (layerContentStyle) { // 设置loading样式
                    layerContentStyle.find('.layui-layer-content').css({
                        'padding-left': '45px',
                        'text-align': 'left',
                        'width': '175px',
                        'line-height':'30px'
                    });
                }
            });

            $.ajax({
                type: "POST",
                dataType:"json",
                url:'/' + SELF + "?s=puyicaiji&c=home&m=fieldQuery",
           		data: {[csrf_token]:csrf_hash,'id':getPage.id},
           		// async:false,
                success: function(res) {

                	if(res.code){
    	            	 let data = res.data;

    	            	 renderBasic(data);
    	            	 let run_method = JSON.parse( data.run_method );

    	            	 GetBasicData(run_method); //基本设置 Basic 模块
                         handle_UnifyrenderMethodsData(run_method);//渲染内容获取模块==>“统一数据处理”
                         rendererContentGet(run_method);//渲染字段列表
                         GetPostMOdelData(run_method); //POST模式模块
                         GetPagesetData(run_method);//分页设置模块
                         renderImport(run_method); //入库设置 渲染数据 这个依赖于 字段列表 也就是说 他要在需要在字段列表渲染后 所以我把他放在最后面

                	}else{

                	    layer.alert(res.msg,{icon:2,title:'提示'});
                	}

                    layer.close(loading);

                },
                error: function(HttpRequest, ajaxOptions, thrownError){
                     layer.close(loading);
                    layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
                }

    		});

    }

    //请求3
    AJaxPageData();

    function reloadConnectionCmsDb() {
        $('#cms_type').attr('value', 6);
        $('#cms_path').val($('#cms_path_value').val());
        connectionCmsDb();
    }

    //加载这个方法是应对 用户【编辑采集】之后没有点【入库设置】就直接报错 就会重置当前选项导致采集异常
    reloadConnectionCmsDb();

    /**
     * @desc 入库设置 数据渲染
     * 编辑就是查找自己的方案 然后让之前写好的程序自动渲染
     */
    function renderImport(plan) {

        if(plan.build.import_type == 1){
            // 本地入库
            setLocalPlan(plan);
        }else{

            //本地cms入库和远程入库都走这个方法
            setPlanData(plan);

        }
    }

   /**
    * @desc 编辑赋值， "基本设置"==>入库模式的选中。
    *
    */
    function renderBasic(_data){
        if(_data && _data.scheme_id){
            $(`[name='data[scheme_id]']`).val(_data.scheme_id);
            pageDatainit();
        }
    }

   function rendererContentGet(_data){

       //字段表格数据处理
       if( !_data.ContentGet || !_data.ContentGet.fieldlist_Table){
           return
       }

       let fieldlist_Table = _data.ContentGet.fieldlist_Table;

       /**
        *
        * @description 渲染内容获取模块， 字段列表表格渲染。
        *
        * */
        let Tr_node = "";
            fieldlist_Table.forEach( (item,index)=>{
                    Tr_node+=`<tr class="odd gradeX">
                                  <td style="text-align:center">
                                     <input type="text" name="data[run_method][ContentGet][fieldlist_Table][${index}][sort]" value="${item.sort ? item.sort : 0}" class="displayorder form-control input-sm input-inline input-mini"> 
                                     </td>
                                    <td class="fieldName"> 
                                        <a href="javascript:void(0)" class="fieldname" title="点击编辑字段"> ${item.field_name ? item.field_name: ''} </a>  
                                        <input type="hidden" class="field-name-input" name="data[run_method][ContentGet][fieldlist_Table][${index}][field_name]" value="${item.field_name ? item.field_name: ''}">
                                    </td>
                                    <td class="data_origin">
                                          <span>${item.dataorigin_text}</span>
                                          <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][dataorigin_text]" value="${item.dataorigin_text ? item.dataorigin_text :''}">
                                          <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][data_origin]" value="${item.data_origin}">
                                    </td>
                                    <td class="getType"> 
                                        <span>${item.get_type}</span>
                                         <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][get_type]" value="${item.get_type ? item.get_type :''}">
                                         <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][get_typevalue]" value="${item.get_typevalue ? item.get_typevalue :''}">
            						</td>
                                    <td class="other" style="overflow:visible">
                                         <label><a href="javascript:void(0)" onclick="DataDispose(this,'${item.field_name}',${index})" class="btn btn-xs green"><i class="fa fa-paper-plane"></i> 数据处理</a></label>
                                         <label><a href="javascript:void(0)" onclick="edit_field(this,${index})" class="btn btn-xs blue" title="点击编辑字段">编辑字段</a></label>
                                         <label><a href="javascript:void(0)" onclick="delete_fieldTr(this,${index})" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a></label>
                                        
                                        <!--隐藏域存储数据 1.规则 2.拼接成最终内容 3.标题排重 --> 
                                        <input id="rule" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][rule]" value="${item.rule ? item.rule :''}">
                                        <input id="finally_joint" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][finally_joint]" value="${item.finally_joint ? item.finally_joint :''}">
                                        <input id="title_deleteAgain" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][title_deleteAgain]" value="${item.title_deleteAgain}">
                                        <input id="loop_get" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][loop_get]" value="${item.loop_get? item.loop_get:0}">
                                        <input class="remove-html-input" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][remove_html]" value="${item.remove_html ? item.remove_html : 0}">
                                        <input id="pseudo_original" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][pseudo_original]" value="${item.pseudo_original ? item.pseudo_original : 0}">
                                         <!--隐藏域存储数据 存储 数据处理方法 -->
                                        <div class="datadispose-box">${handle_datadispose(item.datadispose,index)}</div>
  
                                   </td>
                            </tr>`;
            });

    //渲染表格
    $(".contentGet-box .field-table .table tbody").html(Tr_node);


  }

 /**
  * @desc 编辑的情况，渲染出 数据处理方法，把数据数据存储在 隐藏域，点击数据处理的时候，把编辑的数据呈现到数据处理弹框（曲线救国）
  *
  * @param  {Object}  _data       数据处理方法的集合
  * @param  {Number}  _index      表格数据
  * @return {DOM}     inputNode   生成隐藏域节点 存储数据
  *
  * */
  function handle_datadispose(_data,_index){
        let inputNode = "";
        if(_data && typeof _data == 'object'){

            //枚举的_data 属性
            Object.getOwnPropertyNames(_data).forEach((key) => {

                for(let childKey in _data[key] ){

                    inputNode += `<input data-type="${key}" class="data[run_method][ContentGet][fieldlist_Table][${_index}][datadispose][${key}][${childKey}]" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${_index}][datadispose][${key}][${childKey}]" value="${_data[key][childKey]}">`
                }

            });
        }

        return inputNode;
  }

  /**
   * @desc 编辑状态下，            “内容模块”==>"统一数据处理" 方法渲染
   * @param {Object} _data         获取回来的 “统一数据处理”数据
   * @param {string} elementNode   用于渲染的字符串节点
   * @param {Array}  UnifyProcessMethods_Val_stateArr  状态的数组;用于判断是否重复添加方法。
   * */
  function handle_UnifyrenderMethodsData(_data){

        UnifyProcessMethods_Val_stateArr = [];
        if( _data.ContentGet && _data.ContentGet.unify_datadispose && typeof _data.ContentGet.unify_datadispose == 'object'){
                let dataObj = _data.ContentGet.unify_datadispose;
                //枚举的dataObj 属性
                Object.getOwnPropertyNames(dataObj).forEach((key) => {

                    UnifyProcessMethods_Val_stateArr.push(key); //状态的数组.告知有几条数据处理方法。
                    UnifyrenderMethods(key); //根据数据处理key 渲染出对应的方法DOM节点。

                    for(let childKey in dataObj[key] ){
                        $('.Data-dispose .Addmethods-content').find(`[name='data[run_method][ContentGet][unify_datadispose][${key}][${childKey}]']`).val( dataObj[key][childKey] );//渲染赋值相应控件。
                    }

                });

        }


    /**
     *
     * @desc html内容截取的赋值
     * @Date 2021-06-16 星期三  晴
     * */
    if( _data.ContentGet && _data.ContentGet.htmlcontent_split && typeof _data.ContentGet.htmlcontent_split == 'object'){
            let htmlcontent_split_OBJ = _data.ContentGet.htmlcontent_split;

            $(`[name='data[run_method][ContentGet][htmlcontent_split][regionrule_select]']`).val( htmlcontent_split_OBJ.regionrule_select );//赋值 html内容截取 规则select控件
            $(`[name='data[run_method][ContentGet][htmlcontent_split][value]']`).val( htmlcontent_split_OBJ.value); //赋值 html内容截取
    }
    /**
     * @desc 编辑赋值 循环采集
     *
     * @deta 2021-04-19 星期一 17:38   雨
     * */
    if( _data.ContentGet && _data.ContentGet.reuseget_table instanceof Array &&  _data.ContentGet.reuseget_table.length > 0){

        //判断是不是存在空数据的提示，把空数据删除.
            let table_tbody = $('.reuseGet-content .table tbody');
            if( table_tbody.find('tr').hasClass('no-data') ){
                table_tbody.html(``);
            }

            let reuseget_table = _data.ContentGet.reuseget_table;
            let Elemenet = "";
            reuseget_table.forEach( (item,index)=>{

                Elemenet +=`
                    <tr> 
                        <td> 第${index+1}级</td>
                        <td>${item.multname_input}</td>
                        <td> 
                            <a href="javascript:void(0)" onclick="edit_reuseGetTr(this,${index})" class="btn btn-xs blue" title="点击编辑">编辑</a>
                            <a href="javascript:void(0)" onclick="delete_reuseGetTr(this,${index})" class="btn btn-xs red"><i class="fa fa-trash"></i>删除</a>
                            <div class="modal-data">
                                <input id="multname_input" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][multname_input]" value="${item.multname_input}">
                                <input id="networkarea_select" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][networkarea_select]" value="${item.networkarea_select}">
                                <input id="networkarea_textarea" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][networkarea_textarea]" value="${item.networkarea_textarea}">
                                <input id="urlrules_select" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][urlrules_select]" value="${item.urlrules_select}">
                                <input id="urlrules_textarea" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][urlrules_textarea]" value="${item.urlrules_textarea}">
                                <input id="finalurl" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][finalurl]" value="${item.finalurl}">
                                <input id="mustcontain_input" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][mustcontain_input]" value="${item.mustcontain_input}">
                                <input id="notcontain_input" type="hidden" name="data[run_method][ContentGet][reuseget_table][${index}][notcontain_input]" value="${item.notcontain_input}">
                            </div>
                        </td>
                    </tr> `;
            });


            $('.reuseGet-content table tbody').append(Elemenet);
    }


  }

  /**
   * @desc 编辑状态下，“内容模块”==>"内容分页"content_page 的赋值
   * @param {Object} _data 获取回来的 “内容分页”数据
   *
   * */
   function handle_RenderContent_pageData(_data){

        if( _data.ContentGet && _data.ContentGet.content_page && typeof _data.ContentGet.content_page == 'object'){
            let dataObj = _data.ContentGet.content_page;
            $('.contentGet-box #contentPage').bootstrapSwitch();//初始化内容分页开关;
            $('.paging-field-content').html('');

                if( Number(dataObj.is_page) ){
                    $('.contentGet-box #contentPage').bootstrapSwitch('state',true);
                }else{
                    $('.contentGet-box #contentPage').bootstrapSwitch('state',false);
                }

            //遍历数据，渲染数据。
            Object.getOwnPropertyNames(dataObj).forEach((key) =>{

                        if( key !== 'is_page'){
                            switch (key){
                                case 'field_name': //内容分页的字段的渲染
                                    let element = "";
                                    dataObj[key].forEach( (item,index)=>{
                                            element += `
                                                 <span class="label label-primary" title="点击可进行删除" onclick="DelPageContentField(this)">${item}
                                                     <input type="hidden" name="data[run_method][ContentGet][content_page][field_name][${index}]" value="${item}">
                                                </span> `;
                                    });

                                     $('.paging-field-content').html(element);
                                    break;

                                default:
                                    // 默认
                                     $('.content-page').find(`[name='data[run_method][ContentGet][content_page][${key}]']`).val( dataObj[key]);
                            }
                        }
            });

        }
   }

/**
 *
 * @desc 编辑赋值 "基本设置" Basic 模块的赋值。
 * @Date 2021-03-31 晴 晚上
 *
 *
 * */
 function GetBasicData(_data){

      if(_data.Basic){
          let BasicObj = _data.Basic;

          /**
           * @赋值 采集任务名称
           *
           * */
           $(`[name='data[run_method][name]']`).val(_data.name);

          /**
           * @赋值 运行开关
           *
           * */
               if( Number(BasicObj.operation_switch) ){
                   $(`[name='data[run_method][Basic][operation_switch]']`).bootstrapSwitch('state',true);
                    $(`[name='data[run_method][Basic][operation_switch]']`).parents('.form-group').find('.control-label').text('运行');

               }else{
                   $(`[name='data[run_method][Basic][operation_switch]']`).bootstrapSwitch('state',false);
                    $(`[name='data[run_method][Basic][operation_switch]']`).parents('.form-group').find('.control-label').text('停止');

               }


           /**
            * @赋值 页面缓存
            *
            * */
                if( BasicObj.html_cache && Number(BasicObj.html_cache.switch) ){
                   $(`[name='data[run_method][Basic][html_cache][switch]']`).bootstrapSwitch('state',true);
               }else{
                   $(`[name='data[run_method][Basic][html_cache][switch]']`).bootstrapSwitch('state',false);
               }
               //判断 页面存储 多少秒 是否存在 , 赋值时间，秒数。
                  if( BasicObj.html_cache && BasicObj.html_cache.time ){
                      $(`[name='data[run_method][Basic][html_cache][time]']`).val(BasicObj.html_cache.time);
                  }

           /**
            * @desc 赋值 编码转换
            *  赋值 select控件
            * */
               if( BasicObj.encode_transform ){
                   $(`[name='data[run_method][Basic][encode_transform]']`).val(BasicObj.encode_transform);
               }


             //自定义编码的赋值
               if( BasicObj.encode_transform_customencode ){
                       $('.basic-componentBox .encode_custom-box').html(`
                             <input style="display:inline-block;width:180px!important;" class="form-control input-large" type="text" name="data[run_method][Basic][encode_transform_customencode]" placeholder="请输入自定义编码" value="${BasicObj.encode_transform_customencode}">
                        `);

                    $(`[name='data[run_method][Basic][encode_transform_customencode]']`).val(BasicObj.encode_transform_customencode);
               }

            /**
             * @desc 赋值 *采集内核
             *
             * */
               if( BasicObj.run_kernel ){
                   $(`[name='data[run_method][Basic][run_kernel]']`).val(BasicObj.run_kernel);
               }

           /**
            * @desc 赋值 入库模式
            *  type，select控件
            * */
              if(  BasicObj.scheme_id ){
                   $(`[name='data[run_method][Basic][scheme_id]']`).val(BasicObj.scheme_id);
              }else{
                   $(`[name='data[run_method][Basic][scheme_id]']`).val('');
              }

            //赋值 *采集目标URL
             if( BasicObj.list_url ){
                  $(`[name='data[run_method][Basic][list_url]']`).val(BasicObj.list_url);
             }

            //赋值 *初始页区域获取
             if( BasicObj.list_rule ){

                  //$(`[name='data[run_method][Basic][list_rule][region_rule]']`).val(BasicObj.list_rule.region_rule);
                  //$(`[name='data[run_method][Basic][list_rule][url_content_rule]']`).val(BasicObj.list_rule.url_content_rule);

                  let list_ruleObj = BasicObj.list_rule;

                  for(let key in list_ruleObj ){
                      $(`[name='data[run_method][Basic][list_rule][${key}]']`).val( list_ruleObj[key] )
                  }

             }

             //赋值 *地址超时
             if( BasicObj.url_timeout ){
                 $(`[name='data[run_method][Basic][url_timeout]']`).val(BasicObj.url_timeout);
             }

              //赋值 *地址超时
             if( Number(BasicObj.auto_geturl_switch) ){
                  $(`[name='data[run_method][Basic][auto_geturl_switch]']`).bootstrapSwitch('state',true);
             }else{
                  $(`[name='data[run_method][Basic][auto_geturl_switch]']`).bootstrapSwitch('state',false);
             }

      }

 }

 /**
  * @desc 编辑赋值 "分页设置" 模块赋值
  * @Date 2021-04-01 星期四 晴 早上
  *
  * */

  function GetPagesetData(_data){
      if( _data.PageSet){

          let PageSetOBJ = _data.PageSet;
            //赋值 *列表分页采集开关
            if( Number(PageSetOBJ.caiji_list_rule_open) ){
                $(`[name='data[run_method][PageSet][caiji_list_rule_open]']`).bootstrapSwitch('state',true);
            }else{
                $(`[name='data[run_method][PageSet][caiji_list_rule_open]']`).bootstrapSwitch('state',false);
            }

            //赋值 *列表分页
            if( PageSetOBJ.list_page_rule ){
                 $(`[name='data[run_method][PageSet][list_page_rule]']`).val(PageSetOBJ.list_page_rule);

            }

            //赋值 *内容分页
            if( PageSetOBJ.body_rule ){
                 $(`[name='data[run_method][PageSet][body_rule]']`).val(PageSetOBJ.body_rule);
            }

            //赋值 *内容分页html区间
            if( PageSetOBJ.body_rule_section ){
                 $(`[name='data[run_method][PageSet][body_rule_section]']`).val(PageSetOBJ.body_rule_section);
            }


        //赋值 *内容分页的内容项
            if( Number(PageSetOBJ.caiji_body_rule_open ) ){
                 $(`[name='data[run_method][PageSet][caiji_body_rule_open]']`).bootstrapSwitch('state',true);

                    $('.pageSet-component #body_html').html(`
                              <div class="form-group">
                                        <label class="col-md-2 control-label">内容分页</label>
                                        <div class="col-md-9">
                                               <div class="content-page-on">
                                                  ${contentpageMain_template}
                                              </div>
                                        </div>
                               </div>
                     `);

                    //列表分页赋值
                     if(  PageSetOBJ.list_page && typeof PageSetOBJ.list_page == 'object'){

                         let dataObj = PageSetOBJ.list_page;
                         $('.listPage_field-content').html('');


                         //倒序
                            if(dataObj['maxpage_number_desc']){
                                 $(`[name='data[run_method][PageSet][list_page][maxpage_number_desc]']`).prop("checked",true);
                            }else{
                                $(`[name='data[run_method][PageSet][list_page][maxpage_number_desc]']`).prop("checked",false);
                            }


                         //遍历数据，渲染数据。
                            Object.getOwnPropertyNames(dataObj).forEach((key) =>{
                                        switch (key){
                                            case 'field_name': //内容分页的字段的渲染
                                                let element = "";
                                                dataObj[key].forEach( (item,index)=>{
                                                        element += `
                                                             <span class="label label-primary" title="点击可进行删除" onclick="DelPageContentField(this)">${item}
                                                                 <input type="hidden" name="data[run_method][PageSet][list_page][field_name][${index}]" value="${item}">
                                                            </span> `;
                                                });

                                                 $('.listPage_field-content').html(element);
                                                break;
                                            default:
                                                // 默认
                                                $('.pageSet-component .content-page-on').find(`[name='data[run_method][PageSet][list_page][${key}]']`).val(dataObj[key]);
                                        }
                            });

                     }else{

                          $(`[name='data[run_method][PageSet][caiji_list_rule_open]']`).bootstrapSwitch('state',false);
                     }


                    //内容分页赋值。
                    if(  PageSetOBJ.content_page && typeof PageSetOBJ.content_page == 'object'){

                            let dataObj = PageSetOBJ.content_page;

                            $('.paging-field-content').html('');


                            //倒序
                            if(dataObj['maxpage_number_desc']){
                                 $(`[name='data[run_method][PageSet][content_page][maxpage_number_desc]']`).prop("checked",true);
                            }else{
                                $(`[name='data[run_method][PageSet][content_page][maxpage_number_desc]']`).prop("checked",false);
                            }

                            //遍历数据，渲染数据。
                            Object.getOwnPropertyNames(dataObj).forEach((key) =>{
                                            switch (key){
                                                case 'field_name': //内容分页的字段的渲染
                                                    let element = "";
                                                    dataObj[key].forEach( (item,index)=>{
                                                            element += `
                                                                 <span class="label label-primary" title="点击可进行删除" onclick="DelPageContentField(this)">${item}
                                                                     <input type="hidden" name="data[run_method][PageSet][content_page][field_name][${index}]" value="${item}">
                                                                </span> `;
                                                    });

                                                     $('.paging-field-content').html(element);
                                                    break;
                                                default:
                                                    // 默认
                                                    $('.pageSet-component .content-page-on').find(`[name='data[run_method][PageSet][content_page][${key}]']`).val( dataObj[key]);
                                            }
                            });


                    }

                }else{
                      $(`[name='data[run_method][PageSet][caiji_body_rule_open]']`).bootstrapSwitch('state',false);

                }




      }

      GetSeoData(_data);
  }

 /**
  * @desc 编辑赋值 "seo功能" 模块赋值
  * @Date 2021-04-01 星期四 晴 早上
  *
  * 响应回来的数据：
  *   aotu_link: "1"
  *   caiji_author_diy: "1"
  *   caiji_author_name: "作者固定名称"
  *   caiji_author_randt: "1"
  *   caiji_ts_open: "1"
  *   dianji: "1"
  *   fakeOriginal_option: {API_selectOption: ""}
  *   img_alt: "1"
  *   pseudo_original: "1"
  *
  * */
  function GetSeoData(_data){
        if( _data.Seo ){
           let SeoOBJ = _data.Seo;

           //作者固定名称
           if( SeoOBJ.caiji_author_name ){
               $(`[name='data[run_method][Seo][caiji_author_name]']`).val(SeoOBJ.caiji_author_name);
           }
           //伪原创开启选项 单选框
           if( SeoOBJ.fakeOriginal_option ){
               let fakeOriginal = SeoOBJ.fakeOriginal_option;
               if( fakeOriginal.radio_val){
                    $(`#fakeOriginal-option  input:radio[value='${fakeOriginal.radio_val}']`).attr('checked','true');
               }

               //使用API  select的选中
               if( fakeOriginal.api_selectOption  ){

                    $('#API-selectOption').html(
                        `<select class="form-control" id="storage-column" name="data[run_method][Seo][fakeOriginal_option][api_selectOption]">
                                <option selected="" value="">请选择API类型</option>
                                <option value="1"> API类型1</option>
                                <option value="2"> API类型2</option>
                                <option value="3"> API类型3</option>
                            </select>`);

                    $('#API-selectOption [name="data[run_method][Seo][fakeOriginal_option][api_selectOption]"]').val(fakeOriginal.api_selectOption );

                }else{
                     $('#API-selectOption').empty();
                }

           }

        }

        GetHeaderData(_data);
  }



 /**
  * @desc 编辑赋值 "header" 模块赋值
  * @Date 2021-04-01 星期四 晴 下午
  *
  * */
  function GetHeaderData(_data){

       if( _data.Header ){

           let HeaderObj = _data.Header;

              //赋值 *User-Agent  select控件
              if( HeaderObj.headers_useragent_select ){
                  $(`[name='data[run_method][Header][headers_useragent_select]']`).val(HeaderObj.headers_useragent_select);

                   /**
                    * @desc 渲染 提示语
                    * */
                    if( HeaderObj.headers_useragent_select !== '4'){
                        $('.Headers-box .help-block').text(`如果选择内置 UA 请不要在下面添加 UA头，否则会自动覆盖`);
                    }else{
                         $('.Headers-box .help-block').text(`请在下面添加自己定义`);
                    }

                    //如果select选中了 自选内置值。
                    if( HeaderObj.headers_useragent_select == '2'){

                            let resData = ajaxbuiltInData();

                            UserAgentData = resData;

                            let element = '';
                            let TempnewArr = [];

                            for(let i=0; i<resData.length;i++){

                                let item = resData[i];

                                element +=`<option value="${item.name}">${item.name}</option>`;

                                if( item.name == HeaderObj.headers_useragent_browser ){
                                      TempnewArr = item.child;
                                }

                            }

                            let render_select_html =renderSelect(TempnewArr);
                            let render_finally_select =renderFinallySelect(TempnewArr,HeaderObj);

                            $('.UserAgent-content').html(`
                                 <select class="form-control" name="data[run_method][Header][headers_useragent_browser]" id="UserAgent-builtIn_select" onchange="select_builtIn_onchange(this)" style="width:120px;">
                                        ${ element }                         
                                 </select>
                                 
                                <select class="form-control" name="data[run_method][Header][headers_useragent_browser_system]" id="UserAgent-select_value" onchange="select_result(this)" style="width:120px;">
                                    ${render_select_html}                             
                                </select>
                                 <select class="form-control" name="data[run_method][Header][headers_useragent_browser_system_val]" id="UserAgent-finally_value" onchange="" style="width:900px;">
                                    ${render_finally_select}
                                </select>
                            `);

                           //渲染 select的数据
                           function renderSelect(TempnewArr){
                               let selectHmtl = "";
                               TempnewArr.forEach( (item,index)=>{
                                   selectHmtl +=`<option value="${item.name}">${item.name}</option>`;
                               });

                               return selectHmtl;
                           }

                            //渲染最后一个select数据
                            function renderFinallySelect(TempnewArr,HeaderObj){
                                let selectHmtl = "";
                                for(let i =0; i<TempnewArr.length; i++){
                                     let item = TempnewArr[i];
                                     if(  item.name == HeaderObj.headers_useragent_browser_system && item.value && item.value instanceof Array && item.value.length > 0 ){

                                          for(let j=0; j<item.value.length; j++){
                                              let itemChild = item.value[j];
                                              selectHmtl +=`<option value="${j}">${itemChild}</option>`;
                                          }

                                     }

                                }
                                return  selectHmtl;
                            }

                            // 上面的内容是先把DOM节点渲染出来，再赋值。
                            /**
                             * 自选内置 的内容赋值，数据模型如下：
                             *   headers_useragent_browser: "Safari"
                             *   headers_useragent_browser_system: "Windows"
                             *   headers_useragent_browser_system_val: "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML,
                             *
                             * */
                            $(`[name='data[run_method][Header][headers_useragent_browser]']`).val( HeaderObj.headers_useragent_browser ? HeaderObj.headers_useragent_browser : '');
                            $(`[name='data[run_method][Header][headers_useragent_browser_system]']`).val( HeaderObj.headers_useragent_browser_system ? HeaderObj.headers_useragent_browser_system :'');
                            $('#UserAgent-finally_value').val(HeaderObj.headers_useragent_browser_system_val);
                   }

                    //如果select选中了 “自定义选项”
                    if( HeaderObj.headers_useragent_select == '4'){
                        $('.UserAgent-content #UserAgent-builtIn_select').hide();
                        $('.UserAgent-content #UserAgent-select_value').hide();

                         // 2020-04-06 业务改动，去掉自定义的输入框。
                        /*$('.addCustom-input').html(`
                             <input class="form-control input-large" name="data[run_method][Header][headers_useragent_custominput]" id="UserAgent-input" style="width:450px!important;" placeholder="请输入自定义User-Agent" type="text" value="">
                        `);

                        $(`[name='data[run_method][Header][headers_useragent_custominput]']`).val( HeaderObj.headers_useragent_custominput ? HeaderObj.headers_useragent_custominput : '');*/
                   }

                    //编辑 添加项  Request Headers
                    if( HeaderObj.request_headers){
                        let request_headersAObj = HeaderObj.request_headers;

                        for(let key in request_headersAObj){
                                $('#header_postset_select option').each((index,item)=>{
                                    if( $(item).val() == key){
                                        header_renderTable(request_headersAObj[key], key, $(item).text());//赋值 模式
                                        return false;
                                    }
                                });
                        }

                  }

                    //渲染出表格
                     /**
                      * @param {Array}   _data  模式的数组
                      * @param {string}  _value  key值
                      * @param {string}  _text  文字
                      * */
                      function header_renderTable(_data,_value,_text){
                        if( _data  && _data instanceof Array && _data.length > 0 ){
                            let node_element = `
                                        <div class="form-group">
                                            <label class="col-md-2 control-label"></label>
                                            <div class="col-md-9 Headers-item">
                                                <div class="portlet box item-border_line_${_value}">
                                                    <div class="portlet-title Modeltip-box">
                                                        <div class="caption">
                                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;" class="title">${_text+'模式'}</font></font>
                                                            <button type="button" class="btn green btn-sm" onclick="header_addTableItem(this,'${_value}')"><i class="fa fa-plus"></i>添加${_text+'模式'}内容</button>
                                                        </div>
                                                        <div class="tools">
                                                             <button type="button" onclick="header_delete_Model(this)" class="btn btn-sm red"><i class="fa fa-trash"></i>删除${_text+'模式'}</button>
                                                             <a href="javascript:;" class="collapse" data-original-title="收起隐藏"></a>
                                                        </div>
                                                    </div>
                                                    <div class="portlet-body" style="display: block;">
                                                            <table class="table table-striped table-bordered table-hover table-checkable dataTable">
                                                                <thead>
                                                                    <tr class="heading">
                                                                        <th width="80" style="text-align:center">序号</th>
                                                                        <th width="120" style="text-align:center">名称</th>
                                                                        <th width="120" style="text-align:center">值</th>
                                                                        <th width="120" style="text-align:center">操作</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    ${header_applyData(_data,_value)}
                                                                </tbody>
                                                            </table>     
                                                    </div>
                                                </div>
                                            </div>    
                                         </div>`;
                             $('.Headers-box .Headers-Content').append(node_element);

                            //把数组的数据渲染。返回节点
                            function header_applyData(_data,_value){
                                 let node_tr = ``;
                                   _data.forEach( (item,index)=>{
                                           node_tr += `<tr class="odd gradeX">
                                                        <td> 
                                                             <span>${index+1}<span>
                                                        </td>
                                                         <td> 
                                                            <input style="display:inline-block;" class="form-control" type="text" name="data[run_method][Header][request_headers][${_value}][${index}][name]" value="${item.name}">
                                                        </td>
                                                         <td> 
                                                             <input style="display:inline-block;" class="form-control" type="text" name="data[run_method][Header][request_headers][${_value}][${index}][value]" value="${item.value}">
                                                        </td>
                                                         <td> 
                                                           <button type="button" onclick="header_delete_TableTr(this)" class="btn btn-xs red"><i class="fa fa-trash"></i>删除</button>
                                                        </td>
                                                </tr> `;
                                   });

                                return node_tr;
                            }

                    }
                      }

            }
       }
  }

 /**
  * @desc 编辑赋值 "POST"模式 模块的赋值。
  * @Date 2021-03-31 晴 晚上
  *
  * */
 function GetPostMOdelData(_data){

    if(_data.POST){
        let PostModelOBJ = _data.POST;

        //赋值 *开启POST渲染
        if( PostModelOBJ.operation_switch && Number(PostModelOBJ.operation_switch) ){
            $(`[name='data[run_method][POST][operation_switch]']`).bootstrapSwitch('state',true);
        }else{
            $(`[name='data[run_method][POST][operation_switch]']`).bootstrapSwitch('state',false);
        }

        for(let key in PostModelOBJ){
                $('#postset_select option').each((index,item)=>{
                    if( $(item).val() == key){
                        renderTable(PostModelOBJ[key], key, $(item).text());//赋值 模式
                        return false;
                    }
                });
        }

    }
     //渲染出表格
     /**
      * @param {Array}      _data  模式的数组
      * @param {string}     _value  key值
      * @param {string}     _text  文字
      * */
     function renderTable(_data,_value,_text){

        if( _data  && _data instanceof Array && _data.length > 0 ){
            let node_element = `
                       <div class="form-group">
                            <label class="col-md-2 control-label"></label>
                            <div class="col-md-9 POSTItem-item">
                                <div class="portlet box item-border_line_${_value}">
                                    <div class="portlet-title Modeltip-box">
                                        <div class="caption">
                                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;" class="title">${_text+'模式'}</font></font>
                                            <button type="button" class="btn green btn-sm" onclick="addTableItem(this,'${_value}')"><i class="fa fa-plus"></i>添加${_text+'模式'}内容</button>
                                        </div>
                                        <div class="tools">
                                             <button type="button" onclick="delete_Model(this)" class="btn btn-sm red"><i class="fa fa-trash"></i>删除${_text+'模式'}</button>
                                             <a href="javascript:;" class="collapse" data-original-title="收起隐藏"></a>
                                        </div>
                                    </div>
                                    <div class="portlet-body" style="display: block;">
                                            <table class="table table-striped table-bordered table-hover table-checkable dataTable">
                                                <thead>
                                                    <tr class="heading">
                                                        <th width="80" style="text-align:center">序号</th>
                                                        <th width="120" style="text-align:center">名称</th>
                                                        <th width="120" style="text-align:center">值</th>
                                                        <th width="120" style="text-align:center">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${applyData(_data,_value)}
                                                </tbody>
                                            </table>     
                                    </div>
                                </div>
                            </div>    
                         </div>`;

             $('.postModel-component .POSTItem-content').append(node_element);


            //把数组的数据渲染。返回节点
              function applyData(_data,_value){
                 let node_tr = ``;
                   _data.forEach( (item,index)=>{
                           node_tr += `<tr class="odd gradeX">
                                        <td> 
                                             <span>${index+1}<span>
                                        </td>
                                         <td> 
                                            <input style="display:inline-block;" class="form-control" type="text" name="data[run_method][POST][${_value}][${index}][name]" value="${item.name}">
                                        </td>
                                         <td> 
                                             <input style="display:inline-block;" class="form-control" type="text" name="data[run_method][POST][${_value}][${index}][value]" value="${item.value}">
                                        </td>
                                         <td> 
                                           <button type="button" onclick="delete_TableTr(this)" class="btn btn-xs red"><i class="fa fa-trash"></i>删除</button>
                                        </td>
                                </tr> `;
                   });

                    return node_tr;
                }

           }


     }

    GetAgencyData(_data);
 }


  /**
  * @desc 编辑赋值 "代理" 模块的赋值。
  * @Date 2021-04-02 晴 早上
  *
  *  method: "1"
  *  state: "1"
  *  url: '/' + SELF + "?s=puyicaiji&c=api&m=jsonApi"
  *
  * */
  function GetAgencyData(_data){
      if(_data.Agency){

        let AgencyObj = _data.Agency;

            // *代理状态
            if( AgencyObj.state && Number( AgencyObj.state ) ){
                $(`[name='data[run_method][Agency][state]']`).bootstrapSwitch('state',true);
            }else{
                $(`[name='data[run_method][Agency][state]']`).bootstrapSwitch('state',false);
            }

            // *代理筛选 select控件
            if(AgencyObj.method.select_val){

                $(`[name='data[run_method][Agency][method][select_val]']`).val(AgencyObj.method.select_val);

                //渲染input 输入框
                let _val = AgencyObj.method.select_val;
                switch(_val){
                    case 'API':
                         $('.method-box').html(`
                            <input class="form-control input-large marRight" type="text" name="data[run_method][Agency][method][input_val]" value="${AgencyObj.method.input_val}" placeholder="API值">
                            <button type="button" class="btn blue btn-sm" onclick="addAPIModel()"><i class="fa fa-plus"></i>添加</button>
                         `);
                        break;
                    default:
                        $('.method-box').html(`<input class="form-control input-large" type="text" name="data[run_method][Agency][method][input_val]" value="${AgencyObj.method.input_val}" placeholder="请输入值">`);
                }

                //如果 api_child_model 存在，遍历处理
                if( AgencyObj.method.api_child_model && AgencyObj.method.api_child_model instanceof Array &&  AgencyObj.method.api_child_model.length > 0 ){

                        let api_child_modelArr = AgencyObj.method.api_child_model;

                        let nodeEL=``;
                        api_child_modelArr.forEach( (item,index)=>{
                            nodeEL += `<div class="APIModel-item flexcenter">
                                         <select class="form-control marRight" style="width:150px;" name="data[run_method][Agency][method][api_child_model][${index}][select_val]" onchange="">
                                                    <option value="user" ${item.select_val == 'user' ? 'selected' : ''} >user</option>
                                                    <option value="pass" ${item.select_val == 'pass' ? 'selected' : ''}>pass</option>
                                                    <option value="port" ${item.select_val == 'port' ? 'selected' : ''}>port</option>
                                                    <option value="ip"  ${item.select_val == 'ip' ? 'selected': ''}>ip</option>
                                         </select>
                                         
                                         <input class="form-control input-large marRight" type="text" name="data[run_method][Agency][method][api_child_model][${index}][input_val]" value="${item.input_val}" placeholder="">
                                         <button type="button" onclick="delete_apiModelItem(this)" class="btn btn-xs red"><i class="fa fa-trash"></i>删除</button>
                                    </div> `;
                        });


                       $('.agency-box .api-model').append(nodeEL);
                }

            }

            // *代理测试 textarea控件
            if( AgencyObj.url ){
                $(`[name='data[run_method][Agency][url]']`).val(AgencyObj.url);
            }

      }

      GetOtherSetData(_data);
  }

 /**
  * @desc 编辑赋值 "其他功能" 模块的赋值。
  * @Date 2021-04-02 晴 早上
  *
  *
  * //***有些使用了 php的 变量绑定。直接模板渲染了。
  *
  * */
  function GetOtherSetData(_data){

      if( _data.OtherSet ){
           let OtherSetObj = _data.OtherSet;
               // *是否发布
               if( OtherSetObj.caiji_article_release && Number(OtherSetObj.caiji_article_release) ){
                   $(`[name='data[run_method][OtherSet][caiji_article_release]']`).bootstrapSwitch('state',true);
               }else{
                   $(`[name='data[run_method][OtherSet][caiji_article_release]']`).bootstrapSwitch('state',false);
               }

               // *内容限制
               if( OtherSetObj.caiji_body_length ){
                    $(`[name='data[run_method][OtherSet][caiji_body_length]']`).val(OtherSetObj.caiji_body_length);
               }



      }

  }




//-------------------------------添加自定义字段------------------------------
//提交自定义到栏目字段
function SubmitCustom_Fieldname(){
    let postData = [];
    let post_flag = true; //用于提交判断
    $('#Newscheme-modal .custom-box .form-group').each( (index,item)=>{
        if( $(item).find('#custom-name').val() &&  $(item).find('#custom-text').val() ){
            postData.push({
                Fieldname:$(item).find('#custom-name').val(),
                text:$(item).find('#custom-text').val(),
            });
        }else{
            post_flag = false;
        }

    });

    //提交逻辑模块
    if( post_flag ){
            //===>将要提交的自定义字段数据和采集字段数据对比，是否存在重复。
            //首先获取采集字段的数据 字段
               let collection_fieldArr =[];
                $('#Newscheme-table .collection-field').eq(0).find('option').each( (index,item)=>{
                      if( $(item).attr('value')  )
                        collection_fieldArr.push({
                            Fieldname:$(item).attr('value'),
                            text:$(item).text()
                        })
                });
                //进行遍历对比是否重复,进行提示。
                for( let i=0; i<collection_fieldArr.length; i++){
                    let collectionItem = collection_fieldArr[i];
                    for(let j=0;j<postData.length;j++){
                        let postItem = postData[j];
                        if( postItem.Fieldname == collectionItem.Fieldname ){
                            layer.alert('自定义字段和采集字段数据重复了！（'+collectionItem.text+'）',{icon:2,title:'提示'});
                            return
                        }
                    }
                }

            //加载成功，隐藏按钮和清除自定义字段inputdom
            addTableCustomFieldTr(postData); //添加行
            layer.msg('自定义数据成功加载到采集字段');
            clearCustomFieldname(1);

    }else{
        layer.alert('自定义字段，字段和字段描述不能为空！',{icon:2,title:'提示'});

    }
}

//成功添加自定义字段后，在表格增加一行。
function addTableCustomFieldTr(_data){
            let AddTableTrHtml = ``;
            let branch_topics = $('#Newschemeconent .branch-topics').html();
            let reg = new RegExp(`selected="selected"`,"g");

            let branch_topics_replace = branch_topics.replace(reg,"");

            _data.forEach( (item,index)=>{
                AddTableTrHtml += `
                     <tr>
                        <td class="borderright-fff">
                            <select class="collection-field form-control">
                                <option value="">不选择入库</option>
                                <option value="${item.Fieldname}" selected>${item.text}</option>
                            </select>
                        </td>
                        <td class="borderright-fff">=></td>
                            <td>
                                <select style="width:320px" class="branch-topics form-control" id="" name="" onchange="">
                                    `+branch_topics_replace+`  
                                </select>
                            </td>
                            <td>
                                <button type="button" onclick="deletefieldrow(this,1)" class="btn btn-sm red"> 
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                    </tr>                    
                `
            });
        $('#Newscheme-table tbody').append(AddTableTrHtml); //添加行
}


//清空自定义字段模块
function clearCustomFieldname(_flag){
    if(_flag !== 1) $('#addcustom-name').hide();
    $('#postcustom-name').hide();
    $('#Newscheme-modal .custom-box .form-group').remove();
}


//添加自定义字段。
 function addcustom_Fieldname(){
    let element_str = `
           <div class="form-group">
              <label class="control-label">自定义字段：</label>
              <div class="right-box">
                    <input id="custom-name" class="form-control input-large custom-item" type="text" value="" name="" placeholder="字段">
                    <input id="custom-text" class="form-control input-large custom-item" type="text" value="" name="" placeholder="字段描述">
                    <button type="button" class="btn btn-sm red" onclick="delCustom_Field(this)"> 
                         <i class="fa fa-trash"></i>删除
                    </button>
              </div>
         </div>
    `;
    $('#Newscheme-modal .custom-box').append(element_str);
    $('#postcustom-name').show();
 }

 //删除自定义方案
function delCustom_Field(_this){
    $(_this).parents('.form-group').remove();
    if( $('#Newscheme-modal .custom-box .form-group').length == 0 ){
        $('#postcustom-name').hide();
    }
}


//--------翻译开启选项--------

    //编辑模式下
    let translateOption_val = $('#translate-option input:checked').val();
    if( translateOption_val ){
         if( translateOption_val == '1' ){
                   $('#translate-selectOption1').show();
                   $('#translate-selectOption2').hide();

         }else{
              $('#translate-selectOption1').hide();
              $('#translate-selectOption2').show();
         }
    }
    $('#translate-switch').bootstrapSwitch({
            onSwitchChange: function (event, state) {
                //监听switch change事件，可以根据状态把相应的业务逻辑代码写在这里
                if (state == true) {
                    $('#translate-option').show();
                } else {
                    $('#translate-option').hide();
                }
            }
    });

    $('#translate-option input').change( function(){
         if( $(this).val() == '1'){
                $('#translate-selectOption1').show();
                $('#translate-selectOption2').hide();
        }else{
               $('#translate-selectOption1').hide();
               $('#translate-selectOption2').show();
        }

    });

    if( $('#translate-switch').bootstrapSwitch('state') ){
        $('#translate-option').show();
    }else{
        $('#translate-option').hide();
    }

  //---------------------华丽分割线----------------------------
   //select选择方案的监听事件
    let selectScheme_getObj ={};  //存储当前方案的id和text

        //编辑页面 显示
        function pageDatainit(){

            if( select_list_cateObj && select_list_cateObj.model.value){

                $("#putData-column").val(select_list_cateObj.model.value);

                Applyshow_module_cate(select_list_cateObj.model.value,function(){
                    if( select_list_cateObj.list.value ){
                        $('#select_list_cate').val(select_list_cateObj.list.value);
                    }
                });
            }

            //显示方案的
            //如果方案选中了
            if( $('.selectScheme-box .select-Scheme').val() ){
                selectScheme_getObj.selectValue = $('.selectScheme-box .select-Scheme').val();

                $('.selectScheme-box #edit-selectScheme').show();
                $('.selectScheme-box #delete-selectScheme').show();
            }

        }

        let previewhtmlData = {
            title:'',
            html:''
        }; //存储 获取到的html内容，用于预览。
        //选择栏目模式问题


        function selectScheme_onchange(obj){
             let selectValue = obj.options[obj.options.selectedIndex].value;
             let selectText = obj.options[obj.options.selectedIndex].text;
             let selectArr = [];

             $(".selectScheme-box .select-Scheme option").each( (index,item)=>{
                 selectArr.push({
                     value: $(item).val(),
                     text: $(item).text()
                 });
             });
              selectScheme_getObj = {selectValue,selectText,selectArr};
             if( selectValue ){
                 $('.selectScheme-box #edit-selectScheme').show();
                 $('.selectScheme-box #delete-selectScheme').show();
             }else{
                  $('.selectScheme-box #edit-selectScheme').hide();
                  $('.selectScheme-box #delete-selectScheme').hide();
             }
        }

        //编辑当前方案,弹框.
        let edit_selectScheme_falg = false; //用于判断 是提交方案还是编辑方案

        function edit_selectScheme(obj){
            if( !selectScheme_getObj.selectValue){
                 layer.msg('未能获取到方案选择框的id值');
                 return
            }

            //先获取编辑的数据
            let _id = selectScheme_getObj.selectValue;
            let postLoading = layer.load();
             $.ajax({
                type: "POST",dataType:"json",
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
           		data: {'edit':'Get_Data','fidld_data_id':_id, [csrf_token]:csrf_hash},
	            success: function(json) {
	            	if(json.code){
	            	       let data = JSON.parse(json.data);
    	            	   Edit_applySchemeData(data);
    	            	   console.log(data,'编辑的数据');
	            	}else{
	            	    layer.alert(json.msg,{icon:2,title:'提示'});
	            	}
	            	layer.close(postLoading);
	            },
	             error: function(HttpRequest, ajaxOptions, thrownError){
	                layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
	                layer.close(postLoading);
	            }
		     });
        }
        //渲染编辑模式下的， 编辑方案的框的数据
        function Edit_applySchemeData(data){
             $('#Newscheme-title').text('编辑方案');
             $("#Newschemeconent #scheme-name").val(data.schemeName);//方案名称
             //$('#Newschemeconent #is-scheme').prop('checked', JSON.parse(data.IsScheme_status) );
             $('#Newschemeconent #is-scheme').bootstrapSwitch('state', JSON.parse(data.IsScheme_status) );
             if( $("#Newschemeconent #storage-column ").length > 0 ){

                 //先清除状态
                 $("#Newschemeconent #storage-column option").each( (index,item)=>{
                     $(item).removeAttr('selected');
                 });
                 $("#Newschemeconent #storage-column").val(data.storageColumn.value);
                 //$('#Newschemeconent #storage-column').find(`option[value='`+data.storageColumn.value+`']`).attr("selected",true);
             }
             //if( $("#Newschemeconent #storage-column-cate option").length > 0 ){
                 //选择框 右侧栏目有数据的情况下
             //     $('#Newschemeconent #storage-column-cate').find(`option[value='`+data.storageColumn_cate.value+`']`).attr("selected",true);//左侧模型 选上

             //}else{
                //没有数据需要重新获取右侧栏目
                 Applystoragecolumn_cate(data.storageColumn.value);//请求右侧栏目的数据,ajax改为同步
                  let _id =  data.storageColumn_cate.value; //栏目id
                  let _cate_name = data.storageColumn_cate.text; //栏目名称
                  let _cate = data.storageColumn.value  //模型值

                  if(_id ){
                      ajaxColumnField(_cate,_id,_cate_name);//请求渲染栏目字段
                  }else{
                      //没有选中栏目，如果不选择栏目，那么就显示模型的字段
                      ajaxModelField(_cate);
                  }

                  $('#Newschemeconent #storage-column-cate').find(`option[value='`+data.storageColumn_cate.value+`']`).attr("selected",true);//右侧栏目 选上

            // }

            //字段表格的渲染 选上
            let tableArr = data.selectArr;
            $("#Newscheme-table tbody tr").each((index,item)=>{
                $(item).find(`.collection-field option[value='`+tableArr[index].collection_field.value+`']`).attr("selected",true);
                $(item).find(`.branch-topics option[value='`+tableArr[index].branch_topics.value+`']`).attr("selected",true);
            })

            edit_selectScheme_falg = true; //编辑方案 标志，区别于 是新建方案还是编辑方案

            //数据赋值完毕，弹出修改框编辑方案
            $('#Newscheme-modal').modal('show');
        }


        //删除当前方案
        function delete_selectScheme(obj){
            if( !selectScheme_getObj.selectValue ){
                 layer.msg('未能获取到方案选择框的id值');
                 return
            }
             //selectScheme_getObj.selectValue

             layer.open({
                  title: '是否删除当前方案'
                  ,content: selectScheme_getObj.selectText,
                  btnAlign: 'c',
                   btn: ['删除', '取消'],
                   btn1:()=>{
                        //进行删除请求对接
                        let postLoading = layer.load();
                        let _id = selectScheme_getObj.selectValue;
                         $.ajax({
                            type: "POST",dataType:"json",
                            url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=f_field_del",
                       		data: {'fidld_data_id':_id, [csrf_token]:csrf_hash },
            	            success: function(json) {
            	                 console.log(json,'删除操作');
            	            	if(json.code){
                	            	    layer.msg(json.msg);   //提示
                	            	   //异步渲染 外面的  select选择方案
                	            	   if($(".selectScheme-box .select-Scheme option").length > 0){
                	            	             let _selectArr = selectScheme_getObj.selectArr;
                    	            	         for(let i=0; i<_selectArr.length; i++){
                    	            	               let item = _selectArr[i];
                    	            	               if(item.value == _id ){
                    	            	                   _selectArr.splice(i ,1);
                    	            	                   break;
                    	            	               }
                    	            	         }

                	            	         //重新渲染select选择方案 控件
                	            	          let select_Html = "";
                	            	          _selectArr.forEach( item=>{
                	            	              select_Html+= `<option value="`+item.value+`"> `+item.text+` </option>`
                	            	          })

                	            	         $('.selectScheme-box .select-Scheme').html(select_Html)

                	            	   }
            	            	}else{
            	            	    layer.alert(json.msg,{icon: 2,title:'提示'});
            	            	}

            	            	layer.close(postLoading);
            	            },
            	             error: function(HttpRequest, ajaxOptions, thrownError) {
            	                layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
            	                layer.close(postLoading);
            	            }
            		     });
                   }
                });

        }

        //显示提醒的弹框
        function showTipmodal(text){
            $('#tip-modal #tip-content').html(text);
            $('#tip-modal').modal('show');
        }

        //渲染采集字段接口
        function applycollectionField(){
            let Data = [];
            //采集字段
            $.ajax({
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=config_field",
                type: "get",
                dataType:"json",
                async:false, //改为同步
	            success: function(res) {
	                if( res.code == 1 ){
	                      let data = res.data;
                          data.unshift({
                              field:'',
                              text:'不选择入库',
                              state:1
                          });
                          Data = data;
	                }
	            },
	            error: function(err) {
	                   console.log(err)
	            }
		    });

		    return Data;
        }

        //创建方案的弹框
        function programme_new(obj){
        	$('#Newscheme-modal').modal('show');
        	$('#Newscheme-title').text('新建方案');
        	edit_selectScheme_falg = false;
        }
        //关闭方案模态框
        $('#Newscheme-modal').on('hidden.bs.modal', function (e) {
                console.log('关闭新建方案模态框');
                //把数据清除
                CleardataInit();
        })
        //创建方案弹框--清除和初始化数据
        function CleardataInit(){
                  $("#scheme-name").val('')
                  $('#Newschemeconent #storage-column').val('');
                  $('#Newschemeconent #storage-column-cate').hide();
                  $('#Newschemeconent #storage-column-cate').val('');
                  $('#addcollection-Field').hide();

            	//清空表格行
	            $('#Newscheme-table tbody').html(`
        		      <tr>
                          <td class="borderright-fff">
                                     无数据
                                </td>
                                <td class="borderright-fff">=></td>
                                <td>
                                    无数据
                                </td>
                                <td>
                                    <!--<button type="button" onclick="deletefieldrow(this,0)" class="btn btn-sm red"> -->
                                    <!--    <i class="fa fa-trash"></i> 删除-->
                                    <!--</button>-->
                                </td>
                        </tr>
	            `);
	            //隐藏添加按钮和清空自定义字段的数据
	           clearCustomFieldname();

        }

        //提交 创建方案
        function submitSchemeFun(_this){
             let postObj={};
              //方案名称
              postObj.schemeName = $("#scheme-name").val();

              //是否开启方案
              postObj.IsScheme_status =  $('#Newschemeconent #is-scheme').prop("checked");

              //获取入库栏目
              postObj.storageColumn ={
                  value: $('#Newschemeconent #storage-column option:selected').val(),
                  text: $('#Newschemeconent #storage-column option:selected').text().trim()
              }
              //入库栏目的分类
              postObj.storageColumn_cate ={
                  value:$('#Newschemeconent #storage-column-cate option:selected').val(),
                  text:$('#Newschemeconent #storage-column-cate option:selected').text().trim()
              }

             //获取采集字段和分支字段 选中的数据。
             let selectArr = []; //存储 采集字段和分支主题的数组
             $("#Newscheme-table tbody tr").each((index,item)=>{
                  if(  $(item).find('.collection-field').length > 0 &&  $(item).find('.branch-topics').length > 0  ){
                        selectArr.push({
                            collection_field:{
                                value:$(item).find('.collection-field option:selected').val(),
                                text:$(item).find('.collection-field option:selected').text().trim()
                            },
                            branch_topics:{
                                value:$(item).find('.branch-topics option:selected').val(),
                                text:$(item).find('.branch-topics option:selected').text().trim()
                            }
                        });
                   }
             })

             /**
              * 检测selectArr 采集字段 和 栏目字段 是否重复，重复不能提交。
              * */
                /*let result=[];
                let obj={};
                let branch_topicsObj = {};
                let tipText = "";
                for(let i=0;i<selectArr.length;i++){
                     if(selectArr[i].collection_field.value){
                        if(!obj[selectArr[i].collection_field.value] ){
                            result.push(selectArr[i]);
                            obj[selectArr[i].collection_field.value]=true;
                        }else{
                            tipText += '第'+(i+1)+`行采集字段重复<br>`
                        }
                     }

                     if( !branch_topicsObj[selectArr[i].branch_topics.value] ){
                            branch_topicsObj[selectArr[i].branch_topics.value] = true;
                     }else{
                            tipText += '第'+(i+1)+`行栏目字段重复<br>`
                     }

                }
                if(tipText){
                    layer.alert(tipText,{icon: 2,title:'报错提示'});

                    return;
                }*/
            //********************************

             postObj.selectArr = selectArr;
             console.log( postObj ,'发送到服务器的参数' )
             $(_this).button('loading');
             let postLoading = layer.load();
             //提交方案到服务器
             //判断是新建方案 还是编辑方案  edit_selectScheme_falg
             if( !edit_selectScheme_falg ){
                 //新建方案提交
                     $.ajax({
                        type: "POST",dataType:"json",
                        url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=f_field_save",
                   		data: {'fidld_data':postObj, [csrf_token]:csrf_hash },
        	            success: function(json) {
        	                 console.log(json,'提交')
        	            	if(json.code){
        	            	    layer.msg(json.msg);   //提示
        	            	   $('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	                   $("#Newscheme-modal").modal('hide');  //关闭弹框
        	            	   CleardataInit();    //数据初始化html

        	            	   //异步渲染 外面的  select选择方案
        	            	   if($(".selectScheme-box .select-Scheme").length > 0){
        	            	         let data = json.data;
        	            	         if( data.id && data.schemeName){
            	            	         $(".selectScheme-box .select-Scheme").append(`
            	            	                <option value="`+data.id+`">`+data.schemeName+`</option>
            	            	         `)
        	            	         }
        	            	   }

        	            	}else{
        	            	    layer.alert(json.msg,{icon: 2,title:'提示'});
        	            	}

        	            	$('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	            	layer.close(postLoading);
        	            },
        	            error: function(HttpRequest, ajaxOptions, thrownError) {
        	               console.log(HttpRequest)
        	               	$('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	                layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
        	                layer.close(postLoading);

        	            }
        		     });
             }else{
                 //编辑方案提交
                  let _id = selectScheme_getObj.selectValue;
                 $.ajax({
                        type: "POST",dataType:"json",
                        url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
                   		data: {'edit':'Update_Data','fidld_data_id':_id,'fidld_data':postObj, [csrf_token]:csrf_hash},
        	            success: function(json) {
        	                 console.log(json,'编辑模式提交')
        	            	if(json.code){
        	            	    layer.msg(json.msg);   //提示
        	            	   $('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	                   $("#Newscheme-modal").modal('hide');  //关闭弹框
        	            	   CleardataInit();    //数据初始化html

        	            	   //异步渲染 外面的  select选择方案
        	            	   if($(".selectScheme-box .select-Scheme").length > 0){
        	            	          $(".selectScheme-box .select-Scheme option").each( (index,item)=>{
        	            	              if( $(item).attr('value') ==  _id){
        	            	                  $(item).text(postObj.schemeName);
        	            	              }
        	            	          })
        	            	   }
        	            	}else{
        	            	    layer.alert(json.msg,{icon: 2,title:'提示'});
        	            	}

        	            	$('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	            	layer.close(postLoading);
        	            },
        	            error: function(HttpRequest, ajaxOptions, thrownError) {
        	               console.log(HttpRequest)
        	               	$('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
        	                layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
        	                layer.close(postLoading);

        	            }
        		     });
             }

        }
        //添加采集字段 当前行
        function addcollectionField(){
                       let clonefiel = $('#Newschemeconent .collection-field').html();
                       let branch_topics = $('#Newschemeconent .branch-topics').html();

                       let element_tr = ` 
                                <tr>
                                    <td class="borderright-fff">
                                        <select class="collection-field form-control" name="" onchange="">
                                              `+clonefiel+`
                                        </select>
                                    </td>
                                    <td class="borderright-fff">=></td>
                                        <td>
                                            <select style="width:320px" class="branch-topics form-control" id="" name="" onchange="">
                                              
                                                `+branch_topics+`  
                                            </select>
                                        </td>
                                        <td>
                                            <button type="button" onclick="deletefieldrow(this,1)" class="btn btn-sm red"> 
                                                <i class="fa fa-trash"></i> 删除
                                            </button>
                                        </td>
                                </tr>                    
                       `

                       $('#Newscheme-table tbody').append(element_tr); //添加行
        }
        //创建方案模块 采集字段 栏目字段 删除当前行
        function deletefieldrow(_this,_index){
               //删除当前行
               $(_this).closest('tr').remove();

               if( $('#Newscheme-table tbody tr').length == 0 ){
                    $('#addcollection-Field').hide();
                    $('#Newscheme-table tbody').html(`
            		      <tr>
                              <td class="borderright-fff">
                                         无数据
                                    </td>
                                    <td class="borderright-fff">=></td>
                                    <td>
                                        无数据
                                    </td>
                                    <td>
                                        <!--<button type="button" onclick="deletefieldrow(this,0)" class="btn btn-sm red"> -->
                                        <!--    <i class="fa fa-trash"></i> 删除-->
                                        <!--</button>-->
                                    </td>
                            </tr>
    	            `);


    	            //隐藏添加按钮和清空自定义字段的数据
	                clearCustomFieldname();

               }

        }
        //入库栏目,选择模型。 渲染栏目
        let model_cate = '';//存储 用于 栏目选中，渲染栏目字段。
        function storagecolumn_onchange(obj){ //edit_cate 编辑模式下的获取
            var cate = obj.options[obj.options.selectedIndex].value;
            model_cate = cate; //获取模型 用于栏目
            Applystoragecolumn_cate(cate);
        }

        //渲染右侧栏目选择框的数据，新建方案和编辑方案的复用渲染。
        function Applystoragecolumn_cate(_cate){
            let html = '';
              $.ajax({
                type: "POST",dataType:"json",
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=moduleCate",
           		data: {'cate':_cate, [csrf_token]:csrf_hash },
           		async:false, //改为同步
	            success: function(json) {
	            	if(json.code){
	            	    json.data['0']= {
	            	        id:'',
	            	        name:'不选择只使用模型字段'
	            	    }
						if($('#storage-column-cate').length>0){
							$('#storage-column-cate').css({display:'block'});
			            	$.each(json.data, function(i, item){
	                                   html += '<option value="'+item.id+'"> '+item.name+' </option>';
			            	});
				 			$('#storage-column-cate').html(html);

				 			//还没选择栏目select操作 ，默认不选择只使用模型字段
		           		}else{
		           			html = '<select class="form-control" id="storage-column-cate" name="data[cate_id]" onchange="selectColumn_onchange(this)">';
    		           		    $.each(json.data, function(i, item){
    	                               html += '<option value="'+item.id+'"> '+item.name+' </option>';
    			            	});
		           			html += '</select>';
		           			$('.storage-column-cate-label').html(html);
		           		}
                         ajaxModelField(_cate);
                         $('#addcollection-Field').show();
	            	}else{
	            		$('.storage-column-cate-label').html('<span class="text-info" id="select_ok">'+json.data+'</span>');

	            		//清空表格行
	            		$('#Newscheme-table tbody').html(`
        		             <tr>
                                <td class="borderright-fff">
                                     无数据
                                    
                                </td>
                                <td class="borderright-fff">=></td>
                                <td>
                                    无数据
                                </td>
                                <td>
                                    <!--<button type="button" onclick="deletefieldrow(this,0)" class="btn btn-sm red"> -->
                                    <!--    <i class="fa fa-trash"></i> 删除-->
                                    <!--</button>-->
                                </td>
                          </tr>
	            		`);

	            		//隐藏添加按钮和清空自定义字段的数据
	            		clearCustomFieldname();
	            	}
	            },
	            error: function(HttpRequest, ajaxOptions, thrownError) {
	               console.log(HttpRequest)

	            }
		     });

        }


        function selectColumn_onchange(obj){
              let _cate = model_cate;
              let _id = obj.options[obj.options.selectedIndex].value;       //栏目id
              let _cate_name = obj.options[obj.options.selectedIndex].text; //栏目名称
              if( _id ){
                  ajaxColumnField(_cate,_id,_cate_name);//请求渲染栏目字段
              }else{
                  //没有选中栏目，如果不选择栏目，那么就显示模型的字段
                  ajaxModelField(_cate);
              }
              $('#addcollection-Field').show();
        }
        //根据select栏目 请求渲染栏目字段 select控件 （表格）
        function ajaxColumnField(_cate,_id,_cate_name){
                $.ajax({
                type: "POST",dataType:"json",
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=cate_list_field",
           		data: {'cate':_cate,'id':_id,'cate_name':_cate_name , [csrf_token]:csrf_hash },
           		async:false, //改为同步
	            success: function(res) {
	            	 if( res.code == 1 ){
	                      let data = res.data;
	                      ApplyColumnField(data); //渲染栏目字段
	                  }
	            },
	            error: function(HttpRequest, ajaxOptions, thrownError) {
	               console.log(HttpRequest)
	            }
		     });
        }
        //没有选中栏目，如果不选择栏目，那么就显示模型的字段,模型字段渲染到 表格栏目字段select。
        function ajaxModelField(_cate){
            $.ajax({
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=cate_field",
                type: "POST",
                data: {'cate':_cate, [csrf_token]:csrf_hash},
                dataType:"json",
                async:false, //改为同步
	            success: function(res) {
	                if( res.code == 1 ){
	                    let data = res.data;
	                    ApplyColumnField(data);
	                }else{
	                    //请求清空
	                    $('#Newscheme-table tbody').html('')
	                }
	            },
	            error: function(err) {
	                   console.log(err)
	             }
		     });

        }

        //渲染栏目字段 和 采集字段
        function ApplyColumnField(data){

            //渲染采集字段 存储
            let collectionFieldArr = applycollectionField();
            let collectionFieldSelect_html = ""; //生成采集字段的 select option html节点存储
            if( collectionFieldArr.length > 0 ){
                for(let i=0; i<collectionFieldArr.length; i++){
                    let item = collectionFieldArr[i];
                    if(item.state == 1){
                        collectionFieldSelect_html += '<option value="'+item.field+'"> '+item.text+' </option>'
                    }
                }
            }

            let ColumnFieldhtml = '<option value="">选择字段</option>'; //默认添加空，请选择字段
            let table_trArr = [];
                $.each(data, function(i, item){
	                   ColumnFieldhtml += '<option value="'+item.fieldname+'"> '+item.name+' </option>';
	                   table_trArr.push(item);
			    });

            //栏目字段渲染表格 显示每项
                let element_tr ='';
                for(let i=0; i<table_trArr.length;i++){
                        element_tr += ` 
                            <tr>
                                <td class="borderright-fff">
                                    <select class="collection-field form-control" name="" onchange="">
                                          `+collectionFieldSelect_html+`
                                    </select>
                                </td>
                                <td class="borderright-fff">=></td>
                                    <td>
                                        <select style="width:320px" class="branch-topics form-control" id="" name="" onchange="">
                                            `+ColumnFieldhtml+`  
                                        </select>
                                    </td>
                                    <td>
                                        <button type="button" onclick="deletefieldrow(this,1)" class="btn btn-sm red"> 
                                            <i class="fa fa-trash"></i> 删除
                                        </button>
                                    </td>
                             </tr> `;
                }

                $('#Newscheme-table tbody').html(element_tr);

                //显示添加自定义字段 按钮
                $('#addcustom-name').show();
           }

          //栏目字段的排序显示
           function sortShowColumnField(data,_index){
                let html = "";
                for(let i=0;i<data.length; i++){
                    let item = data[i];
                    if( i == _index){
                          html +=  '<option selected="selected" value="'+item.fieldname+'"> '+item.name+' </option>';
                    }else{
                          html += '<option value="'+item.fieldname+'"> '+item.name+' </option>';
                    }
                }
                return html
           }
        //测试工具弹框
        function testTools(){
             let list_url_data = $(".list_url").val();
             if( !list_url_data ){
                showTipmodal('采集目标URL不能为空');
                return
             }

             let noSpaceStr = list_url_data.replace(/\s+/g, "");
             let tempArr = noSpaceStr.split('://');
             let UrlArr = [];

             for(let i=0; i<tempArr.length; i++){
                 let item = tempArr[i];

                  if(item.length > 5){
                        let tempItem = JSON.parse( JSON.stringify(item) );
                        if( item.indexOf('https') !== -1 ){
                            UrlArr.push( tempItem.replace("https", "") )
                        }else{
                            UrlArr.push( tempItem.replace("http", "") )
                        }
                  }
             }

            let radioEl = "";
             UrlArr.forEach( (item,index)=>{
                 radioEl +=`<label class="mt-radio mt-radio-outline"><input type="radio" name="selecturl" ${ index == 0 ? 'checked':''}  value="${item}"> ${item} <span></span></label>`;
             });
             $('.selectUrl-box .mt-radio-inline').html(radioEl);
             $('#myModal .selectUrl-box').show();


            $('#myModal').modal('show');
        }

        //select 选择模型栏目
         var globalSelect_cate = ""; //  渲染采集模式===>JSON模式的获取树形 显示操作==“对应字段”
        function select_cate(obj){
        	var cate = obj.options[obj.options.selectedIndex].value;
        	globalSelect_cate = cate;
        	Applyshow_module_cate(cate);

        }
        function Applyshow_module_cate(_cate,callback){
            let html = '';
            $.ajax({
                type: "POST",dataType:"json",
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=moduleCate",
           		data: {'cate':_cate, [csrf_token]:csrf_hash },
	            success: function(json) {
	            	if(json.code){
						if($('#select_list_cate').length>0){
							$('#select_list_cate').css({display:'block'});
			            	$.each(json.data, function(i, item){
	                                   html += '<option value="'+item.id+'"> '+item.name+' </option>';
			            	});
				 			$('#select_list_cate').html(html);

		           		}else{
		           			html = '<select class="form-control" id="select_list_cate" name="data[cate_id]">';
		           			$.each(json.data, function(i, item){
	                                   html += '<option value="'+item.id+'"> '+item.name+' </option>';
			            	});
		           			html += '</select>';
		           			$('#css_display').html(html);
		           		}
                        if(callback) callback();
	            	}else{
	            		$('#css_display').html('<span class="text-info" id="select_ok">栏目没有,请在该模型创建栏目</span>');
	            	}
	            },
	            error: function(HttpRequest, ajaxOptions, thrownError) {
	            }
		       });
        }

	 	function selectOnchang(obj){
				 //获取被选中的option标签选项
				// alert(obj.selectedIndex);
				 if(obj.selectedIndex == '0'){
				 	html = ` <!--采集目标URL-->
				 	  <div class="form-group " id="dr_row_name">
				 	      <label class="col-md-2 control-label">采集目标URL</label>
				 	      <div class="col-md-9">
				 	         <label>
				 	             <textarea class="form-control list_url" style="height: 116px; width: 570px; margin: 0px;" name="data[list_url]">${addslashes_url}</textarea>
				 	        </label>
				 	        <span class="help-block" id="dr_name_tips">填入你要采集的url栏目,可多个url,如:</br>http://www.baidu.com/list1/sssss.html</br>http://www.puyi.com/list2/wssss.html </span>
				 	        </div>
				 	  </div>
				 	  <!--URL特征码-->       
				 	 <div class="form-group" id="dr_row_name">
				 	       <label class="col-md-2 control-label">URL特征码</label>
				 	         <div class="col-md-9">
				 	              <label>
				 	                   <textarea class="form-control list_rule" style="height: 116px; width: 570px; margin: 0px;" name="data[list_rule]">${addslashes_run_method_list_url}</textarea>
				 	              </label>
				 	              <span class="help-block" id="dr_name_tips">提示: 为了更方便识别精准您需要的URL,请您输入你要提取类型URL：</br>/list1/</br>/list2/</br>那么就填入: list/或者 list/20201 即可</br>您也可以选择不填入</br>注:每行的规则匹配上面换行的对应URL，否则会进入自动匹配规则
				 	              </span>
				 	       </div>
				 	     </div>

				 	  </div>`;
				 	$('.data_html').html(html);
				 }
				 if(obj.selectedIndex == '1'){
				 	//html = '开发中';//'<div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">采集目标URL</label><div class="col-md-9"><label><textarea class="form-control " style="height: 116px; width: 570px; margin: 0px;" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">填入你要采集的url栏目</span></div></div><div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">URL特征码</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">为了更好精确识别,请填入需要采集内容地址特征如:<br>list/20201/111.html 那么就填入 list/20201/ 即可</span></div></div>'
				 		 html = `
				 	        <!--json地址-->
    				 	    <div class="form-group">
                                <label class="col-md-2 control-label">json地址</label>
                                <div class="col-md-9">
                                    <label>   
                                      
                                        <textarea class="form-control" id="jsonAddress" style="height: 110px; width: 570px; margin: 0px;" placeholder="json地址"></textarea>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-2 control-label">参数替换</label>
                                <div class="col-md-9">
                                    <label>   
                                         <a href="javascript:void(0);" class="btn blue" onclick="addParameterrePlaceFunc(this)">添加替换</a>
                                    </label>
                                </div>
                            </div>
                             <!--参数替换：-->
                             <div class="form-group" id="parameter-replace-box" style="display:none">
                                <label class="col-md-2 control-label">参数替换操作</label>
                                <div class="col-md-9">
                                    <label>   
                                        <div class="get-resultbox">
                 
                                        </div>
                                    </label>
                                </div>
                            </div>
                             <!--callback前后字串-->
                            <div class="form-group">
                                <label class="col-md-2 control-label">callback前后字串</label>
                                <div class="col-md-9">
                                    <label>   
                                        <input class="form-control input-large" id="json_callback" style="width:180px!important" type="text" value="" placeholder="callback前字串">
                                    </label>
                                      <label>   
                                     <!--<input class="form-control input-large" style="width:180px!important" type="text" name="data[jsonAddress]" value="" placeholder="callback后字串">-->
                                    </label>
                                    <label>
                                         <a href="javascript:void(0);" class="btn blue" onclick="getResultFunc(this)">获取</a>
                                    </label>
                                </div>
                            </div>
                             <!--获取结果：-->
                            <div class="form-group" id="getResultbox" style="display:none">
                                <label class="col-md-2 control-label">获取结果</label>
                                <div class="col-md-9 result-tree-box">
                                    <div id="result-tree" class="demo-tree"></div>
                                </div>
                            </div>`;
				 	$('.data_html').html(html);

				 	//渲染替换方法的select控件下拉数据
				    applySelectData();
				 }
				 if(obj.selectedIndex == '2'){
				 	html = '开发中';//'<div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">采集目标URL</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">填入你要采集的url栏目</span></div></div><div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">URL特征码</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">为了更好精确识别,请填入需要采集内容地址特征如:<br>list/20201/111.html 那么就填入 list/20201/ 即可</span></div></div>'
				 	$('.data_html').html(html);
				 }
				 if(obj.selectedIndex == '3'){
				 	html = '<div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">采集目标URL</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">填入你要采集的url栏目</span></div></div><div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">URL特征码</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">为了更好精确识别,请填入需要采集内容地址特征如:<br>list/20201/111.html 那么就填入 list/20201/ 即可</span></div></div>'
				 	$('.data_html').html(html);
				 }
		}

var itemValue1 = {'selectedIndex':$("#select_data option:selected").val()}
selectOnchang(itemValue1);


//-----------------------------采集模式==>自动化模式业务-------------------------------------

//****

//点击“获取”按钮，获取结果，渲染获取结果项
function getResultFunc(_this){

     if( !$("#putData-column option:selected").val() ){
         layer.msg('请先选择入库栏目，再点击“获取”');
         return
     }

     if( !$('#jsonAddress').val() ){
           layer.msg('请填写json地址')
        return
     }

    //获取参数替换的值。 son-select
     let replace_paramsArr = [];
     $('#parameter-replace-box .result-list-item').each( (index,item)=>{
            replace_paramsArr.push({
                paramsStr: $(item).find('.params input').val(),
                lengthNum: $(item).find('.length input').val(),
                replaceVal: $(item).find('.replace-value input').val(),
                selectVal: $(item).find('.replace-select select').val(),
                selectOptionChild: $(item).find('.son-select select').val() ? $(item).find('.son-select select').val() : ''
            });

     });
       console.log( replace_paramsArr );
     $(_this).button('loading');//禁用按钮并显示提交中
     layer.load();
     //开始加载内容
     var data = new Array()
     var json_url =  $('#jsonAddress').val();
     var callback =  $('#json_callback').val();

	 $.ajax({
    	    type: "POST",
    	    dataType:"json",
    	    url:'/' + SELF + "?s=Puyicaiji&c=api&m=jsonTest",
    		data: {'data[url]':json_url,'data[replace_paramsArr]':replace_paramsArr,'data[callback]':callback, [csrf_token]:csrf_hash },
    	    success: function(res) {
    	    	if(res.code){
    				let resdata = res.data;
    	    	    let Processed_data = recuObj(resdata); //处理数据
    	            showTreeData(Processed_data); //渲染获取结果===>显示字段树形

    	    	}else{
    	    		//layer.alert(res.msg ,{icon: 2,title:'提示'});
    	    		 layer.alert('不是正确的json',{icon: 2,title:'提示'});
            	    	$('#getResultbox .result-tree-box').html(`<pre><code class="hljs language-html copyable" lang="html"> </code><span class="copy-code-btn">复制代码</span></pre>`);
            	    	$('#getResultbox .result-tree-box pre code').text(res.data);

        	            //复制代码功能
        	            $('.copy-code-btn').click(function(){
        	                var copyText = $("#getResultbox .result-tree-box pre code").text();//获取对象文本
                            var oInput = document.createElement('input');
                            oInput.value = copyText;

                            document.body.appendChild(oInput);
                            oInput.select(); // 选择对象
                            document.execCommand("Copy"); // 执行浏览器复制命令
                            layer.msg('复制成功');
                         　 oInput.remove();　
        	            })

        	    		$('#getResultbox').show();
        	    		$('#correspondFieldBox').hide();//隐藏对应字段select控件
    	    	}
    	    },
    	    error: function(HttpRequest, ajaxOptions, thrownError) {
    	    	//错误提示
    	    	console.log('报错了');
    	    },
    	    complete:function(){
	            $(_this).button('reset');//重置按钮
                layer.closeAll('loading');//关闭加载
    	    }
	  });

      //递归循环对象，列出所有的字段成为 数据模型
      function recuObj(_Obj){
            let tempArr = [];
            for(let k in _Obj){
               if( _Obj[k] instanceof Object &&  !( _Obj[k] instanceof Array) ){
                    tempArr.push({
                        title:k,
                        id:k,
                        children:[...recuObj(_Obj[k])]
                    });
                    //recuObj(_Obj[k])
               }else{
                    tempArr.push({
                        title:k,
                        id:k,
                    });
               }
            }
            return tempArr;
        }

	  //渲染树形
	  function showTreeData(_data){
	       //渲染显示树形图，让其操作
	       if(_data && _data.length > 0 && _data instanceof Array){
	            $('#getResultbox .result-tree-box').html(`<div id="result-tree" class="demo-tree"></div>`);


	           let Select_CorrespondField = showRenderCorrespondField( $("#putData-column option:selected").val() ? $("#putData-column option:selected").val() : globalSelect_cate);

        	   LayuiTree.render({
                    elem: '#result-tree'
                    ,data: _data
                    ,showCheckbox: true
                    ,showLine:false,
                    id: 'id',
                    oncheck: function(obj){
                        let checkData = LayuiTree.getChecked('id');
                        //console.log( "提交的树形选中数据===>" ,  flattenArr(checkData) )
                        let postData = flattenArr(checkData);
                        //console.log('得到当前点击的节点数据===>', postData ,checkData , obj.checked); //得到当前点击的节点数据
                        //console.log('得到当前节点的展开状态===>', obj.checked); //得到当前节点的展开状态：open、close、normal


                        let CorrespondField_ELement = `
                            <div class="CorrespondField-box">   
                                <span>==></span>
                                <span>对应字段：</span>
                                <select class="form-control" onchange="" style="display:inline-block;width:auto">
                                        ${Select_CorrespondField}
                                </select>
                            </div>
                        `;

                        if( obj.checked ){
                            $(obj.elem).find('.layui-tree-main').append(CorrespondField_ELement);
                            $(obj.elem).find('.layui-tree-main').addClass('border-active');
                        }else{
                            $(obj.elem).find('.layui-tree-main .CorrespondField-box').remove();
                            $(obj.elem).find('.layui-tree-main').removeClass('border-active');
                        }

                        //获取数据
                        Post_Tree_CorrespondField_data();
                    }
                });
                $('#getResultbox').show();
                $('#correspondFieldBox').show();
                //showRenderCorrespondField(); //显示“对应字段”
	       }
	  }

	   //处理 获取选中节点的id，扁平化数组处理
      function flattenArr(_data, level = 0){
          let data = JSON.parse(JSON.stringify(_data));
          return data.reduce((arr, {id, title, children = []}) =>
                arr.concat([{level, id, title}], flattenArr(children, level+1)), [])
      }

}

/***
 *  处理数据，提交到服务器的树形字段 和 对比字段= Arr
 *
 *  获取树形勾选的数据 和 对比字段select的数据==>提交到后台
 * */
function Post_Tree_CorrespondField_data(){
        let myPostArr = [];
        $('#result-tree .layui-form-checked').each( (index,item)=>{
            if( $(item).parents('.border-active').length ){
                myPostArr.push({
                    name:$(item).parents('.border-active').find('.layui-tree-txt').text(),
                    CorrespondField: $(item).parents('.border-active').find('.CorrespondField-box select').val(),
                })
            }
        });
        console.log('提交到服务器的树形字段Arr==>',myPostArr);
        return myPostArr;
}
//渲染“对应字段”的 select控件
function showRenderCorrespondField(_cate){
  //请求对应字段select数据
  if( _cate ){
        let Tempelement = ``;
        let flag = true;
          $.ajax({
                url:'/' + SELF + "?s=Puyicaiji&c=api&m=formula&field_model=cate_field",
                type: "POST",
                data: {'cate':_cate, [csrf_token]:csrf_hash },
                dataType:"json",
                async:false, //改为同步
                success: function(res) {
                    if( res.code == 1 ){
                        let data = res.data;

                        let element = "";
                        for(let key in data){
                            element +=`<option value="${data[key].fieldname}"> ${data[key].name}(${data[key].fieldname})</option>`;
                        }
                         Tempelement = `
                            <option selected="" value="">请选择</option>
                            ${element} `;


                        //渲染对应字段”的 select控件；
                        //$('#correspondFieldBox select').html(Tempelement);

                        //console.log(data ,'断点')
                    }else{
                        //请求清空showRenderCorrespondField
                        layer.alert(res.data,{icon: 2,title:'提示'});
                        flag = false;
                    }
                },
                error: function(err) {
                       console.log(err)
                }
           });

           if(flag){
               return Tempelement
           }
    }
  //$('#correspondFieldBox').show();//显示“对应字段”的 select控件
}


//删除获取结果==>当前项字段删除
function DelgetResult_field(_this){
    $(_this).parents('.result-list-item').remove();

    if( $('#getResultbox .result-list .result-list-item').length == 0 ){
        $('#getResultbox').hide()
    }
}
//添加替换
function addParameterrePlaceFunc(_this){
    if( applySelectDataArr.length == 0 ){
        layer.msg('替换选择框无数据，不能进行渲染')
        return
    }

    let element_Item =`<div class="result-list-item">
                <div class="item-field item-content params">  
                    <input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" placeholder="参数" title="参数">
                </div>
                
                <div class="item-content replace-value" style="display:none">  
                    <!-- <input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" placeholder="替换值"> -->
                </div> 
                
                 <div class="item-content length" style="display:none">  
                   <!--<input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" placeholder="长度" title="长度"> -->
                </div>
                
                <div class="item-content replace-select">
                     ${applySelectHtml}
                     <!-- <select class="form-control" onchange="replaceSelectChange(this.options[this.options.selectedIndex].value,this)">
                     <option value=""> 选择替换方法 </option> 
                     <option value="1"> base64</option>
                     <option value="2"> md5</option>
                     <option value="3"> unxi_time</option>
                     <option value="4"> 随机数字</option>
                     <option value="5"> 随机字母</option>
                     <option value="6">随机字母+数字</option>
                   </select> -->
                </div>
        
                <div class="item-content son-select" style="display:none">
                    <select class="form-control" onchange="">
                         <option value="">不选择</option> 
                         <option value="1">大写</option>
                         <option value="2">小写</option>
                         <option value="3">大小写组合</option>
                   </select>
                </div>
            
                <div class="item-delbtn item-content"> 
                    <a href="javascript:void(0);" class="btn btn-sm red" onclick="DelrePlaceParame(this)"> 
                        <i class="fa fa-trash"></i> 删除
                    </a>
                </div>
            </div>`;

    //生成渲染 替换项
    $('#parameter-replace-box .get-resultbox').append(element_Item);
    $('#parameter-replace-box').show();
}


//替换参数select选择框 change()
function replaceSelectChange(_val,_this){
    let flag = false;//标识 是否渲染事宜。
    let applyChildSelect_Element = ``;
    let replaceVal = "";
    let lengthNum = "";

    for(let i=0; i<applySelectDataArr.length;i++){
        let item = applySelectDataArr[i];
        if( item.val === _val && item.model ){

        //判断是否显示 替换值
            if( item.model.replaceVal && typeof item.model.replaceVal == "string" ){
                replaceVal = item.model.replaceVal;
            }

        //判断是否显示 长度input
            if( item.model.lengthNum && typeof item.model.lengthNum == "string" ){
                lengthNum = item.model.lengthNum;
            }

            if( item.model && item.model.selectOptionChildArr instanceof Array && item.model.selectOptionChildArr.length > 0){
                for(let j=0; j<item.model.selectOptionChildArr.length; j++){
                    let childItem = item.model.selectOptionChildArr[j];
                    applyChildSelect_Element +=`
                       <option value="${childItem.val}">${childItem.text}</option>
                    `;
                }
                flag = true;
                break;
            }
        }
    }


    if(flag){
        $(_this).parent('.item-content').siblings('.son-select').html(`
            <select class="form-control" onchange="">
                 <option value="">不选择</option> 
                 ${applyChildSelect_Element}
            </select> `);
        $(_this).parent('.item-content').siblings('.son-select').show();

    }else{
        $(_this).parent('.item-content').siblings('.son-select').html("");
        $(_this).parent('.item-content').siblings('.son-select').hide();
    }

   //判断替换值是否显示，让其操作
    if( replaceVal ){
        $(_this).parent('.item-content').siblings('.replace-value').html(`
            <input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" placeholder="替换值" title="替换值">
        `);
          $(_this).parent('.item-content').siblings('.replace-value').show();
    }else{
        $(_this).parent('.item-content').siblings('.replace-value').html("");
        $(_this).parent('.item-content').siblings('.replace-value').hide();
    }

    //判断长度input 是否显示，让其操作
    if(lengthNum){
          $(_this).parent('.item-content').siblings('.length').html(`
            <input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" placeholder="长度" title="长度">
        `);
          $(_this).parent('.item-content').siblings('.length').show();

    }else{
         $(_this).parent('.item-content').siblings('.length').html("");
         $(_this).parent('.item-content').siblings('.length').hide();
    }


}


//删除替换参数列 项
function DelrePlaceParame(_this){
    $(_this).parents('.result-list-item').remove();

    if( $('#parameter-replace-box .result-list-item').length === 0 ){
         $('#parameter-replace-box').hide();
    }
}


//---------------------------------华丽分割线------------------------------------------------------------

$(".test_data").click(function(){

    let selectUrlradio = $('#myModal .selectUrl-box .mt-radio-inline .mt-radio input[name="selecturl"]:checked').val();
    if(!selectUrlradio ){
        layer.msg('您还没选择目标URL');
        return
    }

	var list_rule_data = $(".list_rule").val();
	var list_url_data = 'http://'+selectUrlradio;

	var list_rule_section_data = $(".list_rule_section").val();
	/*if(!list_url_data){
	    alert('采集目标URL不能为空')
	    return
	}*/
	var datas = {
		"list_url" : list_url_data,
		"list_rule" : list_rule_data,
		"list_rule_section" : list_rule_section_data,
		"models":'auto',
	}

	//获取表单的数据
	let formData = $('#myform').serialize();

	 $.ajax({
            type:"POST",
            url:'/' + SELF + "?s=Puyicaiji&c=home&m=collectListAdd&XDEBUG_SESSION_START=17830",
            data: {form:formData,datas, [csrf_token]:csrf_hash },
            dataType:"json",
            beforeSend:function (){
                    $('.data_json_url .list-content').html('');
                    $('#myModal .selectUrl-box').hide();//隐藏选择目标Url
					showModal();
			},
            success:function(data){
            	hideModal();
               if(data.code == 0){
               		dr_tips(1, data.msg);
               		return ;
               }
               if(data.code=='1'){
               	var arr = data.msg
               	html = '';
				$.each(arr, function(i, item){
				   html += '<div class="list-li"><div class="list-li-content">'+item+'</div><div class="list-li-button"><button type="button" data-loading-text="Loading..." class="getContent-btn btn btn-danger btn-sm"  onclick="clickButton(\''+item+'\','+i+')">读取内容</button></div></div>'
				});
               	$('.data_json_url .list-content').html(html);
               }
               console.log(data)
               //$('#myModal .selectUrl-box').hide();//隐藏选择目标Url
            },
            error:function(jqXHR){
            	hideModal()
                console.log(jqXHR);
            }
        });
});

let $getContentBtn = $('.getContent-btn')
function clickButton(urls,_index){ //测试文章模块

      $('.getContent-btn').attr("disabled",'disabled');//增加属性 ;
      $('.test_data').attr("disabled",'disabled');//增加属性
	_ajax(datas={url:urls,models:'article_test'},urls,'','article_test','test');

//	$('#myModal').modal('show');
}
function hideModal(){
	$('.modalLoading').hide();
}

function showModal(){
// 		$('#myModal_loading').modal({backdrop:'static',keyboard:false});
$('.modalLoading').show();
}

function _ajax(datas = {},urls,htmls,models,models_models){
	 $.ajax({
            type:"POST",
            url:'/' + SELF + "?s=Puyicaiji&c=home&m="+models_models+"&models="+models,
            data: {datas, [csrf_token]:csrf_hash },
            dataType:"json",
            beforeSend:function (){
				// showModal();
			},
            success:function(res){
                if(res.code !== 1){
                    layer.alert(res.msg,{icon: 2,title:'报错提示'});
     				return
                }

                if(  typeof(res.data.data)=='string'){
                    layer.msg('获取到的数据是字符串，无法解析',{icon: 2});
                    return
                }
                 let backData = res.data.data.data;
                if(JSON.stringify(backData) === '{}' || JSON.stringify(backData) === '[]'){
                     layer.msg('获取到的数据是空的',{icon: 2});
                     return
                }

                let tbodyHtml = '';
                $('#caiji-result').html('');

                for(let item in backData){
                         if(item == 'html'){
                             tbodyHtml += `
                              <tr>
                                <td>` + item + `</td>
                                <td><button type="button" class="btn btn-danger btn-sm" onclick="openNewPages('`+datas['url']+`')">运行HTML</button></td>
                              </tr>
                            `;

                         }else{
                           tbodyHtml += `
                                <tr>
                                    <td>` + item + `</td>
                                    <td>`+backData[item]+`</td>
                                </tr>
                            `;
                         }
                }

                    let resultHtml = `
                        <table  class="table table-striped table-hover table-bordered text-nowrap">
                            <thead>
                                <tr>
                                    <th style="width:180px;">参数</th>
                                    <th>值</th>
                                </tr>
                            </thead>
                            <tbody>
                                `+tbodyHtml+`
                            </tbody>
                        </table>
                    `

                    $('.getContent-btn').button('reset'); //关闭读取内容按钮 loading
                    $('.test_data').removeAttr("disabled");
                    $('#caiji-result').html(resultHtml)
                    $('#result-modal').modal('show')

                /*
                	hideModal()
                   if(data.code == 0){
                   		dr_tips(0, data.msg);
                   }
                   if(data.code=='1'){
                   	var arr = data.msg
                   	html = '';
    				$.each(arr, function(i, item){
    				   html += '<div class="list-li"><div class="list-li-content">'+item+'</div><div class="list-li-button"><button type="button" class="btn btn-danger btn-sm" onclick="clickButton(\''+item+'\')">读取内容</button></div></div>'
    				});
                   	$('.data_json_url').html(html);
                   }
               */
            },
            error:function(jqXHR){
            	// hideModal()
                console.log(jqXHR);
               //$('.getContent-btn').button('reset'); //关闭读取内容按钮 loading
               //$('.test_data').removeAttr("disabled");
            },
            complete:function(XHR, TS){
              // $('.getContent-btn').button('loading').button('reset'); //关闭读取内容按钮 loading
               $(".getContent-btn").removeAttr('disabled');
               $('.test_data').removeAttr("disabled");
            }
        });
}


function openNewPages(_data){

    window.open(
    _data,
     "_blank",
     "top=300,left=300,width=800,height=600,menubar=no,toolbar=no,status=no,scrollbars=yes"
    );
    //showPreviewhtml();
}
function showPreviewhtml(){
   if( !previewhtmlData.html ){
       alert('没有html内容');
       return
   }
        $('#preview-modal-html #htmlconent-iframe').attr("name",previewhtmlData.title);
        $('#preview-modal-html #htmlconent-iframe').attr("srcdoc",previewhtmlData.html);


    $('#preview-modal-html').modal('show')

}

        $(function(){
          $('#myModal').on('show.bs.modal', function(){
             var list_url_data = $(".list_url").val();
              	if(!list_url_data){
        	    alert('采集目标URL不能为空')
        	    return
        	 }

              $('.data_json_url .list-content').html('');
              var $this = $(this);
              var $modal_dialog = $this.find('.modal-dialog');
              $this.css('display', 'block');
              $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 3) });
          });

        })
        $(function(){
          $('#caiji-result').on('show.bs.modal', function(){
              var $this = $(this);
              var $modal_dialog = $this.find('.modal-dialog');
              $this.css('display', 'block');
              $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 3) });
          });
        })

        $(document).on('show.bs.modal', '.modal', function(event) {
            $(this).appendTo($('body'));
        }).on('shown.bs.modal', '.modal.in', function(event) {
            setModalsAndBackdropsOrder();
        }).on('hidden.bs.modal', '.modal', function(event) {
            setModalsAndBackdropsOrder();
        });

        function setModalsAndBackdropsOrder() {
            var modalZIndex = 1040;
            $('.modal.in').each(function(index) {
                var $modal = $(this);
                modalZIndex++;
                $modal.css('zIndex', modalZIndex);
                $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
            });
            $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
        }
        