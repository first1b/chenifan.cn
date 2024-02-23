/***
 * 2020-1-11
 * 新增功能
 *    
 *    采集，JSON模式   引用layui.js  展示字段 用树形图结构。
 *     
 *     页面html 已定义layUI 树形插件
 *	    var LayuiTree = layui.tree;
 *    
 *     此文件js LayuiTree 引用 渲染树形图
 *    
 * 
 * 2021-01-22 新增功能
 *   
 *  User-Agent的数据对接
 * 
 * 
 * */
 
//**************添加测试规则 按钮**************
 /**
  * @date 2021-05-18 星期二 11:18  晴天
  * */
  function testrulesFunc(){
      
      $('#testrules_Modal').modal('show');
      
  }
  
   //执行测试 
  function runTest(_text){
      
      console.log(_text)
      
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
           
     })

//-------------------------------方案添加自定义字段功能------------------------------
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
    
 
 //------------------------------翻译开启选项-------------------------------------
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
    
        let previewhtmlData = {
            title:'',
            html:''
        }; //存储 获取到的html内容，用于预览。
        //选择栏目模式问题
        
        //select选择方案的监听事件
        let selectScheme_getObj ={};  //存储当前方案的id和text
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
           		data: {'edit':'Get_Data','fidld_data_id':_id, [csrf_token]:csrf_hash},
	            success: function(json) {
	            	if(json.code){ 
	            	       let data = JSON.parse(json.data);
	            	       console.log(data);
    	            	   Edit_applySchemeData(data);
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
        function Edit_applySchemeData(data,_rulesArr){
             $('#Newscheme-title').text('编辑方案');
             $("#Newschemeconent #scheme-name").val(data.schemeName);//方案名称
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
            
            /*
             *2020-02-02 添加的业务：添加规则 ==>同步
             *        渲染： 
             *           添加自定义字段的 列表
             */
             /*let element_node = "";//自定义字段的节点html 
             _rulesArr.forEach( (item,index)=>{
                    if( item.rules_name && item.rules_value ){
                        element_node+=`
                               <div class="form-group">
                                  <label class="control-label">自定义字段：</label>
                                  <div class="right-box">
                                        <input id="custom-name" class="form-control input-large custom-item" type="text" value="${item.rules_value}" name="" placeholder="字段">
                                        <input id="custom-text" class="form-control input-large custom-item" type="text" value="${item.rules_name}" name="" placeholder="字段描述">
                                        <button type="button" class="btn btn-sm red" onclick="delCustom_Field(this)"> 
                                             <i class="fa fa-trash"></i>删除
                                        </button>
                                  </div>
                               </div>`;
                    } 
             });
            
            $('#Newscheme-modal .custom-box').html(element_node);
            $('#postcustom-name').show();
            */             
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
                            url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_del",
                       		data: {'fidld_data_id':_id,[csrf_token]:csrf_hash},
            	            success: function(json) {
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=config_field",
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
        	//区别提交的时候，新建还是编辑。
        	edit_selectScheme_falg = false;
        	
        }
        //关闭方案模态框
        $('#Newscheme-modal').on('hidden.bs.modal', function (e) {
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
             });
             
            /**
              * 检测selectArr 采集字段 和 栏目字段 是否重复，重复不能提交。
              * 
              **/
                /*
                    let result=[];
                    let obj={};
                    let branch_topicsObj ={};
                    let tipText = "";
                    for(let i=0;i<selectArr.length;i++){
                         if(selectArr[i].collection_field.value){ 
                            if(!obj[selectArr[i].collection_field.value] ){
                                obj[selectArr[i].collection_field.value] = true;
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
                    }
                */    
            //**************************************
           
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
                        url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_save",
                   		data: {'fidld_data':postObj,[csrf_token]:csrf_hash},
        	            success: function(json) {
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
                        url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
                   		data: {'edit':'Update_Data','fidld_data_id':_id,'fidld_data':postObj,[csrf_token] : csrf_hash},
        	            success: function(json) {
 
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=moduleCate",
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=cate_list_field",
           		data: {'cate':_cate,'id':_id,'cate_name':_cate_name ,[csrf_token] : csrf_hash },
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=cate_field",
                type: "POST",
                data: {'cate':_cate, [csrf_token]:csrf_hash },
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
                        
            //渲染采集字段存储
            let collectionFieldArr = applycollectionField();
            let collectionFieldSelect_html = ""; //生成采集字段的select option html节点存储
            if( collectionFieldArr.length > 0 ){
                for(let i=0; i<collectionFieldArr.length; i++){
                    let item = collectionFieldArr[i];
                    if(item.state == 1){
                        collectionFieldSelect_html += '<option value="'+item.field+'"> '+item.text+' </option>'
                    }
                }
            }
                        
            let ColumnFieldhtml = ""
            let table_trArr = [];
                ColumnFieldhtml += '<option value="">选择字段</option>'; //默认添加空，请选择字段
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
                          html +=  '<option selected="selected" value="">选择字段</option>';
                    }else{
                          html += '<option value="'+item.fieldname+'"> '+item.name+' </option>'; 
                    }
                }
                return html
           }
        //测试工具弹框
        function testTools(){
             let list_url_data = $(`[name='data[run_method][Basic][list_url]']`).val(); 
             
             if( !list_url_data ){
                 layer.alert('采集目标URL不能为空',{icon: 2,title:'提示'});    
                //showTipmodal('采集目标URL不能为空');
                return
             }    

             //提交表单测试 
              /*$.ajax({
                type: "POST",dataType:"json",
                url:"/{SELF}?s=Puyicaiji&c=api&m=moduleCate",
           		data: {'cate':cate,{csrf_token()}: "{csrf_hash()}"},
              })*/
             
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

        function select_cate(obj){
        	var cate = obj.options[obj.options.selectedIndex].value;
        	var html = '';
     
            $.ajax({
                type: "POST",dataType:"json",
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=moduleCate",
           		data: {'cate':cate, [csrf_token]:csrf_hash },
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
				 	html = `<!--采集目标URL--> 
				 	        <div class="form-group " id="dr_row_name">
				 	            <label class="col-md-2 control-label">采集目标URL</label>
				 	            <div class="col-md-9">
				 	            <label>
				 	               <textarea class="form-control list_url" style="height: 116px; width: 570px; margin: 0px;" name="data[list_url]"></textarea>
				 	            </label>
				 	            <span class="help-block" id="dr_name_tips">填入你要采集的url栏目,可多个url,如:</br>http://www.baidu.com/list1/sssss.html</br>http://www.puyi.com/list2/wssss.html </span>
				 	           </div>
				 	         </div>
				 	         <!--URL特征码-->
				 	         <div class="form-group " id="dr_row_name">
				 	             <label class="col-md-2 control-label">URL特征码</label>
				 	            <div class="col-md-9">
				 	               <label>
				 	                  <textarea class="form-control list_rule" style="height: 116px; width: 570px; margin: 0px;" name="data[list_rule]"></textarea>
				 	             </label>
    				 	               <span class="help-block" id="dr_name_tips">提示: 为了更方便识别精准您需要的URL,请您输入你要提取类型URL：</br>/list1/</br>/list2/</br>那么就填入: list/或者 list/20201 即可</br>您也可以选择不填入</br>注:每行的规则匹配上面换行的对应URL，否则会进入自动匹配规则
    				 	               </span>
				 	               </div>
				 	            </div>
				 	         
				 	              </div>`
				 	$('.data_html').html(html);
				 }
				 if(obj.selectedIndex == '1'){
				 	//html = '嘿嘿';//'<div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">采集目标URL</label><div class="col-md-9"><label><textarea class="form-control " style="height: 116px; width: 570px; margin: 0px;" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">填入你要采集的url栏目</span></div></div><div class="form-group " id="dr_row_name"><label class="col-md-2 control-label">URL特征码</label><div class="col-md-9"><label><textarea class="form-control " style="height:90px" name="system[setting][seo][list_title]"></textarea></label><span class="help-block" id="dr_name_tips">为了更好精确识别,请填入需要采集内容地址特征如:<br>list/20201/111.html 那么就填入 list/20201/ 即可</span></div></div>'
				 	html = `
    				 	    <div class="form-group">
                                <label class="col-md-2 control-label">json地址</label>
                                <div class="col-md-9">
                                    <label>   
                                         <!--<input class="form-control input-large"  type="text" name="data[json_url]"  value="" placeholder="json地址">-->
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
                                    
                                    <span class="help-block">参数替换的提示语xxxxx</span>
                                </div>
                            </div>
                            
                             <!--callback前字串-->
                            <div class="form-group">
                                <label class="col-md-2 control-label">callback前后字串</label>
                                <div class="col-md-9">
                                    <label>   
                                        <input class="form-control input-large" id="json_callback" style="width:180px!important" type="text" name="data[json_callback]"  value="" placeholder="callback前字串">
                                    </label>
                                      <!--label>   
                                    <input class="form-control input-large" style="width:180px!important" type="text" name="data[json_callback]"  value="" placeholder="callback后字串">
                                    </label--!>
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
                            </div>
                            `;
                            
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
        //var itemValue1 = {'selectedIndex':'1'}
        selectOnchang(itemValue1);


//---------------------------------采集模式==>自动化模式业务-----------------------------------

//自动化模式 添加自定义规则

//删除
function DeleteItemRules(_this){
    $(_this).parents('.rules-item').remove();
    
    if( $('.add-rules-centent .rules-item').length == 0 ){
        $('.add-rules-centent').hide(200);
    }else{
        //删除后重新排序 name name
        $('.add-rules-centent .rules-item').each( (index,item)=>{
             $(item).find('.rules_name select').attr('name',`data[Basic][rules_name][${index}]`);
             $(item).find('.rules_value input').attr('name',`data[Basic][rules_value][${index}]`);
        });
    }
}
//添加规则  备注：2021-02-24 添加规则 作废
/*function AddRulesItem(){
    let Item_node = `<div class="rules-item">
    
        <div class="item-content rules_name">  
            <input class="form-control" style="width:180px" type="text" name="data[Basic][rules_name]" value="" title="规则" placeholder="自定义名称">
        </div>
     
        <div class="item-content rules_value">  
            <input class="form-control" style="width:200px" type="text" name="data[Basic][rules_value]" value="" title="规则" placeholder="自定义值">
        </div>
        
        <div class="item-content select-inputbox">  
             <select style="width:160px" class="form-control" name="data[Basic][rules_selectInputbox] onchange="">
                    <option selected="" value="">请选择输入框</option>
                    <option value="1">text</option>
                    <option value="2">input</option>
             </select>
        </div>
        
        <div class="item-content select-Group">  
             <select style="width:160px" class="form-control" name="data[Basic][rules_selectGroup] onchange="">
                    <!--<option selected="" value="">请选择组合</option>-->
                    <option value="1" selected>不组合</option>
                    <option value="2">组合</option>
             </select>
        </div>
        
        <div class="item-delbtn item-content"> 
            <a href="javascript:void(0);" class="btn btn-sm red" onclick="DeleteItemRules(this)"> 
                <i class="fa fa-trash"></i> 删除
            </a>
        </div>
    </div>`;
    
    $('.Puyicaiji-Add-rules .add-rules-centent').append(Item_node);
    $('.add-rules-centent').show();
    
    //设置 name
    $('.add-rules-centent .rules-item').each( (index,item)=>{
         $(item).find('.rules_name select').attr('name',`data[Basic][rules_name][${index}]`);
         $(item).find('.rules_value input').attr('name',`data[Basic][rules_value][${index}]`);
    });
}
*/
//同步规则
function SyncRules(){ 
    $('#Sync_Modal').modal('show');
    
}
//确定选择同步的方案
function ComMitSyncRules(){
    
    let rulesArr = [];
    $('.Puyicaiji-Add-rules .add-rules-centent .rules-item').each( (index,item)=>{
        rulesArr.push({
            rules_name: $(item).find('.rules_name input').val(),
            rules_value: $(item).find('.rules_value input').val(),
            rules_selectInputbox: $(item).find('.select-inputbox select option:selected').val(),
            rules_selectGroup: $(item).find('.select-Group select option:selected').val()
        })

    });
    
    let value = $('#Sync_Modal .modal-body select option:selected').val();
    selectScheme_getObj.selectValue = value;
    
    if(value){
        if( rulesArr.length > 0 ){
            edit_selectScheme(rulesArr);
            $('#Sync_Modal').modal('hide');
        }else{
            layer.msg('您还未填写规则呢，不能同步');   
        }
    }else{
        //layer.msg('未能获取到方案选择框的id值');
        layer.msg('请选择方案！');
    }

    //$('#Sync_Modal').modal('hide');
}


//点击“获取”按钮，获取结果，渲染获取结果项
function getResultFunc(_this){
    //  if( !$("#putData-column option:selected").val() ){
    //      layer.msg('请先选择入库栏目，再点击“获取”');  
    //      return
    //  }

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
                selectOptionChild: $(item).find('.son-select select').val() 
            }); 
        
     });
     console.log( replace_paramsArr );
     $(_this).button('loading');//禁用按钮并显示提交中 
     layer.load();
     //开始加载内容
     var data = new Array()
     var json_url =  $('#jsonAddress').val().trim(); 
     var callback =  $('#json_callback').val(); 
    
	 $.ajax({
    	    type: "POST",
    	    dataType:"json",
    	    url:"/"+SELF+"?s=Puyicaiji&c=api&m=jsonTest",
    		data: {'data[url]':json_url,'data[replace_paramsArr]':replace_paramsArr,'data[callback]':callback,[csrf_token]:csrf_hash },
    	    success: function(res) {
    	    	if(res.code){
    	    	            
    	    	    let resdata = res.data; 
    	    	    let Processed_data = recuObj(resdata); //处理数据
    	            showTreeData(Processed_data); //渲染获取结果===>显示字段树形
    	            
    	    	}else{
    	    	    //res.msg
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
               if( _Obj[k] instanceof Object || ( _Obj[k] instanceof Array) ){
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
	   
	           //let Select_CorrespondField = showRenderCorrespondField(globalSelect_cate);
	
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
                               <select class="form-control CorrespondField-select" style="display:inline-block;width:auto">
                                     <option selected="" value="">请选择</option>
                                     <option value="1"> 我是别的选择</option>
                                     <option value="2"> 自定义</option>
                                </select>
                            </div>
                        `;
                        
                        if( obj.checked ){
                            $(obj.elem).find('.layui-tree-main').append(CorrespondField_ELement);
                            $(obj.elem).find('.layui-tree-main').addClass('border-active');
                            
                            $(obj.elem).find('.layui-tree-main .CorrespondField-box .CorrespondField-select').change( (e) => {
                                
                                let val = $(e.target).val();
                                
                                if( val == '2'){
                                    //新增功能 自定义输入 input功能 select功能
                                    let input_select_element = `    
                                        <div class="Addelement"> 
                                           <span style="margin-left:10px"><input class="form-control" style="width:120px;display:inline-block;" type="text" name="" value="" title="自定义值" placeholder="自定义值"></span>  
                                           <span style="margin-left:10px">
                                                <select class="form-control" style="display:inline-block;width:auto">
                                                     <option selected="" value="">请选择</option>
                                                     <option value="1">选项1</option>
                                                     <option value="2">选项2</option>
                                                     <option value="3">选项3</option>
                                                     <option value="4">选项4</option>
                                                </select>
                                           </span>
                                       </div>
                                      `; 
 
                                    //
                                    $(e.target).parents('.CorrespondField-box').append(input_select_element);
                                }else{
                                      $(e.target).parents('.CorrespondField-box').find('.Addelement').remove();
                                }
                            });
                            
                        }else{
                            $(obj.elem).find('.layui-tree-main .CorrespondField-box').remove();
                            $(obj.elem).find('.layui-tree-main').removeClass('border-active');
                        }
                        
                        //获取数据
                        //Post_Tree_CorrespondField_data();
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
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=cate_field",
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
            <input class="form-control" style="width:100px" type="text" name="data[Param_xxxx]" value="" title="参数" placeholder="参数">
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
        if( item.val === _val && item.model){
            
         //判断是否显示 替换值input        
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

//---------------------------------华丽分割线--------------------------------------

$(".test_data").click(function(){
    
   
    let selectUrlradio = $('#myModal .selectUrl-box .mt-radio-inline .mt-radio input[name="selecturl"]:checked').val();
    
    if(!selectUrlradio ){
        layer.msg('您还没选择目标URL');
        return
    }
	var list_rule_data = $(".list_rule").val();
	var list_url_data = 'http://'+selectUrlradio;
	var list_rule_section_data = $(".list_rule_section").val();

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
            url:"/"+SELF+"?s=Puyicaiji&c=home&m=collectListAdd",
            data: {form:formData ,datas, [csrf_token] :csrf_hash },
            dataType:"json",
            beforeSend:function (){
                    $('.data_json_url .list-content').html('');
					showModal();
			},
            success:function(data){
            hideModal();
               if(data.code == 0){
               		dr_tips(1, data.msg);
               		return ;
               }
               if(data.code == 1){
               	var arr = data.msg
               	html = '';
				$.each(arr, function(i, item){     
				   html += '<div class="list-li"><div class="list-li-content">'+item+'</div><div class="list-li-button"><button type="button" data-loading-text="Loading..." class="getContent-btn btn btn-danger btn-sm"  onclick="clickButton(\''+item+'\','+i+',this)">读取内容</button></div></div>'    
				});  
				
               	$('.data_json_url .list-content').html(html);
               	$('#myModal .selectUrl-box').hide();//隐藏选择目标Url
               }

            },
            error:function(jqXHR){
            	hideModal()
                console.log(jqXHR);
            }
        });
});


let $getContentBtn = $('.getContent-btn')
function clickButton(urls,_index,_this){ //测试文章模块

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
            url:"/"+SELF+"?s=Puyicaiji&c=home&m="+models_models+"&models="+models,
            data: {datas,[csrf_token]:csrf_hash},
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
                
                
               /* Object.keys(backData).forEach((key,index) => {
                      tbodyHtml += `
                            <tr>
                                <td>` + key + `</td>
                                <td>`+backData[key]+`</td>
                            </tr>
                        `;
                    if(key == 'html'){
                        tbodyHtml += `
                            <tr>
                                <td>` + key + `</td>
                                <td><button type="button" class="btn btn-danger btn-sm" onclick="openNewPages('`+backData['url']+`')">运行HTML</button></td>
                            </tr>
                        `
                        previewhtmlData.html = backData[key];
                        previewhtmlData.title = backData['title'];
                    }else if(key == 'meta_data'){
                        if(backData[key]){
                            tbodyHtml += `
                                <tr>
                                    <td>` + key + `_description</td>
                                    <td>`+backData[key].description+`</td>
                                </tr>
                                <tr>
                                    <td>` + key + `_keywords</td>
                                    <td>`+backData[key].keywords+`</td>
                                </tr>
                                <tr>
                                    <td>` + key + `_viewport</td>
                                    <td>`+backData[key].viewport+`</td>
                                </tr>
                            `
                        }else{
                            tbodyHtml += `
                                <tr>
                                    <td>` + key + `</td>
                                    <td>` + backData[key] + `</td>
                                </tr>
                            `
                        }
                        
                    }else{
                        tbodyHtml += `
                            <tr>
                                <td>` + key + `</td>
                                <td>` + backData[key] + `</td>
                            </tr>
                        `
                    }
                })*/
                 
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
                    </table>`;
                 
                //$('.getContent-btn').button('reset'); //关闭读取内容按钮 loading
                //$('.test_data').removeAttr("disabled");
                $('#caiji-result').append(resultHtml);
               
                $('#result-modal').modal('show')
                
            },
            error:function(jqXHR){
            	// hideModal()
                console.log(jqXHR);
               /*$('.getContent-btn').button('reset'); //关闭读取内容按钮 loading
               $('.test_data').removeAttr("disabled");*/
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
             var list_url_data = $(`[name='data[run_method][Basic][list_url]']`).val();
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
