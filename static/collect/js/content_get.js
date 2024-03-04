/***
 *  2021-02-25 上午 阴天
 *
 *  列表添加的“内容获取”模块 独立js
 *
 * */
// -----------------------------------------------------------------华丽分割线----------------------------------------------------------------


let globalTrNode; //存储当前行this 表格tr节点，用于接收存储 当前tr节点，用其操作
let globalTrIndex; //存储当前行的索引index
let ProcessMethods_Val_stateArr = []; //用于判断 字段列表数据处理方法的状态 是否重复添加。
let UnifyProcessMethods_Val_stateArr = []; //用于判断"统一"数据处理方法 是否重复添加。


//数据处理事件操作
function DataDispose(_this, _text, _index) {

    $("#Tablefield_DataDispose_Modal .modal-title #field-text").text(_text);

    globalTrNode = $(_this).parents("tr");

    //大概是这里出了问题
    if (globalTrIndex !== _index) {

        $("#Tablefield_DataDispose_Modal .Addmethods-content").html("");

        ProcessMethods_Val_stateArr = [];
        globalTrIndex = _index;

        /**
         * @desc 处理数据处理 弹框的，编辑，把当前行的 数据处理，赋值到弹框，让其操作
         * @param {Array} datadisposeArr 存储 数据处理方法的类型数组Arr,用于判断，生成相对应的 数据方法类型节点
         * @param {Array} dataMethodsArr 数据处理方法 name 和 值，用于赋值。
         **/
        let datadisposeArr = [];
        let dataMethodsArr = [];

        globalTrNode.find(".datadispose-box input").each((index, item) => {

            datadisposeArr.push($(item).attr("data-type"));

            dataMethodsArr.push({
                name: $(item).attr("name"),
                value: $(item).val()
            });
        });

        ProcessMethods_Val_stateArr = unique(datadisposeArr);//同步是否重复数组的状态

        unique(datadisposeArr).forEach(item => {
            //渲染 数据处理的方法节点
            renderMethods(item);
        });

        //把值赋值到数据处理弹出框
        dataMethodsArr.forEach((item, index) => {
            $("#Tablefield_DataDispose_Modal").find(`[name='${item.name}']`).val(item.value);
            // 移除标签的数据处理规则展示
            if(item.name.search('[remove][remove_type]') != -1){
                switch(Number(item.value)){
                    case 1:
                        $('#remove_type_3').css('display', 'none');
                        $('#remove_type_12').css('display', '');
                        break;
                    case 2:
                        $('#remove_type_3').css('display', 'none');
                        $('#remove_type_12').css('display', '');
                        break;
                    case 3:
                        $('#remove_type_12').css('display', 'none');
                        $('#remove_type_3').css('display', '');
                        break;
                    default:
                        break;
                }
            }
        });
    }

    //数据处理的弹框
    $("#Tablefield_DataDispose_Modal").modal("show");
}

/**
 *
 * @desc 数组去重的方法;
 * @return {Array} 去重后的新数组
 *
 * */
function unique(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a) && res.set(a, 1));
}

//重新获取绑定字段的可选值
function reloadBuildColumns() {

    // getcollectColumns();
    // setBuildOptions();
}

function copyPlan(obj) {

    let value = $(obj).val();

    if (value !== "") {

        let plan = JSON.parse($(obj).val());

        //渲染数据
        setPlanData(plan);

    } else {
        clearLocalFields();
        clearFields();
        clearRemoteFields();
        importTypeFirstOptionSelected();
    }

}

function importTypeFirstOptionSelected() {

    //让第一个option选中
    $("#import_type option:first").prop("selected", true);
    $("#import_type").change();
}


function setPlanData(plan) {

    refreshImportType(plan.build.import_type);

    switch (plan.build.import_type) {
        case "1":
            //本地入库
            clearLocalFields();
            setLocalPlan(plan);

            break;
        case "2":

            //本地CMS
            //下拉框根据复制方案里面的配置自动选中
            refreshCmsType(plan.build.cms_type);
            setCmsPath(plan.build.cms_path);
            clickConnectionCmsDbBtn();

            break;

        case "3":

            //远程CMS
            let remote = plan.remote;

            //api链接
            $("#cms_api").val(remote.cms_api);
            //请求方式
            $(`#remote_method option[value=${remote.method}]`).prop("selected", true);
            //渲染绑定数据
            renderRemoteBuildColumns(remote.columns);
            //渲染请求头
            renderRemoteBuildHeaders(remote.headers);

            break;
        default:
            // 未知错误
            break;
    }


}

function renderRemoteBuildHeaders(headers) {

    let header_input = $("#add_remote_header_input");
    let header_btn = $("#add_remote_header");

    Object.keys(headers).map((key) => {

        //给input赋值
        header_input.val(key);

        //触发添加事件
        header_btn.click();

        //赋值
        $("#remote_headers").find(`input[name='data[run_method][remote][headers][${key}]']`).val(headers[key]);

    });

}

function renderRemoteBuildColumns(columns) {

    let field_input = $("#add_remote_field_input");
    let build_btn = $("#build_remote_field");
    let remote_fields = $("#remote_fields");
    let i = 0;

    //渲染绑定字段
    columns.map(item => {

        //给input赋值
        field_input.val(item.name);

        //触发添加事件
        build_btn.click();

        let parent = remote_fields.find(`input[name='data[run_method][remote][columns][${i}][name]']`).parents(".handmethod-item");

        parent.find(`input[name='data[run_method][remote][columns][${i}][name]']`).val(item.name);
        parent.find(`input[name='data[run_method][remote][columns][${i}][value_type]']`).val(item.value_type);
        parent.find(`input[name='data[run_method][remote][columns][${i}][build]']`).val(item.build);
        parent.find(`input[name='data[run_method][remote][columns][${i}][value]']`).val(item.value);

        //如果是下拉框 就让其选中
        if (item.value_type == "select") {

            parent.find(".build-select").find(`option[value=${item.value}]`).prop("selected", true);
            parent.find(".build-input").hide();
        } else {

            //如果不是下拉框 那么显示input框 并让最后一个option选中
            parent.find(".build-select").find("option:last").prop("selected", true);
            parent.find(".build-input").val(item.value);
            parent.find(".build-input").show();
        }

        i++;
    });


}

function planSelected() {

}

function setCmsPath(cms_path) {
    $("#cms_path").val(cms_path);
}

function clickConnectionCmsDbBtn() {

    $("#connection_db").click();

}

function refreshCmsType(cms_type) {

    //渲染方案
    $(`#cms_type option[value=${cms_type}]`).prop("selected", true);


}

function refreshImportType(import_type) {

    //渲染方案
    $(`#import_type option[value=${import_type}]`).prop("selected", true);
    $("#import_type").change();

}

function clearFields() {
    $("#cms_fields").empty();
}

function clearRemoteFields() {
    $("#remote-cms-row").hide();
    $("#remote_fields").empty();
    $("#remote_headers").empty();
}

/**
 * 渲染与隐藏入库方式子节点
 * @param object obj dom节点
 * @returns bool
 */
function changeImportType(obj) {

    switch (obj.value) {
        case "1":
            $("#local-db-row").show();
            $("#local-cms-row").hide();
            $("#remote-cms-row").hide();
            break;
        case "2":
            $("#local-cms-row").show();
            $("#local-db-row").hide();
            $("#remote-cms-row").hide();
            break;
        case "3":
            $("#remote-cms-row").show();
            $("#local-db-row").hide();
            $("#local-cms-row").hide();

            break;
        default:
            return false;
            break;
    }
}

function changeCmsType(obj) {
    clearFields();
}

/**
 * 获取本地入库页表字段
 * @param table_name
 * @param collect_columns
 * @returns {boolean}
 */
function getTableField(table_name, collect_columns) {
    if (table_tmps.indexOf(table_name) >= 0) {
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "html",
        url: '/'+ SELF +`?s=Puyicaiji&c=home&m=bindTableField`,
        data: {table_name: table_name, collect_columns: collect_columns},
        async: false,
        success: function (tag) {
            table_tmps.push(table_name);
            $("#local-db-row").append(tag);
        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);

        }
    });
}

/**
 * 本地入库清除绑定表
 */
function clearLocalFields() {
    table_tmps = [];
    $(".table_field_selected").remove();
}

/**
 * 采集本地入库修改页的渲染
 */
function setLocalPlan(plan) {

    setTableField(plan.local, plan.ContentGet.fieldlist_Table);
    setBuildField(plan.local);
}

/**
 * 渲染采集添加页的已选择表字段
 */

function addTableField() {
    let collect_columns = [];
    let collect_columns_tmp = getCollectColumns();
    for (let i in collect_columns_tmp) {
        collect_columns[i] = collect_columns_tmp[i].name;
    }
    getTableField($("#table_name").val(), collect_columns);
}

/**
 * 渲染采集修改页的采集字段
 * @param object localData 本地入库数据
 * @param object collect_columns 采集字段
 */
function setTableField(localData, collect_columns_tmp) {
    let collect_columns = [];
    for (let j in collect_columns_tmp) {
        collect_columns[j] = collect_columns_tmp[j].field_name;
    }
    for (let i in localData) {

        getTableField(localData[i].table, collect_columns);
    }
}

/**
 * 渲染采集修改页的被选择采集字段
 * @param  buildData  本地入库数据
 */
function setBuildField(buildData) {
    for (let i in buildData) {
        for (let j in buildData[i].columns) {
            let table_select = $("#" + buildData[i].table + "-" + buildData[i].columns[j].name);
            if (buildData[i].columns[j].build) {
                table_select = table_select.find("option");
                for (x in table_select) {
                    if (table_select[x].innerHTML == "采集字段：" + buildData[i].columns[j].value) {
                        table_select[x].selected = "selected";
                    }
                }
            } else {
                // TODO 无法找到被渲染元素 Cannot set properties of undefined (setting 'selected')
                // console.log(table_select.find("option[value=\"custom:\"]")[0]);
                // table_select.find("option[value=\"custom:\"]")[0].selected = "selected";
                table_select.parent().append("<input class=\"form-control\" name=\"data[run_method][local][table_list][" + buildData[i].table + "][" + buildData[i].columns[j].name + "]\" value=\"" + buildData[i].columns[j].value + "\"/>");

            }
        }
    }
}

/**
 * 渲染自定义输入框
 * @param object obj dom节点
 */
function isCustom(obj) {
    if (obj.value == "custom:") {
        $(obj).parent().append("<input class=\"form-control\" name=\"data[run_method][local][table_list]" + $(obj).attr("string_attr") + "\"/>");
    } else {
        $(obj).next().remove();
    }
}

/**
 * 移除表元素
 * @param object obj dom节点
 */
function removeTable(obj){
    let tableId = $(obj).attr('data') + '_form';
    $('#'+tableId).remove();
}

function test(obj) {}

function isJSON(str) {

    if (typeof str == "string") {
        try {
            let obj = JSON.parse(str);
            if (typeof obj == "object" && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            console.log("error：" + str + "!!!" + e);
            return false;
        }

    } else {
        return false;
    }
}

//获取采集标签 给绑定字段做可选值
function getCollectColumns() {

    let build_columns = [];
    $(".dataTable .field-name-input").each(function () {
        let value = $.trim($(this).val());

        let temp = {
            "id": value,
            "name": value,
        };

        build_columns.push(temp);

    });

    return build_columns;
}

//给绑定字段的select框重新渲染option
// function setBuildOptions() {
//
//     //遍历 绑定字段的id数组 把他们的option都清空然后再赋值
//     build_column_ids.map((item, index) => {
//
//         //把下拉框的value设为空
//         $("#" + item).val("");
//
//         //清空option
//         $("#" + item + " option").remove();
//
//         build_column_options.map((option) => {
//
//             let option_html = `<option value="${option}">${option}</option>`;
//
//             //重新赋值
//             $(`#${item}`).append(option_html);
//
//         });
//
//     });
//
// }

//添加字段
let IsAddfield = false;

function Addfield() {

    $("#edit_field_Modal .modal-header h4").text("添加字段");
    IsAddfield = true;
    //初始化
    $("#edit_field_Modal .fieldName-input").val(""); //字段名称
    $("#edit_field_Modal .data_origin-select").val("content_page");  //数据源
    $("#edit_field_Modal .getType-select").val("rule");  //获取方式
    $("#edit_field_Modal .rule-textarea").val("");  //规则
    $("#edit_field_Modal .finally_joint-textarea").val(""); //拼接成最终内容
    $("#edit_field_Modal .title_deleteAgain").val(0);
    $("#edit_field_Modal .title_deleteAgain").removeAttr("checked");

    $("#edit_field_Modal").modal("show");
}

//编辑字段
function edit_field(_this, _id) {
    $("#edit_field_Modal .modal-header h4").text("编辑字段");
    IsAddfield = false;
    //把编辑字段的数据 渲染到模态框
    let TrNode = $(_this).parents("tr");
    globalTrNode = $(_this).parents("tr");
    rendere_editfieldData_Modal(TrNode);//渲染编辑字段的数据

    $("#edit_field_Modal").modal("show");
}

//渲染编辑字段的数据，
function rendere_editfieldData_Modal(_this) {

    $("#edit_field_Modal .fieldName-input").val(_this.find(".fieldName input").val()); //字段名称

    //$('#edit_field_Modal .data_origin-select').val( _this.find('.data_origin input').val() ); //数据源

    //赋值 数据源select
    _this.find(".data_origin input").each((index, item) => {

        if (index == 0) {
            //$(item).val( $('#edit_field_Modal .data_origin-select option:selected').text() )
        } else {
            //$(item).val( $('#edit_field_Modal .data_origin-select option:selected').val() )
            $("#edit_field_Modal .data_origin-select").val($(item).val()); //数据源
        }
    });


    //赋值获取方式select
    _this.find(".getType input").each((index, item) => {
        if (index == 0) {
            //$(item).val( $('#edit_field_Modal .getType-select option:selected').text() )
        } else {
            $("#edit_field_Modal .getType-select").val($(item).val());  //获取方式
            switch($(item).val()){
                case 'auto_title':
                case 'auto_content':
                    $('textarea[name="collect_attr"]').attr('disabled','disabled');
                    break;
                default:break;
            }
        }
    });

    $("#edit_field_Modal .rule-textarea").val(_this.find(".other #rule").val());  //规则
    $("#edit_field_Modal .finally_joint-textarea").val(_this.find(".other #finally_joint").val()); //拼接成最终内容


    $("#edit_field_Modal .title_deleteAgain").bootstrapSwitch();

    let title_deleteAgain = Number(_this.find(".other #title_deleteAgain").val());
    if (title_deleteAgain == 1) {
        $("#edit_field_Modal .title_deleteAgain").val(1);
        $("#edit_field_Modal .title_deleteAgain").bootstrapSwitch("state", true);
    } else {
        $("#edit_field_Modal .title_deleteAgain").val(0);
        $("#edit_field_Modal .title_deleteAgain").bootstrapSwitch("state", false);
    }

    //循环获取的编辑赋值
    $("#edit_field_Modal .loop-get").bootstrapSwitch();

    let loop_get = Number(_this.find(".other #loop_get").val());
    if (loop_get == 1) {
        $("#edit_field_Modal .loop-get").val(1);
        $("#edit_field_Modal .loop-get").bootstrapSwitch("state", true);
    } else {
        $("#edit_field_Modal .loop-get").val(0);
        $("#edit_field_Modal .loop-get").bootstrapSwitch("state", false);
    }


    let remove_html = Number(_this.find(".other .remove-html-input").val());

    if (remove_html == 1) {
        $("#edit_field_Modal .remove-html-checkbox").bootstrapSwitch("state", true);
    } else {
        $("#edit_field_Modal .remove-html-checkbox").bootstrapSwitch("state", false);
    }

    let pseudo_original = Number(_this.find(".other #pseudo_original").val());

    if (pseudo_original == 1) {
        $("#edit_field_Modal .pseudo-original").val(1);
        $("#edit_field_Modal .pseudo-original").bootstrapSwitch("state", true);
    } else {
        $("#edit_field_Modal .pseudo-original").val(0);
        $("#edit_field_Modal .pseudo-original").bootstrapSwitch("state", false);
    }
}


function changeBodyPage(obj) {

    let value = parseInt($(obj).val()) === 1 ? 0 : 1;

    $(obj).val(value);

}


//确定提交 提交表格的字段
function CommitField() {

    //有bootstrap-switch-off 说明是关闭状态
    let remove_html = $("#edit_field_Modal").find(".remove-html-checkbox").parents(".bootstrap-switch").is(".bootstrap-switch-off") ? 0 : 1;

    //修改之后，把数据渲染到表格
    if (IsAddfield == false) {

        globalTrNode.find(".fieldName a").text($("#edit_field_Modal .fieldName-input").val()); //字段名称
        globalTrNode.find(".fieldName input").val($("#edit_field_Modal .fieldName-input").val()); //字段名称

        // globalTrNode.find('.data_origin span').text( $('#edit_field_Modal .data_origin-select option:selected').text() ); //数据源文字
        //globalTrNode.find('.data_origin input').val( $('#edit_field_Modal .data_origin-select option:selected').val() ); //数据源value

        /*<span>${dataOrigin_Text}</span>
         <input type="hidden" name="data[ContentGet][fieldlist_Table][dataOrigin_Text][${index}]" value="${dataOrigin_Text}">
         <input type="hidden" name="data[ContentGet][fieldlist_Table][data_origin][${index}]" value="${dataOrigin}">*/

        globalTrNode.find(".data_origin span").text($("#edit_field_Modal .data_origin-select option:selected").text());
        globalTrNode.find(".data_origin input").each((index, item) => {
            if (index == 0) {
                $(item).val($("#edit_field_Modal .data_origin-select option:selected").text());
            } else {
                $(item).val($("#edit_field_Modal .data_origin-select option:selected").val());
            }
        });

        /*<span>${getType_Text}</span>
           <input type="hidden" name="data[ContentGet][fieldlist_Table][getType][${index}]" value="${getType_Text}">
           <input type="hidden" name="data[ContentGet][fieldlist_Table][getTypeValue][${index}]" value="${getType}">*/

        globalTrNode.find(".getType span").text($("#edit_field_Modal .getType-select option:selected").text());
        globalTrNode.find(".getType input").each((index, item) => {
            if (index == 0) {
                $(item).val($("#edit_field_Modal .getType-select option:selected").text());
            } else {
                $(item).val($("#edit_field_Modal .getType-select option:selected").val());
            }
        });

        //把引号转移为html实体
        let rule_textarea = $("#edit_field_Modal .rule-textarea").val();
        let finally_joint = $("#edit_field_Modal .finally_joint-textarea").val();

        globalTrNode.find(".other #rule").val(rule_textarea); //规则
        globalTrNode.find(".other #finally_joint").val(finally_joint); //拼接成最终内容

        //标题排重判断
        if ($("#edit_field_Modal .title_deleteAgain").bootstrapSwitch("state")) {
            globalTrNode.find(".other #title_deleteAgain").val(1); //拼接成最终内容
        } else {
            globalTrNode.find(".other #title_deleteAgain").val(0); //拼接成最终内容
        }

        //循环获取 判断 和赋值
        if ($("#edit_field_Modal .loop-get").bootstrapSwitch("state")) {
            globalTrNode.find(".other #loop_get").val(1); //循环获取
        } else {
            globalTrNode.find(".other #loop_get").val(0); //循环获取
        }

        // 伪原创
        if ($("#edit_field_Modal .pseudo-original").bootstrapSwitch("state")) {
            globalTrNode.find(".other #pseudo_original").val(1);
        } else {
            globalTrNode.find(".other #pseudo_original").val(0);
        }

        //去除html标签
        globalTrNode.find(".other .remove-html-input").val(remove_html);

    } else {

        //判断是否存在提示空数据，提示空数据，要去除。
        if ($(".field-table .table tbody tr").hasClass("no-data")) {
            $(".field-table .table tbody").html(``);
        }

        //添加字段的处理,添加成功追加到表格。
        let fieldName = $("#edit_field_Modal .fieldName-input").val();
        let dataOrigin = $("#edit_field_Modal .data_origin-select option:selected").val();
        let getType = $("#edit_field_Modal .getType-select option:selected").val();

        //把引号转移为html实体
        let fieldRule = $("#edit_field_Modal .rule-textarea").val().replace(/\"/g, "&quot;");
        let finally_joint = $("#edit_field_Modal .finally_joint-textarea").val().replace(/\"/g, "&quot;");

        let dataOrigin_Text = $("#edit_field_Modal .data_origin-select option:selected").text();
        let getType_Text = $("#edit_field_Modal .getType-select option:selected").text();

        let title_deleteAgain;

        if ($("#edit_field_Modal .title_deleteAgain").bootstrapSwitch("state")) {
            title_deleteAgain = 1;
        } else {
            title_deleteAgain = 0;
        }

        //判断循环获取，添加值
        let loop_get;
        if ($("#edit_field_Modal .loop-get").bootstrapSwitch("state")) {
            loop_get = 1; //循环获取
        } else {
            loop_get = 0; //循环获取
        }

        // 伪原创
        let pseudo_original;
        if ($("#edit_field_Modal .pseudo-original").bootstrapSwitch("state")) {
            pseudo_original = 1;
        } else {
            pseudo_original = 0;
        }

        let index = $(".field-table .table tbody tr").length;
        let Tr_node = `<tr class="odd gradeX">
                                <td style="text-align:center">
                                <input type="text" name="data[run_method][ContentGet][fieldlist_Table][${index}][sort]"  value="0" class="displayorder form-control input-sm input-inline input-mini"> 
                                 </td>
                                <td class="fieldName"> 
                                     <a href="javascript:void(0)" class="fieldname" title="点击编辑字段">${fieldName} </a>  
                                     <input type="hidden" class="field-name-input" name="data[run_method][ContentGet][fieldlist_Table][${index}][field_name]" value="${fieldName}">
                                </td>
                                <td class="data_origin">
                                      <span>${dataOrigin_Text}</span>
                                      <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][dataorigin_text]" value="${dataOrigin_Text}">
                                      <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][data_origin]" value="${dataOrigin}">
                                </td>
                                <td class="getType"> 
                                    <span>${getType_Text}</span>
                                    <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][get_type]" value="${getType_Text}"> 
                                    <input type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][get_typevalue]" value="${getType}">
        						</td>
                                <td class="other" style="overflow:visible">
                                     <label><a href="javascript:void(0)" onclick="DataDispose(this,'${fieldName}',${index})" class="btn btn-xs green"><i class="fa fa-paper-plane"></i> 数据处理</a></label>
                                     <label><a href="javascript:void(0)" onclick="edit_field(this,${index})" class="btn btn-xs blue" title="点击编辑字段">编辑字段</a></label>
                                     <label><a href="javascript:void(0)" onclick="delete_fieldTr(this,${index})" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a></label>
                                    
                                    <!--隐藏域存储数据 1.规则 2.拼接成最终内容 3.标题排重--> 
                                    <input id="rule" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][rule]" value="${fieldRule}">
                                    <input id="finally_joint" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][finally_joint]" value="${finally_joint}">
                                    <input id="title_deleteAgain" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][title_deleteAgain]" value="${title_deleteAgain}">
                                    <input id="loop_get" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][loop_get]" value="${loop_get}">
                                    <input class="remove-html-input" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][remove_html]" value="${remove_html}">
                                    <input id="pseudo_original" type="hidden" name="data[run_method][ContentGet][fieldlist_Table][${index}][pseudo_original]" value="${pseudo_original}">
                                    <!--隐藏域存储数据 存储 数据处理方法 -->
                                    <div class="datadispose-box"></div>
                               </td>
                      </tr>`;

        //从表格的前面插入数据
        $(".field-table .table tbody").append(Tr_node);

    }

    //关闭模态框
    $("#edit_field_Modal").modal("hide");


    //重新获取绑定字段的可选值
    reloadBuildColumns();

}

/*
 *@desc 字段列表  数据处理 监听select 处理方法
 *
 */
let ProcessMethods_Val;
let tipText_ProcessMethods = "";

function ProcessMethods_change(_this) {
    ProcessMethods_Val = $(_this).val();
    tipText_ProcessMethods = $(_this).find("option:selected").text();
}

//添加处理方法
function Addmethods(_this) {

    if (!ProcessMethods_Val) {
        layer.msg("请选择处理方法！");
        return;
    }

    /**
     * @desc 用于判断数据处理方法添加 是否重复，不能添加同一个方法。
     * @param {Array} ProcessMethods_Val_stateArr
     * */
    if (ProcessMethods_Val_stateArr.length > 0) {
        let flag = false;
        for (let i = 0; i < ProcessMethods_Val_stateArr.length; i++) {
            let item = ProcessMethods_Val_stateArr[i];
            if (item == ProcessMethods_Val) {
                flag = true;
                break;
            }
        }
        if (flag) {
            layer.msg("您重复添加（" + tipText_ProcessMethods + "）方法了！");
            return;
        }

        ProcessMethods_Val_stateArr.push(ProcessMethods_Val);
    } else {
        ProcessMethods_Val_stateArr.push(ProcessMethods_Val);
    }

    //渲染 数据处理的方法节点
    renderMethods(ProcessMethods_Val);
}

/**
 *
 * @desc 渲染 数据处理的方法节点
 * @param {string} _ProcessMethods_Val
 *
 * */
function renderMethods(ProcessMethods_Val) {
    //---------------end---------------
    let html_Node = "";
    switch (ProcessMethods_Val) {

        case "replace":  //内容替换

            html_Node = `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                           <div class="panel panel-info">
                                    <div class="panel-heading">
                                        <h5 class="panel-title">内容替换</h5>
                                        <a href="javascript:void(0)" onclick="DeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                    </div>
                                    <div class="panel-body">
                                           <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][replace][old_content]"></textarea>           
                                           <div style="margin: 5px 0;font-size: 15px;">替换成</div>
                                           <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][replace][content_replace]"></textarea>
                                    </div>
                             </div>
                        </div>`;

            break;
        case "batch": //批量替换

            html_Node = `
                        <div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                           <div class="panel panel-info">
                                    <div class="panel-heading">
                                        <h5 class="panel-title">批量替换</h5>
                                        <a href="javascript:void(0)" onclick="DeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                    </div>
                                    <div class="panel-body">
                                           <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][batch][batch_replace]"></textarea>    
                                           <p class="help-block">一行一对替换词，用“=”分隔，例如：aa=bb，即将“aa”替换成“bb”</p>
                                    </div>
                             </div>
                        </div>`;

            break;

        case "filter": //关键词过滤

            html_Node = `<div class="Addmethods-item ${ProcessMethods_Val}-item" type="${ProcessMethods_Val}">
                               <div class="panel panel-info">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">关键词过滤</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                        <p class="help-block">每个关键词，用“、”分隔，例如：aa、bb、cc</p>
                                        <textarea class="form-control " style="height: 130px; margin: 0 0 20px 0;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][keywords_filter]" placeholder="填写关键词"></textarea>   
                                            
                                            <div class="mb20">
                                                <label class="mb10">
                                                    <input type="radio"  value="1" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][type]">关键词替换为
                                                </label>
                                                <input type="text" class="form-control fieldName-input" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][replace]">
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="2" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][type]">检测到关键词则将该字段值设为空
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="3" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][type]">检测到关键词则不采集该条数据
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="4" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][type]">未检测到关键词则将该字段值设为空
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="5" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][filter][type]">未检测到关键词则不采集该条数据
                                                </label>
                                            </div>    
                                            
                                        </div>
                                 </div>
                            </div>`;

            break;

        case "if": //条件判断

            html_Node = `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                           <div class="panel panel-info">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">条件判断 包含关键词就采集</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                    <div class="panel-body">
                                            <div class="handmethod-item border-bottom-line">
                                                     <div class="title" style="background-color:#fff;">条件判断</div>
                                                     <select  class="form-control" style="border-radius: 0px 5px 5px 0px;" ">
                                        			        <option value="1">包含关键词就采集</option>
                                        			</select>
                                            </div>
                                            
                                            <div class="Addjudge-box"> 
                                                <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][if][contains_value]" placeholder="填写关键词"></textarea>                             
                                                <p class="help-block">每个关键词 用“、”分隔，例如：aa、bb、cc </p>
                                            </div>
                                    </div>
                             </div>
                        </div>`;

            html_Node += `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                           <div class="panel panel-info">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">条件判断 不包含关键词就采集</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                    <div class="panel-body">
                                            <div class="handmethod-item border-bottom-line">
                                                     <div class="title" style="background-color:#fff;">条件判断</div>
                                                     <select class="form-control" style="border-radius: 0px 5px 5px 0px;" ">
                                        			        <option value="1">不包含关键词就采集</option>
                                        			</select>
                                            </div>
                                            
                                            <div class="Addjudge-box"> 
                                                <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][if][not_contains_value]" placeholder="填写关键词"></textarea>                             
                                                <p class="help-block">每个关键词 用“、”分隔，例如：aa、bb、cc </p>
                                            </div>
                                    </div>
                             </div>
                        </div>`;
            break;

        case "substr": //截取字符串
            html_Node += `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                           <div class="panel panel-info">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">字符串截取</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                    <div class="panel-body">
                                        <div class="panel-body">
                                               <span class="fz16">截取长度</span> 
                                               <input type="text" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][substr][length]">
                                               <span class="fz16">增加开始字符</span> 
                                               <input type="text" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][substr][start]">
                                               <span class="fz16">增加结尾字符</span> 
                                               <input type="text" class="form-control fieldName-input" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][substr][end]">
                                        </div>
                                    </div>
                             </div>
                        </div>`;
            break;

        case "remove": //移除标签
            html_Node += `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                <h5 class="panel-title">移除标签</h5>
                                <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                            </div>
                            <div class="panel-body">
                                <span class="fz16">移除类型</span>
                                <select onchange="removeTypeChange(this)" class="form-control mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_type]" lay-verify="">
                                    <option value="">请选择移除类型</option>
                                    <option value="1">从内容开头移除</option>
                                    <option value="2">从内容结尾移除</option>
                                    <option value="3">按照标签属性全文移除</option>
                                </select>
                                <div id='remove_type_content'>
                                    <div id='remove_type_12' style='display:none;'>
                                        <span class="fz16">标签</span>
                                        <input type="text" placeholder="请输入被移除的标签，如：div，不填则移除所有标签" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag]">
                                        <span class="fz16">移除开始序号</span>
                                        <input type="text" placeholder="从第几条标签移除" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_number_start]">
                                        <span class="fz16">移除数量</span>
                                        <input type="text" placeholder="移除数量" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_number_end]">
                                    </div>
                                    <div id='remove_type_3' style='display:none;'>
                                        <span class="fz16">属性名</span>
                                        <input type="text" placeholder="请输入标签属性名" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag_attr_name]">
                                        <span class="fz16">属性值</span>
                                        <input type="text" placeholder="请输入标签属性值" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag_attr_value]">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        break;
    }

    $("#Tablefield_DataDispose_Modal .Addmethods-content").append(html_Node);
}

// 变更字段数据处理的移除标签时的change事件
function removeTypeChange(that){
    switch(Number($(that).val())){
        case 1:
            $('#remove_type_3').css('display', 'none');
            $('#remove_type_12').css('display', '');
            break;
        case 2:
            $('#remove_type_3').css('display', 'none');
            $('#remove_type_12').css('display', '');
            break;
        case 3:
            $('#remove_type_12').css('display', 'none');
            $('#remove_type_3').css('display', '');
            break;
        default:
            break;
    }
}

//条件判断  添加子项逻辑
function Addjudge(_this) {

    let element_node = `
            <tr>
                <td> 
                    <select class="form-control" name="">
               			<option value="and">并且</option>
               			<option value="or">或者</option>
               		</select>
                </td>   
                <td> 
                    <select  class="form-control" name="">
                   			<option value="has">包含</option>
                   			<option value="nhas">不包含</option>
                   			<option value="eq">等于</option>
                   			<option value="neq">不等于</option>
                   			<option value="heq">恒等于</option>
                   			<option value="nheq">不恒等于</option>
                   			<option value="gt">大于</option>
                   			<option value="egt">大于等于</option>
                   			<option value="lt">小于</option>
                   			<option value="elt">小于等于</option>
                   			<option value="time_eq">时间等于</option>
                   			<option value="time_egt">时间大于等于</option>
                   			<option value="time_elt">时间小于等于</option>
                   			<option value="regexp">正则表达式</option>
                   			<option value="func">使用函数</option>
                   	</select> 
                </td>     
                <td>
                    <input type="text" data-process="if:if_val:" class="form-control" name="">        
                </td>
                <td>
                      <a href="javascript:void(0)" onclick="DeleteAddjudgeTr(this)" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                </td>
            </tr> `;

    $(_this).parents(".panel-body").find(".Addjudge-box .table tbody").append(element_node);

}

//删除 条件判断的表格
function DeleteAddjudgeTr(_this) {
    $(_this).parents("tr").remove();

}

//删除数据处理的添加方法
function DeleteAddmethods(_this, _type) {

    $(_this).parents(".Addmethods-item").remove();

    //删除状态数组
    for (let i = 0; i < ProcessMethods_Val_stateArr.length; i++) {
        let item = ProcessMethods_Val_stateArr[i];
        if (item == _type) {
            ProcessMethods_Val_stateArr.splice(i, 1);
            break;
        }
    }


}

function assemblyCollectColumnOptions(columns) {

    let options_html = "";

    columns.map((item, index) => {
        options_html += `<option value="${item}">采集标签：${item}</option>`;
    });

    return options_html;
}

function getCmsDbData(data) {

    let result;

    $.ajax({

        type: "POST",

        url: '/' + SELF + "?s=Puyicaiji&c=api&m=connectionCmsDb",

        data: data,

        async: false,

        datatype: "text/json",

        beforeSend: () => {

        },
        success: (response) => {
            result = JSON.parse(response);
        }

    });

    return result;

}

function isShowFieldsHtml(item) {

    //如果是必填项 肯定是要渲染的
    if (parseInt(item.required) === 1) {
        return true;
    }

    //如果show为1 也要渲染
    if (item.hasOwnProperty("show") && parseInt(item.show) === 1) {
        return true;
    }

    return false;
}

function addRemoteHeader(obj) {

    let input = $("#add_remote_header_input");

    let value = input.val();

    if (value == "") {
        alert("请添加请求头名称! ");
        return;
    }

    let html = `<div class="handmethod-item border-bottom-line">
                    <div class="title">请求头：${value}</div>
                    <div class="w100b">
                        <input type="text" class="form-control fieldName-input build-input" name="data[run_method][remote][headers][${value}]" value="">
                    </div>
                    <button type="button" class="btn red btn-sm" onclick="delCmsCustomField(this)">删除</button>
                </div>`;

    $("#remote_headers").append(html);

    input.val("");
}


function addRemoteField(obj) {

    let input = $("#add_remote_field_input");

    let value = input.val();
    let length = $("#remote_fields .handmethod-item").length;

    if (value == "") {
        alert("请添加数据名称!");
        return;
    }

    //获取采集标签 给绑定字段做可选值
    let collect_columns = getCollectColumns();

    let html = `<div class="handmethod-item border-bottom-line">
                    <div class="title">数据绑定：${value}</div>
                    <div class="build-container">
                        <select class="build-select form-control data_origin-select" name="" onchange="editCustomContent(this)">`;

    collect_columns.map((item, index) => {

        html += `<option value="${item.id}">${item.name}</option>`;

    });

    html += `<option value="">自定义内容</option>`;

    html += `</select>
                    <input type="text" class="form-control fieldName-input build-input" name="" value="" onblur="buildValueStorageBlur(this)">
                    </div>
                    <input type="hidden"                    name="data[run_method][remote][columns][${length}][name]" value="${value}">
                    <!--数据的类型 默认是select-->
                    <input type="hidden" class="value-type" name="data[run_method][remote][columns][${length}][value_type]" value="select">
                    <!--是否与采集字段绑定 自定义字段默认绑定-->
                    <input type="hidden" class="build-type" name="data[run_method][remote][columns][${length}][build]" value="1">
                    <!--这里 默认为第一个option-->
                    <input  type="hidden" class="build-value-storage" name="data[run_method][remote][columns][${length}][value]" value="${collect_columns.hasOwnProperty(0) ? collect_columns[0].id : ""}">
                    <button type="button" class="btn red btn-sm" onclick="delCmsCustomField(this)">删除</button>
                </div>`;

    $("#remote_fields").append(html);

    showBuildInput();

    input.val("");
}

function getRequest() {

    var url = location.search; //获取url中"?"符后的字串
    var params = new Object();

    if (url.indexOf("?") != -1) {
        let str = url.substr(1).split("&");
        for (let i = 0; i < str.length; i++) {
            params[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
        }
    }
    return params;
}

// 连接本地cms的数据库
function connectionCmsDb() {
    //获取本地cms类型
    let cms_type = $("#cms_type").val();
    //获取cms路径
    let cms_path = $("#cms_path").val();
    let plan_id = getRequest()["id"];

    if (cms_type == "") {
        alert("请选择cms类型");
        return false;
    }

    if (cms_path == "") {
        alert("请输入cms路径");
        return false;
    }

    let result = getCmsDbData({cms_type, cms_path, plan_id});

    //拿到数据后 给下拉框赋值
    if (result.code === 200) {

        let data = result.data;//必填字段
        let html = "";
        let obj = $("#cms_fields");
        let num = 0;
        //获取采集标签 给绑定字段做可选值
        let collect_columns = getCollectColumns();

        //清空所有的子节点
        obj.empty();

        for (let i = 0; i < data.length; i++) {

            //build===1 或者是自定义字段的情况下 就是要从采集标签里面拿数据
            if (parseInt(data[i].build) === 1 || parseInt(data[i].required) === 0) {
                data[i].data = collect_columns;
            }

        }

        data.map((item, index) => {

            if (isShowFieldsHtml(item)) {

                html = `<div class="handmethod-item border-bottom-line"><div class="title">${item.name}`;

                //如果是必填项
                if (parseInt(item.required) === 1) {

                    html += `<span class="required-span">*</span>`;

                }

                html += `</div><div class="build-container">`;

                //如果types_length的值大于1 说明有select和input
                //但是name不能重复啊 所以通过types_length来判断 如果大于1 那就不设置name的值
                //而是把值赋给了最后一个hidden框 在这个hidden框设置name class为build-value-storage
                let types_length = item.types.length;

                //这个唯一的用处就是给build-value-storage赋值
                let type_value = "";

                item.types.map((type) => {

                    //下拉框的情况
                    if (type.type === "select") {

                        html += `<select class="build-select form-control data_origin-select" name="${types_length > 1 ? "" : "data[run_method][build][columns][" + num + "][value]"}" onchange="editCustomContent(this)" autocomplete="off">`;

                        // 下拉框的情况 要与采集字段绑定
                        item.data.map((option) => {

                            //这个if很重要 如果改成三元运算符
                            //类似这种 selected="${(option.name == type.value || option.id == type.value) ? "selected" : ""}" 是行不通的！！
                            if (option.name == type.value || option.id == type.value) {

                                html += `<option value="${option.id}"  selected="${(option.name == type.value || option.id == type.value) ? "selected" : ""}">${option.name}</option>`;

                            } else {

                                html += `<option value="${option.id}">${option.name}</option>`;
                            }

                        });

                        //如果types里不只有一个值 那就可以加 自定义内容
                        //如果是 分类 的下拉框 他是不允许加自定义内容的
                        if (types_length > 1) {

                            html += `<option value="">自定义内容</option>`;
                        }

                        html += `</select>`;


                    } else {

                        //否则就是input
                        html += `<input type="text" class="form-control fieldName-input build-input" name="${types_length > 1 ? "" : "data[run_method][build][columns][" + num + "][value]"}" value="${type.value}" onblur="buildValueStorageBlur(this)">`;
                    }

                    if (type.value != "") {
                        type_value = type.value;
                    }

                });



                html += `</div>`;

                let value_type = getValueType(item.types);

                html += `<input type="hidden" name="data[run_method][build][columns][${num}][name]" value="${item.column}">
                            <!--是否必填-->
                            <input type="hidden" name="data[run_method][build][columns][${num}][required]" value="${item.required}">
                            <!--数据的类型  根据里面的value来判断 如果第0个不为空 那就就是第0个的type 否则就是第1个--> 
                            <input type="hidden" class="value-type" name="data[run_method][build][columns][${num}][value_type]" value="${value_type}">
                            <!--是否与采集字段绑定-->
                            <input type="hidden" class="build-type" name="data[run_method][build][columns][${num}][build]" value="${item.build}">`;

                if (types_length > 1) {

                    //还是为空的情况下 取第一个下标的值
                    if (type_value == "" && item.hasOwnProperty("data") && typeof (item.data[0]) != "undefined") {

                        type_value = item.data[0].id;
                    }

                    // <!--绑定对应的值 也许是字段的名称 也许是自定义input值或cms里select的值-->
                    html += `<input type="hidden" class="build-value-storage" name="data[run_method][build][columns][${num}][value]" value="${type_value}" >`;
                }

                //非必填字段 要有个删除的按钮
                if (parseInt(item.required) === 0) {
                    html += `<button type="button" class="btn red btn-sm" onclick="delCmsCustomField(this)" data-column="${item.comment}" data-comment="${item.comment}" data-data_type="${item.data_type}">删除</button>`;
                }

                html += `</div>`;

                obj.append(html);

                num++;

            }

        });

        //添加自定义字段的下拉框
        html = `<div id="cms_custom_container"></div>
                                <div class="handmethod-item border-bottom-line">
                                <div class="title">自定义字段</div>
                                <div class="add-custom-field">
                                    <select class="build-select form-control data_origin-select" name="" id="select_cms_custom_field" onchange="selectCmsCustomField(this)">`;

        data.map((item, index) => {

            //如果属于不显示的内容 那就是自定义字段 所以要在这个下拉框渲染
            if (!isShowFieldsHtml(item)) {

                html += assemblyCmsCustomOption(item.column, item.comment, item.data_type);
            }

        });

        html += `</select>
                     <button type="button" class="btn blue btn-sm" onclick="addCmsCustomField(this)" id="add_cms_custom_field">添加</button>
                     </div>
                 </div>`;

        obj.append(html);

    } else {
        alert(result.msg);
    }

    showBuildInput();
}


function getValueType(types) {

    //设个默认值
    let value_type = types[0].type;

    for (let item of types) {

        if (item.value != "") {
            value_type = item.type;
            break;
        }
    }

    return value_type;
}

//这个函数的作用是 如果是自定义内容 那就显示input框 并最后一个option选中
//如果不是自定义内容 那就隐藏input框
function showBuildInput() {

    $(".build-container").each(function () {

        let selected = $(this).find(".build-select option:first").val();
        let input_obj = $(this).find(".build-input");

        if (input_obj.length > 0) {

            if (selected !== "") {

                if (input_obj.val() === "") {

                    input_obj.hide();

                } else {

                    //让最后一个option选中
                    $(this).find(".build-select option:last").prop("selected", true);

                }

            } else {

                input_obj.show();
            }
        }

    });

}


function assemblyCmsCustomOption(column, comment, data_type) {

    return `<option value="${column}" data-column="${column}" data-comment="${comment}" data-data_type="${data_type}">${column} ---类型：${data_type}${comment != "" ? " ---备注：" + comment : ""}</option>`;
}

function delCmsCustomField(obj) {

    obj = $(obj);

    let column = obj.attr("data-column");
    let data_type = obj.attr("data-data_type");
    let comment = obj.attr("data-comment");

    $("#select_cms_custom_field").append(assemblyCmsCustomOption(column, data_type, comment));

    obj.parent(".handmethod-item").remove();
}

//添加自定义字段后
//要删除对应的option
//同理 如果删除了自定义字段
//那么就要往这个下拉框增加对应的自定义字段进来
function addCmsCustomField(obj) {

    let option_obj = $("#select_cms_custom_field").find("option:selected");

    let column = option_obj.attr("data-column");
    let data_type = option_obj.attr("data-data_type");
    let comment = option_obj.attr("data-comment");
    let length = $("#cms_fields .handmethod-item").length - 1;//减1的原因是 排除掉那个添加自定义字段

    //获取采集标签 给绑定字段做可选值 标记
    let collect_columns = getCollectColumns();

    let html = `<div class="handmethod-item border-bottom-line">
                    <div class="title">${column}</div>
                    <div class="build-container">
                        <select class="build-select form-control data_origin-select" name="" onchange="editCustomContent(this)">`;

    collect_columns.map((item, index) => {

        html += `<option value="${item.id}">${item.name}</option>`;

    });

    html += `<option value="">自定义内容</option>`;

    html += `</select>
                        <input type="text" class="form-control fieldName-input build-input" name="" value="" onblur="buildValueStorageBlur(this)">
                        <div>类型：${data_type} 备注：${comment}</div>
                    </div>
                    <input type="hidden" name="data[run_method][build][columns][${length}][name]" value="${column}">
                    <!--是否必填 自定义字段都是0-->
                    <input type="hidden" name="data[run_method][build][columns][${length}][required]" value="0">
                    <!--数据的类型 默认是select-->
                    <input type="hidden" class="value-type" name="data[run_method][build][columns][${length}][value_type]" value="select">
                    <!--是否与采集字段绑定 自定义字段默认绑定-->
                    <input type="hidden" class="build-type" name="data[run_method][build][columns][${length}][build]" value="1">
                    <!--这里 默认为第一个option-->
                    <input type="hidden" class="build-value-storage" name="data[run_method][build][columns][${length}][value]" value="${collect_columns.hasOwnProperty(0) ? collect_columns[0].id : ""}">
                    <button type="button" class="btn red btn-sm" onclick="delCmsCustomField(this)" data-column="${column}" data-comment="${comment}" data-data_type="${data_type}">删除</button>
                </div>`;

    $("#cms_custom_container").append(html);

    option_obj.remove();

    showBuildInput();
}

function selectCmsCustomField(obj) {

}

function buildValueStorageBlur(obj) {

    storageBuildValue(obj, $(obj).val());
}

function storageBuildValue(obj, value) {

    let name = $(obj).attr("name");

    //name为空说明有select和input 也就是不能设置name的情况 那就给hidden框赋值
    if (name == "" && value != "") {

        $(obj).parents(".handmethod-item").find(".build-value-storage").val(value);
    }
}

function editCustomContent(obj) {

    let input_obj = $(obj).parent(".build-container").find(".build-input");
    let value = $(obj).val();

    //如果为空 说明用户选择了 自定义内容
    //则显示自定义内容的input框
    if (value == "") {
        //在这里获取input的value值仅仅是为了给storageBuildValue传值
        //效果是 如果用户在input里输入了 然后不小心切换了下拉框 再切换回来 还能保留之前input输入的数据
        value = input_obj.val();

        //如果是自定义内容 那么就要修改build为0 如果build为1 提交到后端后 后端会认为是从采集标签里面拿
        $(obj).parents(".handmethod-item").find(".build-type").val(0);

        //自定义内容的情况下 value_type会是input
        $(obj).parents(".handmethod-item").find(".value-type").val("input");

        input_obj.show();

    } else {

        $(obj).parents(".handmethod-item").find(".build-type").val(1);

        //下拉框的情况下 value_type会是select
        $(obj).parents(".handmethod-item").find(".value-type").val("select");
        input_obj.hide();
    }

    storageBuildValue(obj, value);

}

//删除字段列表Tr
function delete_fieldTr(_this, _id) {

    $(_this).parents("tr").remove();

    fieldTableUpdateIndex();//更新index

    //表示为空
    if ($(".field-table .table tbody tr").length == 0) {
        $(".field-table .table tbody").html(`
                      <tr class="odd gradeX no-data">
                            <td style="text-align:center;height:100px" colspan="5"> 
                                  <div class="empty-content">
                                       <img src="${THEME_PATH}/assets/images/no-data.gif" alt="数据为空" />
                                        <p>数据为空！</p>
                                  </div>
                            </td>
                      </tr>
                 `);
    }

    //重新获取绑定字段的可选值
    reloadBuildColumns();

}

/**
 * @desc 专门更新 表格 name=  index的索引同步；
 * */
function fieldTableUpdateIndex() {

    $(".field-table .table tbody tr").each((index, item) => {

        $(item).find("input").each((childIndex, childItem) => {

            //$(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][sort]`);

            let oldNameStr = $(childItem).attr("name");
            let updataNameIndex = oldNameStr.replace(/[0-9]/g, index);

            $(childItem).attr("name", updataNameIndex);
            $(childItem).addClass(`${updataNameIndex}`);

            /*switch( childIndex ){
                case 0:
                    $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][sort]`);
                    break;
                 case 1:
                    $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][field_name]`);
                    break;
                 case 2:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][dataorigin_text]`);
                    break;
                 case 3:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][data_origin]`);
                    break;
                 case 4:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][get_type]`);
                    break;
                 case 5:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][get_typevalue]`);
                    break;
                 case 6:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][rule]`);
                    break;
                 case 7:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][finally_joint]`);
                    break;
                 case 8:
                     $(childItem).attr('name',`data[ContentGet][fieldlist_Table][${index}][title_deleteAgain]`);
                    break;
            } */
        });
    });

}

/**
 * @desc 确定数据处理的弹出框
 * @param {DOM}     globalTrNode  当前节点Tr
 * @param {Number}  globalTrIndex 当前表格索引
 * */
function CommitDataDispose() {
    let dataArr = [];
    //存放处理方法 跟dataArr耦合
    //如果遍历dataArr dataArr的下标放到type_names里 将会是处理方法的类型
    let type_names = [];

    $("#Tablefield_DataDispose_Modal .Addmethods-content .Addmethods-item").each((index, item) => {

        let TempObj = {};

        type_names.push($(item).attr("data-type"));


        $(item).find(".panel-body input").each((childIndex, childItem) => {
            if($(childItem).attr("name")){
                TempObj[$(childItem).attr("name")] = $(childItem).val();
            }
        });

        $(item).find(".panel-body select").each((childIndex, childItem) => {
            if($(childItem).attr("name")){
                TempObj[$(childItem).attr("name")] = $(childItem).val();
            }
        });

        $(item).find(".panel-body textarea").each((childIndex, childItem) => {
            if($(childItem).attr("name")){
                TempObj[$(childItem).attr("name")] = $(childItem).val();
            }
        });

        dataArr.push(JSON.parse(JSON.stringify(TempObj)));
    });

    //渲染数据处理的方法放到隐藏域，渲染到当前行的td内容。用于提交
    let InputNode = "";

    dataArr.forEach((item, index) => {
        //数据处理方法的类型 这个字段很重要 在DataDispose函数中会用到
        let data_type = type_names[index];

        for (let key in item) {

            InputNode += `<input class="${key}" type="hidden" name="${key}" value="${item[key]}" data-type="${data_type}">`;
        }
    });

    globalTrNode.find(".other .datadispose-box").html(InputNode);

    $("#Tablefield_DataDispose_Modal").modal("hide");
}


//--------------------------------------------------------------------------------数据处理（通用）--------------------------------------------------------------------------

//添加数据处理（通用）
function AddDataDispose() {

    $("#DataDispose_Modal").modal("show");

}

//监听select 处理方法
let UnifyProcessMethods_Val;

let tipText_UnifyProcessMethods = "";

/**
 *
 * @desc 监听处理方法 select控件
 *
 * */
function UnifyProcessMethods_change(_this) {
    UnifyProcessMethods_Val = $(_this).val();
    tipText_UnifyProcessMethods = $(_this).find("option:selected").text();
}


//添加方法
function UnifyAddmethods() {

    if (!UnifyProcessMethods_Val) {
        layer.msg("请选择处理方法！");
        return;
    }
    /**
     * @desc 用于判断数据处理方法添加 是否重复， 不能添加同一个方法。
     *
     * */
    if (UnifyProcessMethods_Val_stateArr.length > 0) {
        let flag = false;
        for (let i = 0; i < UnifyProcessMethods_Val_stateArr.length; i++) {
            let item = UnifyProcessMethods_Val_stateArr[i];
            if (item == UnifyProcessMethods_Val) {
                flag = true;
                break;
            }
        }
        if (flag) {
            layer.msg("您重复添加（" + tipText_UnifyProcessMethods + "）方法了！");
            return;
        }

        UnifyProcessMethods_Val_stateArr.push(UnifyProcessMethods_Val);
    } else {
        UnifyProcessMethods_Val_stateArr.push(UnifyProcessMethods_Val);
    }

    //---end------

    //渲染 添加的统一数据处理 数据处理的方法节点
    UnifyrenderMethods(UnifyProcessMethods_Val);
}

/**
 *
 * @desc 渲染 统一数据处理 数据处理的方法节点
 * @param {string} UnifyProcessMethods_Val
 *
 * */
function UnifyrenderMethods(UnifyProcessMethods_Val) {

    let html_Node = "";
    switch (UnifyProcessMethods_Val) {
        case "replace":  //内容替换
            html_Node = `
                            <div class="Addmethods-item ${UnifyProcessMethods_Val}-item" data-type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">内容替换</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                               <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][unify_datadispose][replace][old_content]"></textarea>           
                                               <div style="margin: 5px 0;font-size: 15px;">替换成</div>
                                               <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][unify_datadispose][replace][content_replace]"></textarea>
                                        </div>
                                </div>
                            </div>`;

            break;
        case "batch": //批量替换
            html_Node = `
                            <div class="Addmethods-item ${UnifyProcessMethods_Val}-item" type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">批量替换</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                               <textarea class="form-control" style="height: 130px; margin: 0px;"  name="data[run_method][ContentGet][unify_datadispose][batch][batch_replace]"></textarea>    
                                               <p class="help-block">替换词，用“=”分隔，用“、”分隔 例如：aa=bb、cc=dd 即将“aa”替换成“bb”,“cc”替换成“dd”</p>
                                        </div>
                                 </div>
                            </div>`;

            break;
        case "filter": //关键词过滤
            html_Node = `<div class="Addmethods-item ${UnifyProcessMethods_Val}-item" type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">关键词过滤</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                        <p class="help-block">每个关键词，用“、”分隔，例如：aa、bb、cc</p>
                                        <textarea class="form-control " style="height: 130px; margin: 0 0 20px 0;" name="data[run_method][ContentGet][unify_datadispose][filter][keywords_filter]" placeholder="填写关键词"></textarea>   
                                            
                                            <div class="mb20">
                                                <label class="mb10">
                                                    <input type="radio"  value="1" name="data[run_method][ContentGet][unify_datadispose][filter][type]">关键词替换为
                                                </label>
                                                <input type="text" class="form-control fieldName-input" name="data[run_method][ContentGet][unify_datadispose][filter][replace]">
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="2" name="data[run_method][ContentGet][unify_datadispose][filter][type]">检测到关键词则将该字段值设为空
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="3" name="data[run_method][ContentGet][unify_datadispose][filter][type]">检测到关键词则不采集该条数据
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="4" name="data[run_method][ContentGet][unify_datadispose][filter][type]">未检测到关键词则将该字段值设为空
                                                </label>
                                            </div>
                                            
                                            <div class="mb10">
                                                <label>
                                                    <input type="radio"  value="5" name="data[run_method][ContentGet][unify_datadispose][filter][type]">未检测到关键词则不采集该条数据
                                                </label>
                                            </div>    
                                            
                                        </div>
                                 </div>
                            </div>`;

            break;
        case "if": //条件判断
            html_Node = `
                            <div class="Addmethods-item ${UnifyProcessMethods_Val}-item" type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">条件判断 包含关键词就采集</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                                <div class="handmethod-item border-bottom-line">
                                                         <div class="title" style="background-color:#fff;">条件判断</div>
                                                         <select  class="form-control" style="border-radius: 0px 5px 5px 0px;" onchange="ProcessMethods_change(this)">
                                            			        <option value="1">包含关键词就采集</option>
                                            			</select>
                                                </div>
                                                
                                                <div class="Addjudge-box"> 
                                                    <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][unify_datadispose][if][contains_value]" placeholder="填写关键词"></textarea>                             
                                                    <p class="help-block">每个关键词 用“、”分隔，例如：aa、bb、cc </p>
                                                </div>
                                        </div>
                                 </div>
                            </div>`;

            html_Node += `
                            <div class="Addmethods-item ${UnifyProcessMethods_Val}-item" type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">条件判断 不包含关键词就采集</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                                <div class="handmethod-item border-bottom-line">
                                                         <div class="title" style="background-color:#fff;">条件判断</div>
                                                         <select  class="form-control" style="border-radius: 0px 5px 5px 0px;" onchange="ProcessMethods_change(this)">
                                            			        <option value="1">不包含关键词就采集</option>
                                            			</select>
                                                </div>
                                                
                                                <div class="Addjudge-box"> 
                                                    <textarea class="form-control" style="height: 130px; margin: 0px;" name="data[run_method][ContentGet][unify_datadispose][if][not_contains_value]" placeholder="填写关键词"></textarea>                             
                                                    <p class="help-block">每个关键词 用“、”分隔，例如：aa、bb、cc </p>
                                                </div>
                                        </div>
                                 </div>
                            </div>`;
            break;
        case "substr": //截取字符串

            html_Node = `<div class="Addmethods-item ${UnifyProcessMethods_Val}-item" type="${UnifyProcessMethods_Val}">
                               <div class="panel panel-success">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">字符串截取</h5>
                                            <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${UnifyProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                                        </div>
                                        <div class="panel-body">
                                               <span class="fz16">截取长度</span> 
                                               <input type="text" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][unify_datadispose][substr][length]" >
                                               <span class="fz16">增加开始字符</span> 
                                               <input type="text" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][unify_datadispose][substr][start]">
                                               <span class="fz16">增加结尾字符</span> 
                                               <input type="text" class="form-control fieldName-input" name="data[run_method][ContentGet][unify_datadispose][substr][end]">
                                        </div>
                                 </div>
                            </div>`;


            break;
        /* // 全局数据处理
        case "remove": //移除标签
            html_Node += `<div class="Addmethods-item ${ProcessMethods_Val}-item" data-type="${ProcessMethods_Val}">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                <h5 class="panel-title">移除标签</h5>
                                <a href="javascript:void(0)" onclick="UnifyDeleteAddmethods(this,'${ProcessMethods_Val}')" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除</a>
                            </div>
                            <div class="panel-body">
                                <div class="panel-body">
                                    <span class="fz16">移除类型</span>
                                    <select onchange="removeTypeChange(this)" class="form-control mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_type]" lay-verify="">
                                        <option value="">请选择移除类型</option>
                                        <option value="1">从内容开头移除</option>
                                        <option value="2">从内容结尾移除</option>
                                        <option value="3">按照标签属性全文移除</option>
                                    </select>
                                    <div id='remove_type_content'>
                                        <div id='remove_type_12' style='display:none;'>
                                            <span class="fz16">标签</span>
                                            <input type="text" placeholder="请输入被移除的标签，如：div，不填则移除所有标签" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag]">
                                            <span class="fz16">移除开始序号</span>
                                            <input type="text" placeholder="从第几条标签移除" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_number_start]">
                                            <span class="fz16">移除数量</span>
                                            <input type="text" placeholder="移除数量" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][remove_number_end]">
                                        </div>
                                        <div id='remove_type_3' style='display:none;'>
                                            <span class="fz16">属性名</span>
                                            <input type="text" placeholder="请输入标签属性名" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag_attr_name]">
                                            <span class="fz16">属性值</span>
                                            <input type="text" placeholder="请输入标签属性值" class="form-control fieldName-input mb10" name="data[run_method][ContentGet][fieldlist_Table][${globalTrIndex}][datadispose][remove][tag_attr_value]">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        break;
        */
        //.... 后续再添加判断
    }

    $(".Data-dispose .Addmethods-content").append(html_Node);

    $("#DataDispose_Modal").modal("hide");
}


/**
 *
 * @desc 删除方法
 * @param {DOM}  当前节点
 * @param {string} 当前方法
 *
 * */
function UnifyDeleteAddmethods(_this, _type) {

    $(_this).parents(".Addmethods-item").remove();

    //删除状态数组
    for (let i = 0; i < UnifyProcessMethods_Val_stateArr.length; i++) {
        let item = UnifyProcessMethods_Val_stateArr[i];
        if (item == _type) {
            UnifyProcessMethods_Val_stateArr.splice(i, 1);
            break;
        }
    }
}
