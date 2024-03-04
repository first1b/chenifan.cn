


//词类
const speechArr = [
        {name:'地区', child:['北京','天津','河北','石家庄','唐山','秦皇岛','邯郸' ] },
        {name:'产品名称', child:[] },
        {name:'通用形容词', child:['超节能','环保','最新','自制','专业','著名','免检','进口','微型','最省钱' ] },
        {name:'使用场景', child:['学校','酒店','工厂','高校'] },
        {name:'适用范围', child:['工业用','民用','生活用','家用','商用','家用电器'] },
        {name:'产品维保', child:['维修','检修','检验','鉴定','保修','修理','修补','保养','清洗','清理','清扫','维护'] },
        {name:'产品动词', child:['销售','买','看','租','报价','采购','投资','设计','促销','检测','推广','使用'] },
        {name:'产品名词', child:['参数','价格','技术','系列','寿命','种类','类型','分类','功能','厂家','商家','单位','企业','前景','费用','趋势','好处','地址'] },
    ];

let tempElement = `<label class="checkbox-inline margin_r_10">
                    <input type="checkbox" checked='checked' onchange="menusChange(this)" value="全部"><span>全部<span> 
                </label>
                 <span class="c-line margin_r_10"></span>
                `;

let wordGroupHtml = ""; 

speechArr.forEach( (item,index)=>{
tempElement += `<label class="checkbox-inline">
                    <input type="checkbox" checked='checked' value="${item.name}" onchange="menusChange(this)"><span>${item.name}<span> 
                </label>
                `;
                
 wordGroupHtml += `<div class="word-group-item">  
                        <div class="word-group-tit word-group-top">
                            <span class="group-txt">${item.name}</span>
                            <span style="margin-right:10px;"> 
                                <i class="fa fa-edit" aria-hidden="true" onclick="EditCardData(this,1)"></i>
                                <i class="fa fa-trash" aria-hidden="true" title="点击删除该词类" onclick="DeleteCard(this)"></i>
                            </span>    
                       </div>
                        <ul class="word-group-list">
                            ${renderLI(item.child)}
                        </ul>
                         <div class="add-batch">
                                <a href="javascript:;" class="js-add-word" onclick="batchAdd(this)" ><i class="fa fa-plus"></i>批量添加</a>
                                <a href="javascript:;" class="js-clear-list" title="点击清空该词类的全部关键词" onclick="clearData(this)" >清空</a>
                        </div>
                </div>    
                `                  
});

$('.speech-selectCheckbox').html(tempElement);

//词类  chebox 监听
function menusChange(_this){
    
    let value = $(_this).val();
    let itemObj = {};
    if( $(_this).is(':checked') ){
        
        $('.speech-list-content .tip-text').remove();
        
        if( value == "全部"){
            let element = "";
            
            speechArr.forEach( (item,index)=>{
                element+= `<div class="word-group-item">  
                    <div class="word-group-tit word-group-top">
                        <span class="group-txt">${item.name}</span>
                        <span style="margin-right:10px;"> 
                            <i class="fa fa-edit" aria-hidden="true" onclick="EditCardData(this,1)"></i>
                            <i class="fa fa-trash" aria-hidden="true" title="点击删除该词类" onclick="DeleteCard(this)"></i>
                        </span>    
                   </div>
                    <ul class="word-group-list">
                        ${renderLI(item.child)}
                    </ul>
                    <div class="add-batch">
                            <a href="javascript:;" class="js-add-word" onclick="batchAdd(this)"><i class="fa fa-plus"></i>批量添加</a>
                            <a href="javascript:;" class="js-clear-list" title="点击清空该词类的全部关键词" onclick="clearData(this)">清空</a>
                    </div>
                </div>`;  
            });
            $('.speech-list-content').html(element);
        
            //全部勾选上
            $('.speech-selectCheckbox input').each( (index,item)=>{
                $(item).prop("checked",true);
            });  
            
            return
        }
        
        
        for(let i=0;i<speechArr.length;i++){
            let item = speechArr[i];
            if(item.name == value){
                itemObj = item;
                break;
            }
        }
        
        //添加卡片数据
        AddCardHtmlMethod(itemObj.name,itemObj.child);

    }else{
        //false
        
        if( value == "全部"){
            $('.speech-list-content').html(`<span class="tip-text"> 还未选择词类，请先选择需要的词类！</span>`);
            $('.speech-selectCheckbox input').each( (index,item)=>{
                $(item).removeAttr("checked");
            });
            return
        }
        
        
        $('.speech-list-content .word-group-item').each( (index,item)=>{
             if( $(item).find('.group-txt').text() == value ){
                 $(item).remove();
             }
        });
    }
    
}

function renderLI(_data) {
    let element = '';
    _data.forEach(item=>{
            element+=`<li> 
                    <label class="checkbox-inline">
                            <input type="checkbox" id="inlineCheckbox1" value="option1" checked='checked'>
                            <span class="name">${item}</span>
                    </label>
                    <span style="margin-right:10px;"> 
                    
                        <span  onclick="EditCardData(this,2)">
                             <i class="fa fa-edit"></i>
                        </span>  
                           
                        <span  onclick="deleteRow(this)">    
                            <i class="fa fa-trash"></i>
                        </span>      
                    </span> 
             </li>`;
    });
    return element;
}
//渲染词类，列表卡片。
$('.speech-list-content').html(wordGroupHtml);


//删除卡片
function DeleteCard(_this){
    let text = $(_this).parents('.word-group-item').find('.group-txt').text();

    //同步 chebox选项列表，删除
    $('.speech-selectCheckbox input').each( (index,item)=>{
            if( $(item).val() == text){
                $(item).parents('label').remove();
            }
    }); 
    //同步模拟数据 进行删除
    speechArr.forEach( (item,index)=>{
        if(item.name == text){
            speechArr.splice(index,1);
        }         
    });
    $(_this).parents('.word-group-item').remove();
}
//删除行
function deleteRow(_this){
    let title = $(_this).parents('li').find('.name').text();
    //同步模拟数据 进行删除 
    speechArr.forEach( (item,index)=>{
            if( item.child instanceof Array && item.child.length > 0 ){   
                for(let i=0;i<item.child.length; i++){
                    let childItem = item.child[i];
                    if( childItem == title){
                        item.child.splice(i,1);
                        break;
                    }
                }
            }    
    });
    //删除li行 节点
    $(_this).parents('li').remove();
    console.log(speechArr)
}

//"清空" 数据
function clearData(_this){
    $(_this).parents('.word-group-item').find('.word-group-list').html('');
    let title = $(_this).parents('.word-group-item').find('.group-txt').text();
    
    //同步模拟数据 进行清空
    speechArr.forEach( (item,index)=>{
        if(item.name == title){
           item.child = [];
        }         
    });
}

//-------------------词类-修改数据------------------
let targetElement;
let syncSelectCheckbox;
function EditCardData(_this,_num){
    let value;
    if( _num == 1 ){ 
        
        value = $(_this).parents('.word-group-item').find('.word-group-top .group-txt').text();
        targetElement = $(_this).parents('.word-group-item').find('.word-group-top .group-txt');
        $('.modal-header .modal-title').text('编辑词类');
        
        //全部勾选上
        $('.speech-selectCheckbox input').each( (index,item)=>{
                if( $(item).val() == value){
                    syncSelectCheckbox = $(item).parents('label').find('span');
                }
        });  
        
    }else{
        value = $(_this).parents('li').find('.checkbox-inline .name').text();
        targetElement = $(_this).parents('li').find('.checkbox-inline .name');
        $('.modal-header .modal-title').text('编辑关键词');
    }
    
    $('#speech_Modal .Modal-content input').val(value);
    $('#speech_Modal').modal('show');
    
}
//提交修改
function CommitEdit(){
    let EditnewVal = $('#speech_Modal .Modal-content input').val();
    
    if(syncSelectCheckbox) syncSelectCheckbox.text(EditnewVal);
     
    targetElement.text( EditnewVal );
    
    $('#speech_Modal').modal('hide'); 
}


//添加“添加新词类”按钮
function AddNewwordclass(){
    
    $('#Add_speech_Modal').modal('show');
}

//确定提交添加新词词类
function CommitNewwordclass(){
    
    let speechInput = $(".Add-speech_Modal-content .item input").val(); //词类名
    let dataArr =  removeArrEmpty( $(".Add-speech_Modal-content .item textarea").val().split(/[(\r\n)\r\n]+/) ); //子项关键词Arr
    if( !speechInput ){
        layer.msg('词类名不能为空！'); 
        return
    }
    
    //删除无用的数组元素
    function removeArrEmpty(_Arr){
        let tempArr = _Arr;
        if(tempArr instanceof Array && tempArr.length > 0 ){
             for(let i=0; i<tempArr.length;i++){
                 if( !tempArr[i] ){
                     tempArr.splice(i,1);
                 }
             }
        }
        return tempArr;
    } 
    
    //渲染节点
    AddCardHtmlMethod(speechInput,dataArr);
    
    //chebox选项列表 也要同步添加 
    let flag = false;
    $('.speech-selectCheckbox label span').each( (index,item)=>{
         if( speechInput == $(item).text()){
            flag =true; 
         }
    });
    if( flag === false ){
        $('.speech-selectCheckbox').append(`
               <label class="checkbox-inline">
                        <input type="checkbox" checked='checked' value="${speechInput}" onchange="menusChange(this)"><span>${speechInput}<span> 
               </label>
        `);
    }
    
    //模拟同步数组，
    speechArr.push({ name:speechInput, child:dataArr });
    layer.msg('成功添加新词类');
    
    //成功添加后，初始化弹出框input textarea控件
    $(".Add-speech_Modal-content .item input").val("");
    $(".Add-speech_Modal-content .item textarea").val("");
    
    //隐藏弹出框    
    $('#Add_speech_Modal').modal('hide');
}

//添加“添加新词类”数据的渲染节点
function AddCardHtmlMethod(_name, _childArr){
       $('.speech-list-content').append(`<div 
                class="word-group-item">  
                <div class="word-group-tit word-group-top">
                    <span class="group-txt">${_name}</span>
                    <span style="margin-right:10px;"> 
                        <i class="fa fa-edit" aria-hidden="true" onclick="EditCardData(this,1)"></i>
                        <i class="fa fa-trash" aria-hidden="true" title="点击删除该词类" onclick="DeleteCard(this)"></i>
                    </span>    
               </div>
                <ul class="word-group-list">
                    ${renderLI(_childArr)}
                </ul>
                 <div class="add-batch">
                        <a class="js-add-word"  onclick="batchAdd(this)"><i class="fa fa-plus"></i>批量添加</a>
                        <a href="javascript:;" class="js-clear-list" title="点击清空该词类的全部关键词" onclick="clearData(this)" >清空</a>
                </div>
            </div>`);    
    
    //渲染子项关键词Arr 节点
    function renderLI(_data){
        let element = '';
        _data.forEach(item=>{
                element+=`<li> 
                        <label class="checkbox-inline">
                               <input type="checkbox" id="inlineCheckbox1" value="option1" checked='checked'>
                                <span class="name">${item}</span>
                        </label>
                        <span style="margin-right:10px;"> 
                            <span  onclick="EditCardData(this,2)">
                                 <i class="fa fa-edit"></i>
                            </span>  
                               
                            <span  onclick="deleteRow(this)">    
                                <i class="fa fa-trash"></i>
                            </span>      
                        </span> 
                 </li>`;
        });
        return element;
    }
    
}

//卡片数据 “批量添加”关键字 按钮操作
//批量添加
let batchAdd_keywordItem_Node;
let wordgroupItem_Node;
function batchAdd(_this){
    batchAdd_keywordItem_Node = $(_this).parents('.word-group-item').find('.word-group-list');
    wordgroupItem_Node = $(_this).parents('.word-group-item');
    $('#batchAdd-keywordItem_Modal').modal('show');
}
//确定提交，“批量添加”关键字到卡片节点
function CommitBatchAddkeywordItem(){
    let dataArr = removeArrEmpty( $('#batchAdd-keywordItem_Modal .keywordItem-content textarea').val().split(/[(\r\n)\r\n]+/) );//处理换行成数组,删除无用数组元素
    //删除无用的数组元素
    function removeArrEmpty(_Arr){
        let tempArr = _Arr;
        if(tempArr instanceof Array && tempArr.length > 0 ){
             for(let i=0; i<tempArr.length;i++){
                 if( !tempArr[i] ){
                     tempArr.splice(i,1);
                 }
             }
        }
        return tempArr;
    }  
    
    //渲染数据
    let LiNode = ""; 
    dataArr.forEach(item=>{
        LiNode+=`<li> 
                    <label class="checkbox-inline">
                            <input type="checkbox" id="inlineCheckbox1" value="option1" checked="checked">
                            <span class="name">${item}</span>
                    </label>
                    <span style="margin-right:10px;"> 
                        <span onclick="EditCardData(this,2)">
                             <i class="fa fa-edit"></i>
                        </span>  
                        <span onclick="deleteRow(this)">    
                            <i class="fa fa-trash"></i>
                        </span>      
                    </span> 
                </li>`;
    });
    batchAdd_keywordItem_Node.prepend(LiNode);//从前面载入节点    

    layer.msg('成功批量添加关键词');
    
    //成功添加之后，模拟同步数组数据
    
    let wordTxte = wordgroupItem_Node.find('.group-txt').text();
        for(let i=0;i<speechArr.length; i++){
            let item = speechArr[i];
            if( item.name == wordTxte ){
                item.child.unshift(...dataArr);
                break;
            }
        }
    
    console.log(speechArr);
    
    //成功添加后，初始化textarea控件
    $('#batchAdd-keywordItem_Modal .keywordItem-content textarea').val("");

    //隐藏弹出框  
    $('#batchAdd-keywordItem_Modal').modal('hide'); 
}

//---------------------------------策略公式的处理-----------------------------------------


// 公式的表格 
const FormulaDataArr =[{"ruleid":2212,"rule":"[!--地区--]+[!--使用场景--]+使用哪种+[!--通用形容词--]+[!--产品名称--]","status":1,"tags":"标签","beautyrule":"<span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--使用场景--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">使用哪种<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":44040,"errMsg":""},{"ruleid":2211,"rule":"哪家+[!--通用形容词--]+[!--产品名称--]+好用？","status":1,"tags":"","beautyrule":"<span class=\"t-and\">哪家<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">好用？<\/span>","prenum":30,"errMsg":""},{"ruleid":2210,"rule":"[!--地区--]+[!--产品名称--]+ +[!--地区--]+[!--产品名称--]($1!=$3)","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\"> <\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-yel\">($1!=$3)<\/span>","prenum":1208898,"errMsg":""},{"ruleid":2209,"rule":"[!--适用范围--]+[!--使用场景--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--适用范围--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--使用场景--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":60,"errMsg":""},{"ruleid":2208,"rule":"[!--产品名称--]+[!--通用形容词--]+[!--产品名词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名词--]<\/span>","prenum":570,"errMsg":""},{"ruleid":2207,"rule":"[!--通用形容词--]+[!--产品名称--]+[!--产品名词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名词--]<\/span>","prenum":570,"errMsg":""},{"ruleid":2206,"rule":"[!--适用范围--]+[!--产品名称--]+[!--产品名词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--适用范围--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名词--]<\/span>","prenum":285,"errMsg":""},{"ruleid":2205,"rule":"[!--产品名称--]+及+[!--产品动词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">及<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品动词--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2204,"rule":"[!--产品名称--]+及+[!--产品名词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">及<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名词--]<\/span>","prenum":57,"errMsg":""},{"ruleid":2203,"rule":"[!--产品名称--]+的+[!--产品名词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">的<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名词--]<\/span>","prenum":57,"errMsg":""},{"ruleid":2202,"rule":"[!--产品名称--]+的+[!--产品动词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">的<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品动词--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2201,"rule":"[!--产品动词--]+[!--产品名称--]+[!--地区--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品动词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--地区--]<\/span>","prenum":13212,"errMsg":""},{"ruleid":2200,"rule":"[!--产品名称--]+的+[!--产品维保--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">的<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品维保--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2199,"rule":"[!--使用场景--]+的+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--使用场景--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">的<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":12,"errMsg":""},{"ruleid":2198,"rule":"[!--地区--]+[!--适用范围--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--适用范围--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":5505,"errMsg":""},{"ruleid":2197,"rule":"[!--地区--]+[!--产品维保--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品维保--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":13212,"errMsg":""},{"ruleid":2196,"rule":"[!--产品名称--]+[!--产品动词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品动词--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2195,"rule":"[!--产品名称--]+[!--产品维保--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品维保--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2194,"rule":"[!--适用范围--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--适用范围--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":15,"errMsg":""},{"ruleid":2193,"rule":"[!--通用形容词--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":30,"errMsg":""},{"ruleid":2192,"rule":"[!--使用场景--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--使用场景--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":12,"errMsg":""},{"ruleid":2191,"rule":"[!--地区--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--地区--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":1101,"errMsg":""},{"ruleid":2190,"rule":"怎么+[!--产品动词--]+[!--产品名称--]","status":1,"tags":"","beautyrule":"<span class=\"t-and\">怎么<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品动词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span>","prenum":36,"errMsg":""},{"ruleid":2189,"rule":"有+[!--产品名称--]+吗","status":1,"tags":"","beautyrule":"<span class=\"t-and\">有<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">吗<\/span>","prenum":3,"errMsg":""},{"ruleid":2188,"rule":"[!--产品名称--]+在哪","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">在哪<\/span>","prenum":3,"errMsg":""},{"ruleid":2187,"rule":"[!--产品名称--]+有哪些","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">有哪些<\/span>","prenum":3,"errMsg":""},{"ruleid":2186,"rule":"[!--产品名称--]+有几种","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">有几种<\/span>","prenum":3,"errMsg":""},{"ruleid":2185,"rule":"[!--产品名称--]+是什么","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">是什么<\/span>","prenum":3,"errMsg":""},{"ruleid":2184,"rule":"[!--产品名称--]+那家+[!--通用形容词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">那家<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span>","prenum":30,"errMsg":""},{"ruleid":2183,"rule":"[!--产品名称--]+哪里有","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">哪里有<\/span>","prenum":3,"errMsg":""},{"ruleid":2182,"rule":"[!--产品名称--]+哪里好","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">哪里好<\/span>","prenum":3,"errMsg":""},{"ruleid":2181,"rule":"[!--产品名称--]+哪家有","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">哪家有<\/span>","prenum":3,"errMsg":""},{"ruleid":2180,"rule":"[!--产品名称--]+哪家+[!--通用形容词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">哪家<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span>","prenum":30,"errMsg":""},{"ruleid":2179,"rule":"[!--产品名称--]+哪个+[!--通用形容词--]","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">哪个<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span>","prenum":30,"errMsg":""},{"ruleid":2178,"rule":"[!--产品名称--]+[!--通用形容词--]+不","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">不<\/span>","prenum":30,"errMsg":""},{"ruleid":2177,"rule":"[!--产品名称--]+[!--通用形容词--]+吗","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-tit\">[!--通用形容词--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">吗<\/span>","prenum":30,"errMsg":""},{"ruleid":2176,"rule":"[!--产品名称--]+分几种","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">分几种<\/span>","prenum":3,"errMsg":""},{"ruleid":2175,"rule":"[!--产品名称--]+分几类","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">分几类<\/span>","prenum":3,"errMsg":""},{"ruleid":2174,"rule":"[!--产品名称--]+多少钱","status":1,"tags":"","beautyrule":"<span class=\"t-tit\">[!--产品名称--]<\/span><span class=\"t-symbol\">+<\/span><span class=\"t-and\">多少钱<\/span>","prenum":3,"errMsg":""}];


console.log(FormulaDataArr);

//待选公式表格 和异常公式表格的切换
function switchRecordFun(_type){
    
    console.log(_type);    

}
//-----------------------------------------待选公式表格的处理--------------------------------------

//渲染数据，待选公式表格；
function rendererWaitTable(_data){
    if(_data instanceof Array){
        let Tr_node = "";   
        _data.forEach( (item,index)=>{
            Tr_node +=`<tr data-id="${item.ruleid}" class="tr-${item.ruleid}"> 
                            <td>
                                <label>
                                     <input type="checkbox" onchange="WaitTable_ItemCheckbox(this)" checked='checked' value="${true}"> 
                                </label>
                            </td>
                            <td>${item.beautyrule}</td>
                            <td class="align-center"><span class="label label-warning">${item.tags}</span></td>
                            <td class="align-center">${item.prenum}</td>
                            <td class="align-center">
                                 <label><a href="javascript:;" class="btn green btn-xs" onclick="Preview_Tr(this,${item.ruleid},${item.prenum})"><i class="fa fa-eye"></i> 预览</a></label>
                                 <label><a href="javascript:;" class="btn btn-xs blue" onclick="EditFormula(this,${item.ruleid},${index})"> <i class="fa fa-edit"></i>编辑</a></label>
                                 <label><a href="javascript:;" class="btn red btn-xs" onclick="DeleteWaitTable_Tr(this,${item.ruleid})"> <i class="fa fa-trash"></i> 删除</a> </label>
                            </td>
                      </tr>`;    
        });
       
       $('.chosenFormula-table table tbody').html(Tr_node);   
    }
    
       //渲染表格checkbox 选中的数量
    ComputedSelectCount();
}

rendererWaitTable(FormulaDataArr); 


//待选公式表格chebox的 全选 监听
function WaitTableCheckAll(_this){
    let flag = $(_this).is(':checked');
    
    if( flag ){ //选中
        $('.chosenFormula-table table tbody tr').each( (index,item)=>{
            let checkbox = $(item).find('td').eq(0).find('input');
            checkbox.prop("checked",true); //全部勾选上
        });
          
    }else{ //未选中
        $('.chosenFormula-table table tbody tr').each( (index,item)=>{
            let checkbox = $(item).find('td').eq(0).find('input');
            checkbox.prop("checked",false); //全部取消勾选
        });
    } 
    
     //渲染表格checkbox 选中的数量
   ComputedSelectCount();
}

//待选公式表格tr chebox的监听
function WaitTable_ItemCheckbox(_this){
    let flag = $(_this).is(':checked');
    let checkAll_Node = $('.chosenFormula-table table thead tr th').eq(0).find('input'); //表头chebox 节点
    if(flag){
           let IsCheckAllArr = [];
           let IsCheckAllFlag = true; //判断是否全部选中，全部选中，让表头chebox 选中。
           
           $('.chosenFormula-table table tbody tr').each( (index,item)=>{
                let checkbox = $(item).find('td').eq(0).find('input');
                IsCheckAllArr.push( checkbox.is(':checked') );
           });
           
           if( IsCheckAllArr.length > 0 ){
               for(let i=0; i<IsCheckAllArr.length; i++){
                    if(!IsCheckAllArr[i]){
                       IsCheckAllFlag = false;
                       break;
                    }    
               }
           }
           
           //让表头chebox 选上
           if(IsCheckAllFlag){
               checkAll_Node.prop("checked",true);   
           }  
        
    }else{
          let checkAll_Node = $('.chosenFormula-table table thead tr th').eq(0).find('input');
          checkAll_Node.prop("checked",false);  
    }
    
    //渲染表格checkbox 选中的数量
   ComputedSelectCount();
    
}
//计算表格checkbox 选中的数量
function ComputedSelectCount(){
    let count = 0;
    let total = 0;//总数
    $('.chosenFormula-table table tbody tr').each( (index,item)=>{
        let checkbox = $(item).find('td').eq(0).find('input');
        if( checkbox.is(':checked') == true){
            count+=1;//累加选中的数量
        }
        
        total +=1;//累加总数
    });
    
    $('.waitSelect-search .left-search .red').text(count);  //渲染选中的数量
    $('.waitSelectTable-tr-num').text(total);//待选表格的数量     
}

//删除待选公式表格tr 行
function DeleteWaitTable_Tr(_this,_id){
    $(_this).parents('tr').remove();
    
    //删除， 同步模拟数据
    for(let i=0; i<FormulaDataArr.length; i++){
        let item = FormulaDataArr[i];
        if(item.ruleid === _id){
           FormulaDataArr.splice(i,1);
           break;
        }
    }
    
    if(FormulaDataArr.length === 0){
        $('.chosenFormula-table .table-null-data').show();
    }else{
        $('.chosenFormula-table .table-null-data').hide();
    }
    console.log(FormulaDataArr);
}

//预览功能
function Preview_Tr(_this,_id,_keywordNum){
  //模拟获取的预览数据
    let PreviwArr = ["哪家超节能微信好用？", "哪家环保微信好用？", "哪家最新微信好用？", "哪家自制微信好用？", "哪家专业微信好用？", "哪家著名微信好用？", "哪家免检微信好用？", "哪家进口微信好用？", "哪家微型微信好用？", "哪家最省钱微信好用？", "哪家超节能小程序好用？", "哪家环保小程序好用？", "哪家最新小程序好用？", "哪家自制小程序好用？", "哪家专业小程序好用？", "哪家著名小程序好用？", "哪家免检小程序好用？", "哪家进口小程序好用？", "哪家微型小程序好用？", "哪家最省钱小程序好用？", "哪家超节能梦幻西游好用？", "哪家环保梦幻西游好用？", "哪家最新梦幻西游好用？", "哪家自制梦幻西游好用？", "哪家专业梦幻西游好用？", "哪家著名梦幻西游好用？", "哪家免检梦幻西游好用？", "哪家进口梦幻西游好用？", "哪家微型梦幻西游好用？", "哪家最省钱梦幻西游好用？"];
    
    let li_Node = "";
    PreviwArr.forEach( (item,index)=>{
        li_Node +=`<li>${index+1}、${item}</li>` 
    });
    
    //渲染关键词数量
    $('#preview_Modal .modal-title .red').text(_keywordNum);
    $('#preview_Modal .p-list').html(li_Node);

    $('#preview_Modal').modal('show');
}

//编辑公式 弹出框
let FormulaTd_Node;
function EditFormula(_this,_id,_index){
  
    FormulaTd_Node =  $(_this).parents('tr').find('td').eq(1);//选中 当前行 公式的 tr 节点
    let OldFormula = $(_this).parents('tr').find('td').eq(1).text();
      $('#EditFormula_Modal .modal-body h5 .text').text(OldFormula);//原公式提示
      $('#EditFormula_Modal .modal-body textarea').val(OldFormula);//textarea 控件赋 编辑值
    
      $('#EditFormula_Modal').modal('show');
}
//确定编辑公式
function CommitEditFormula(){
 //获取编辑公式 textarea控件的值
    let NewEditValue = $('#EditFormula_Modal .modal-body textarea').val();
    
 //处理公式html节点 数据+加上 span class 变色, 返回编辑的公式节点
    let NewEditHmtl_Node = DisposeEditFormula(NewEditValue);

    FormulaTd_Node.html(NewEditHmtl_Node);
    $('#EditFormula_Modal').modal('hide');    
}
//处理编辑公式的节点
function DisposeEditFormula(_data){
    let html = "";
    if( _data && _data.length > 0 ){
        //判断公式是否带有 “+”号， 转换数组.
        if(_data.indexOf('+') !== -1){
            let tempArr =_data.split('+');
            for(let i=0; i<tempArr.length; i++){
                let item = tempArr[i];
                if( item.indexOf('[') !== -1 &&  item.indexOf(']') !== -1 ){
                    if( i==(tempArr.length-1) ){
                        html  +=`<span class="t-tit">${item}</span>`;  
                    }else{
                        html +=`<span class="t-tit">${item}</span><span class="t-symbol">+</span>`;
                    }
                       
                }else{
                    if(i==(tempArr.length-1)){
                        html +=`<span class="t-and">${item}</span>`;
                    }else{
                        html +=`<span class="t-and">${item}</span><span class="t-symbol">+</span>`;
                    }
                }
            }
            
        }else{
            let noaddArr =_data.split();
            for(let i=0; i<noaddArr.length; i++){
                let item = noaddArr[i];
                if( item.indexOf('[') !== -1 &&  item.indexOf(']') !== -1 ){
                    html  +=`<span class="t-tit">${item}</span>`;
                }else{
                    html +=`<span class="t-and">${item}</span>`;
                }
            }
            
        }
        //返回公式组合节点
        return html;
    }
}

//批量添加标签，点击事件
function batchAddTags(){
    $('#batchAddTags_Modal .modal-body input').val('');
    
    let Tr_length  = $('.chosenFormula-table table tbody tr');
    let Ischecked =false; 
    for(let i=0;i<Tr_length.length; i++){
        let item = Tr_length[i];
        let falg = $(item).find('td').eq(0).find('input').is(':checked');
        if(falg){
            Ischecked = falg;
            break;
        }
    }
    
    if(Ischecked){
        $('#batchAddTags_Modal').modal('show');
    }else{
        layer.msg('请勾选行表格！')   
    }
}

//确定批量添加标签
function CommitbatchAddTags(){
    let Inputval = $('#batchAddTags_Modal .modal-body input').val(); //模态框input的值
    $('.chosenFormula-table table tbody tr').each( (index,item)=>{
        let flag = $(item).find('td').eq(0).find('input').is(':checked');
        if( flag ){
            $(item).find('td').eq(2).html(`<span class="label label-warning">${Inputval}</span>`); //赋值表格
            FormulaDataArr[index].tags = Inputval;
        } 
    });   
    
    $('#batchAddTags_Modal').modal('hide');
    console.log(FormulaDataArr);
}

//搜索
function clickSearch(){
    
    
}

//添加公式
function AddFormula(){
    let liNodeStr = "";
    $('#AddFormula_Modal .modal-body textarea').val(''); //初始化
    
    speechArr.forEach(item=>{
        liNodeStr +=`<li><span class="copy-word" onclick="clickSlectWordClass('[!--${item.name}--]+')" >${item.name}</span></li>`;
    });
    
    $('#AddFormula_Modal .modal-body .word-list').html(liNodeStr);
    $('#AddFormula_Modal').modal('show');
}

//选择词类
function clickSlectWordClass(_Word){
    let inputWordClass = $('#AddFormula_Modal .modal-body textarea').val();
    inputWordClass +=_Word;
    $('#AddFormula_Modal .modal-body textarea').val(inputWordClass); 
}

//确认添加公式
function CommitAddFormula(){
    let textareaVal = $('#AddFormula_Modal .modal-body textarea').val();
    if( textareaVal ){ 
        let Td_Formula_node = DisposeEditFormula(textareaVal);
     
        //模拟添加返回数据 id  == 666
        let itemObj = {
            beautyrule:Td_Formula_node,
            errMsg: "",
            prenum: 0,
            rule: textareaVal,
            ruleid:666,
            tags:""
        }
        FormulaDataArr.unshift(itemObj); //添加数据到 数组
        
        //添加行， 公式到表格,渲染。
        $('.chosenFormula-table table tbody').prepend(`
            <tr data-id="${itemObj.ruleid}" class="tr-${itemObj.ruleid}"> 
                <td>
                    <label>
                         <input type="checkbox" onchange="WaitTable_ItemCheckbox(this)" checked='checked' value="${true}"> 
                    </label>
                </td>
                <td>${itemObj.beautyrule}</td>
                <td class="align-center"><span class="label label-warning">${itemObj.tags}</span></td>
                <td class="align-center">${itemObj.prenum}</td>
                <td class="align-center">
                     <label><a href="javascript:;" class="btn green btn-xs" onclick="Preview_Tr(this,${itemObj.ruleid},${itemObj.prenum})"><i class="fa fa-eye"></i> 预览</a></label>
                     <label><a href="javascript:;" class="btn btn-xs blue" onclick="EditFormula(this,${itemObj.ruleid})"> <i class="fa fa-edit"></i>编辑</a></label>
                     <label><a href="javascript:;" class="btn red btn-xs" onclick="DeleteWaitTable_Tr(this,${itemObj.ruleid})"> <i class="fa fa-trash"></i> 删除</a> </label>
                </td>
          </tr>   
        `);
        
        $('#AddFormula_Modal').modal('hide');
        
    }else{
        layer.msg('请输入公式');
    }
    //$('#AddFormula_Modal .modal-body textarea').val('');
}

//导出全部关键词
function ExportAllwordKeyData(){
    
    console.log("导出全部关键词");
    
}
//确定提交导出全部关键词 
function CommitExportAllwordKeyData(){
    
}




//---------------------待选公式表格的处理/end------------------------   
    
    
    




