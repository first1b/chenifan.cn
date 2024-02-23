/***
 * 
 * 
 * 新增功能
 *    新增，编辑。方案模块。
 *    添加自定义字段。
 * 
 * */
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
 
//---------------------------添加自定义字段end------------------------------------------   
   
    let selectScheme_getObj = {};
    let model_cate = '';//存储 用于 栏目选中，渲染栏目字段。
    let edit_selectScheme_falg = false;

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
    });
    
    
    
    //删除方案
    function delete_selectScheme(_this,_id,_tiptext){
        layer.open({
          title: '是否删除当前方案'
          ,content:_tiptext,
          btnAlign: 'c',
           btn: ['删除', '取消'],
           btn1:()=>{
                //进行删除请求对接
                let postLoading = layer.load();
                 $.ajax({
                    type: "POST",dataType:"json",
                    url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_del",
               		data: {'fidld_data_id':_id, [csrf_token] :csrf_hash},
    	            success: function(json) {
    	            	if(json.code){ 
        	            	 layer.msg(json.msg);    //提示 
                            $(_this).closest('tr').remove(); //删除当前行 
                            
                            //删除成功了，渲染数据的总数-1;
                            //let total = new Number( $('.pagination li:first a').text().trim() );
                            if( $('.pagination li:first a').text().trim() ){
                                 
                                 let totalStr =  $('.pagination li:first a').text().trim();
                                 if( totalStr.indexOf('共') !== -1 && totalStr.indexOf('条') !== -1 ){
                                    let total = '共'+(new Number( totalStr.substring(totalStr.indexOf('共')+1,totalStr.indexOf('条') ) ) - 1 )+ '条';
                                    $('.pagination li:first a').text(total); 
                                 }    
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
    

        //编辑方案 当前行
        function edit_selectScheme(_id){ 	
            if( !_id){
                layer.msg('未能获取到方案选择框的id值');
                return
            }
            selectScheme_getObj.selectValue = _id;    
            //先获取编辑的数据
            let postLoadingAA = layer.load(); 
             $.ajax({
                type: "POST",dataType:"json",
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
           		data: {'edit':'Get_Data','fidld_data_id':_id,[csrf_token] :csrf_hash },
                success: function(json){
                	if(json.code){ 
                	       let data = JSON.parse(json.data);
                	       console.log('获取到的编辑数据',data)
    	            	   Edit_applySchemeData(data);
    	            	   $('#Newscheme-modal').modal('show');
                	}else{
                	    layer.alert(json.msg,{icon:2,title:'提示'});
                	}
                	layer.close(postLoadingAA);  
                },
                 error: function(HttpRequest, ajaxOptions, thrownError){
                    layer.alert(HttpRequest,{icon: 2,title:'报错提示'});
                    layer.close(postLoadingAA);  
                }
    	     });
        }
    
        //渲染编辑模式下的， 编辑方案的框的数据
        function Edit_applySchemeData(data){
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
            if( tableArr && tableArr.length > 0 ){  
                $("#Newscheme-table tbody tr").each((index,item)=>{
                    $(item).find(`.collection-field option[value='`+tableArr[index].collection_field.value+`']`).attr("selected",true);
                    $(item).find(`.branch-topics option[value='`+tableArr[index].branch_topics.value+`']`).attr("selected",true);
                });
            }else{
                
            }
            edit_selectScheme_falg = true; //编辑方案 标志，区别于 是新建方案还是编辑方案
            
            //数据赋值完毕，弹出修改框编辑方案 
            $('#Newscheme-modal').modal('show');
        }
        
       //渲染右侧栏目选择框的数据，新建方案和编辑方案的复用渲染。
        function Applystoragecolumn_cate(_cate){
            let html = '';
              $.ajax({
                type: "POST",dataType:"json",
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=moduleCate",
           		data: {'cate':_cate, [csrf_token] :csrf_hash },
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
        
        function storagecolumn_onchange(obj){ //edit_cate 编辑模式下的获取 
            var cate = obj.options[obj.options.selectedIndex].value;
            model_cate = cate; //获取模型 用于栏目
            Applystoragecolumn_cate(cate);
        }
        
        //根据select栏目 请求渲染栏目字段 select控件 （表格）
        function ajaxColumnField(_cate,_id,_cate_name){
                $.ajax({
                type: "POST",dataType:"json",
                url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=cate_list_field",
           		data: {'cate':_cate,'id':_id,'cate_name':_cate_name , [csrf_token] :csrf_hash },
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
                data: {'cate':_cate, [csrf_token] :csrf_hash },
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
                       ColumnFieldhtml +='<option value="'+item.fieldname+'"> '+item.name+' </option>';
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
                             </tr> `     
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
      //确定提交修改方案
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
             postObj.selectArr = selectArr;
            /**
              * 检测selectArr 采集字段 和 栏目字段 是否重复，重复不能提交。
              * 
              **/
                  /**
              * 检测selectArr 采集字段 和 栏目字段 是否重复，重复不能提交。
              * 
              **/
              /*业务调整==>判断条件，屏蔽。  
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
              
             //判断是新建方案 还是编辑方案  edit_selectScheme_falg
             let postLoading = layer.load(); 
             $(_this).button('loading');
             if( !edit_selectScheme_falg ){
                //新建方案提交
                 $.ajax({
                        type: "POST",dataType:"json",
                        url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_save",
                   		data: {'fidld_data':postObj, [csrf_token] :csrf_hash},
        	            success: function(json) {
        	            	if(json.code){ 
        	            	   layer.msg(json.msg); //提示 
        	            	  
        	            	  //异步渲染 外面的表格方案
        	            	   applyAddDatatr(json.data,postObj);
        	            	   
        	                   $("#Newscheme-modal").modal('hide');  //关闭弹框 
        	            	   CleardataInit();//数据初始化html  
        	            
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
                //方案编辑提交
                let _id = selectScheme_getObj.selectValue;
                $.ajax({
                    type: "POST",dataType:"json",
                    url:"/"+SELF+"?s=Puyicaiji&c=api&m=formula&field_model=f_field_edit",
               		data: {'edit':'Update_Data','fidld_data_id':_id,'fidld_data':postObj, [csrf_token] :csrf_hash},
    	            success: function(json) {
    	                 console.log(json,'编辑模式提交')
    	            	if(json.code){ 
    	            	    layer.msg(json.msg);   //提示 
    	            	   $('#Newscheme-modal .submit-scheme').button('reset') //关闭按钮 loading
    	                   $("#Newscheme-modal").modal('hide');  //关闭弹框 
    	            	   CleardataInit();    //数据初始化html  
    	            	   //异步渲染表格 当前行数据
    	            	   applyTrFun(_id,postObj);
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
        /**
         *时间格式化   let date = new Date();
         *             dateFormat("YYYY-mm-dd HH:MM:", date);
         */
        function dateFormat(fmt, date) {
            let ret;
            const opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        }
 
       //渲染成功添加方案的表格行    
        function applyAddDatatr(resdata,postdata){
            let getTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date() );//获取当前日期时间。
            let trHtml = `<tr class="odd gradeX dataId-${resdata.id}" id="dr_row_70">
                        <td class="id-td">${resdata.id}</td>
                        <td class="scheme_name-td">${resdata.schemeName}</td>
                        <td>
                            ${postdata.IsScheme_status ?`<span class="label label-sm label-warning">已开启</span>`: `<span class="label label-sm label-danger">已关闭</span>`}
						</td>
                        <td>${postdata.storageColumn.value}-${postdata.storageColumn_cate.text}</td>
                        <td><font>${getTime}</font></td>
                        <td style="overflow:visible">
     
                            <label><a href="javascript:void(0)" onclick="edit_selectScheme(${resdata.id})" class="btn btn-xs green"><i class="fa fa-edit"></i> 修改</a></label>
                           <label><a href="javascript:void(0)" onclick="delete_selectScheme(this,${resdata.id},'${resdata.schemeName}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a></label>
                        </td>
                </tr>`
            $('#scheme-table tbody').prepend(trHtml);
        } 
        
        //修改成功异步渲染当前行数据
        function applyTrFun(_id,_data){
            let getTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date() );//获取当前日期时间。
            $('.dataId-'+_id).find('td').each( (index,item)=>{
                if( index == 0){
                    $(item).text(_id);
                }
                if( index == 1){ //方案名
                      $(item).text(_data.schemeName); //方案名    
                }
                if( index == 2){ //方案状态
                     if( _data.IsScheme_status ){
                         $(item).html(`<span class="label label-sm label-warning">已开启</span>`);
                     }else{
                         $(item).html(`<span class="label label-sm label-danger">已关闭</span>`);
                     }
                }
                if( index == 3){
                    //栏目模型字段选择_data.storageColumn_cate
                    let tempTip = _data.storageColumn.text+"-"+_data.storageColumn_cate.text;
                    $(item).html(tempTip);
                }
                if( index == 4){ //当前日期时间
                    $(item).text(getTime);
                }
                            
            });
        }
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