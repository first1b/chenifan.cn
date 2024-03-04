 
    //运行测试
    function ClickRunTest(_this){

        $(_this).addClass('disabled');
        layer.load();          
        
        setTimeout(()=> {
            $(_this).removeClass('disabled');
            layer.closeAll('loading');
            layer.msg('测试完成,出结果');
          
            $('#results-extraction-val').val('我是提取结果的内容，史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人');
            $('#original-content-val').val('我是api返回原始内容，斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）');
           
        }, 3000);       
     
    }
  
  
  //点击搜索列表
  function clickSearch(){
     let keyVal =  $('#search-val').val();
     layer.load();  
     setTimeout(()=> {
         layer.closeAll('loading');  
     },1000);
      
  }

 //删除列表项tr 
    function delete_item(_this){
        layer.open({
          title: '是否删除当前方案'
          ,//content:_tiptext,
          btnAlign: 'c',
           btn: ['删除', '取消'],
           btn1:()=>{
               
                $(_this).closest('tr').remove(); //删除当前行 
                layer.closeAll(); 
                //进行删除请求对接
                /*let postLoading = layer.load();
                 $.ajax({
                    type: "POST",dataType:"json",
                    url:"/{SELF}?s=Puyicaiji&c=api&m=formula&field_model=f_field_del",
               		data: {'fidld_data_id':_id,{csrf_token()}: "{csrf_hash()}"},
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
    		     });*/
           }
        });    
        
    }
    
    
    //运行测试
    function runTest(){
        /*layer.open({
          title: '是否执行测试？'
          ,//content:_tiptext,
          btnAlign: 'c',
           btn: ['确定', '取消'],
           btn1:()=>{
                //layer.msg('正在进行测试。。。，开发中');//提示 
                
                $('#runTest-modal').modal('show'); 
           }
        });
        */
        
        //先初始化数据
        $('#runTest-content-val').val('');
        $('#results-extraction-val').val('');
        $('#original-content-val').val('');
        
         $('#runTest-modal').modal('show'); 
    }
    
    
    //添加分类 弹框
    let edit_category_falg = false;
    let edit_category_id = "";

    function addcategory(){
        
        $('#API-name').val('');
        $('#API-address').val('');
        
        $('#addcategory-modal').modal('show');
    	$('#addcategory-title').text('添加分类');
        	
        //区别提交的时候，新建还是编辑。
        edit_category_falg = false;    
    }
    
    //编辑分类弹框
    function edit_item(_this,_id){
        edit_category_id = _id;
        let APIname_val =  $(_this).closest('tr').find('td').eq(1).text();
        let APIaddress_val =  $(_this).closest('tr').find('td').eq(2).text();
         
        $('#API-name').val(APIname_val);
        $('#API-address').val(APIaddress_val);
        
        $('#addcategory-modal').modal('show');
    	$('#addcategory-title').text('编辑分类');
        edit_category_falg = true;  
        
    }
    
    //提交分类框 确定提交
    function submitcategoryFun(){
         let postObj={};
       
         if( !$('#API-name').val() ){
             layer.alert('API名称不能为空',{icon: 2,title:'提示'});  
             return
         } 
         if( !$('#API-address').val() ){
             layer.alert('API地址不能为空',{icon: 2,title:'提示'});  
             return
         }  
         
         postObj.API_name =  $('#API-name').val();
         postObj.API_address = $('#API-address').val();
         postObj.id = 66;
         
         if( edit_category_falg == false ){
            //添加分类提交
                //假设提交成功。渲染更新表格数据
                let tr_element = `
                   <tr class="item-${postObj.id}">
                     <td>${postObj.id}</td>
                     <td>${postObj.API_name}</td>
                     <td>${postObj.API_address}</td>
                     <td>2020-12-16 14:30</td>
                     <td style="overflow:visible">
                            <label><a href="javascript:void(0)" onclick="runTest('${postObj.id}')" class="btn btn-xs btn-primary">测试</a></label>
                            <label><a href="javascript:void(0)" onclick="edit_item(this,'${postObj.id}')" class="btn btn-xs green"><i class="fa fa-edit"></i> 修改</a></label>
                            <label><a href="javascript:void(0)" onclick="delete_item(this,'${postObj.id}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a></label>
                     </td>  
                  </tr>    
                `
                $('#apiManager-table tbody').append(tr_element);
                $("#addcategory-modal").modal('hide');  //关闭弹框 
                layer.msg('成功添加分类');//提示 
            
         }else{
            //编辑分类的提交 
            //编辑的id edit_category_id
             
             $('#apiManager-table tbody .item-'+edit_category_id).find('td').eq(1).text(postObj.API_name);
             $('#apiManager-table tbody .item-'+edit_category_id).find('td').eq(2).text(postObj.API_address);
             
             $("#addcategory-modal").modal('hide');  //关闭弹框 
             layer.msg('数据修改成功');//提示 
             
         }     
        
    }
       //关闭方案模态框
    $('#addcategory-modal').on('hidden.bs.modal', function (e) {
        //把数据清除
        //CleardataInit();
    });
    