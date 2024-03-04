function dr_page_content(id) {
    dr_iframe("<i class=\"fa fa-edit\"></i> 编辑内容", `${SELF}?c=category&m=content_edit&id=${id}`, "90%", "90%", "nogo");
}

function dr_link_url(id) {
    dr_iframe("<i class=\"fa fa-edit\"></i> 编辑地址", `${SELF}?c=category&m=link_edit&id=${id}`, "50%", "40%");
}

function dr_cat_field(id) {
    dr_iframe("<i class=\"fa fa-edit\"></i> 设置栏目自定义字段权限", `${SELF}?c=category&m=field_edit&id=${id}`, "50%", "70%", "nogo");
}

// ajax关闭或启用
function dr_cat_ajax_open_close(e, url, fan) {
    var index = layer.load(2, {
        shade: [0.3, "#fff"], //0.1透明度的白色背景
        time: 10000
    });
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "json",
        success: function (json) {
            layer.close(index);
            if (json.code == 1) {
                if (json.data.share == 1) {
                    if (json.data.value == fan) {
                        $(e).attr("class", "badge badge-no");
                        $(e).html("<i class=\"fa fa-times\"></i>");
                    } else {
                        $(e).attr("class", "badge badge-yes");
                        $(e).html("<i class=\"fa fa-check\"></i>");
                    }
                } else {
                    // 独立模块 dr_is_page_html
                    var obj = $(".dr_is_page_html");
                    if (json.data.value == fan) {
                        obj.attr("class", "dr_is_page_html badge badge-no");
                        obj.html("<i class=\"fa fa-times\"></i>");
                    } else {
                        obj.attr("class", "dr_is_page_html badge badge-yes");
                        obj.html("<i class=\"fa fa-check\"></i>");
                    }
                }
                dr_tips(1, json.msg);
            } else {
                dr_tips(0, json.msg);
            }
        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
        }
    });
}

function dr_cat_ajax_save(value, id) {
    var url = `${SELF}?c=category&m=displayorder_edit&id=` + id;
    var index = layer.load(2, {
        shade: [0.3, "#fff"], //0.1透明度的白色背景
        time: 10000
    });
    $.ajax({
        type: "GET",
        cache: false,
        url: url + "&value=" + value,
        dataType: "json",
        success: function (json) {
            layer.close(index);
            if (json.code == 1) {
                dr_tips(1, json.msg);
            } else {
                dr_tips(0, json.msg);
            }
        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
        }
    });
}

// ajax关闭或启用
function dr_cat_ajax_show_open_close(e, url, fan) {
    var index = layer.load(2, {
        shade: [0.3, "#fff"], //0.1透明度的白色背景
        time: 10000
    });
    var obj = $(e);
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "json",
        success: function (json) {
            layer.close(index);
            if (json.code == 1) {
                if (json.data.value == fan) {
                    obj.attr("class", "badge badge-no");
                    obj.html("<i class=\"fa fa-times\"></i>");
                } else {
                    obj.attr("class", "badge badge-yes");
                    obj.html("<i class=\"fa fa-check\"></i>");
                }
                dr_tips(1, json.msg);
            } else {
                dr_tips(0, json.msg);
            }
        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
        }
    });
}

$(function () {

});

function dr_scjt() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: `${SELF}?c=category&m=scjt_edit`,
        data: $("#myform").serialize(),
        success: function (json) {
            if (json.code == 1) {
                dr_bfb("生成栏目", "", json.msg);
            } else {
                dr_cmf_tips(json.code, json.msg);
            }

        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
        }
    });
}

function dr_scjt2() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: `${SELF}?c=category&m=scjt2_edit`,
        data: $("#myform").serialize(),
        success: function (json) {
            if (json.code == 1) {
                dr_bfb("生成内容", "", json.msg);
            } else {
                dr_cmf_tips(json.code, json.msg);
            }

        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
        }
    });
}

/**
 * 修改使用状态
 * */
function edit_useStatus(_id, _this, _flag) {
    if (_flag) {
        layer.confirm("您确定要停用吗？", {
            title: "修改使用状态",
            btn: ["确定", "取消"] //按钮
        }, function () {
            AjaxUseStatus(_id, _flag);//请求
        }, function () {

        });

    } else {

        layer.confirm("您确定要启用吗？", {
            title: "修改使用状态",
            btn: ["确定", "取消"] //按钮
        }, function () {
            AjaxUseStatus(_id, _flag); //请求

        }, function () {
            //layer.msg('取消');
        });
    }
}

//请求修改用户状态对接
function AjaxUseStatus(_id, _flag) {
    $.ajax({
        type: "POST", dataType: "json",
        url: `/${SELF}?s=Puyicaiji&c=api&m=listOpenStatus`,
        data: {"id": _id, [csrf_token]: csrf_hash},
        async: false, //同步
        success: function (json) {
            if (json.code) {
                //修改成功
                if (_flag) {
                    $(".label-" + _id).html(`
                                        <span class="btn btn-xs red" onclick="edit_useStatus('${_id}',this,false)">已停用</span>
                                   `);
                    layer.msg("停用成功");
                } else {

                    $(".label-" + _id).html(`
                               	    <a href="javascript:void(0);" onclick="edit_useStatus('${_id}',this,true)" class="btn blue btn-xs">启用中</a>
                                  `);
                    layer.msg("启用成功");
                }

            } else {
                layer.alert(json.msg, {icon: 2, title: "提示"});
            }

        },
        error: function (HttpRequest, ajaxOptions, thrownError) {
            layer.alert(HttpRequest, {icon: 2, title: "报错提示"});
        }
    });

}

//修改独立
// 窗口提交
function dr_iframeEdit(type, url, width, height, rt) {

    var title = "";
    if (type == "add") {
        title = "<i class=\"fa fa-plus\"></i> " + lang["add"];
    } else if (type == "edit") {
        title = "<i class=\"fa fa-edit\"></i> " + lang["edit"];
    } else if (type == "send") {
        title = "<i class=\"fa fa-send\"></i> " + lang["send"];
    } else if (type == "save") {
        title = "<i class=\"fa fa-save\"></i> " + lang["save"];
    } else {
        title = type;
    }
    if (!width) {
        width = "500px";
    }
    if (!height) {
        height = "70%";
    }

    if (is_mobile_cms == 1) {
        width = "95%";
        height = "90%";
    }

    layer.open({
        type: 2,
        title: title,
        fix: true,
        scrollbar: false,
        maxmin: true,
        resize: true,
        shadeClose: true,
        shade: 0,
        area: [width, height],
        btn: [lang["ok"], lang["esc"]],
        yes: function (index, layero) {
            var body = layer.getChildFrame("body", index);
            $(body).find(".form-group").removeClass("has-error");
            // 延迟加载
            var loading = layer.load(2, {
                shade: [0.3, "#fff"], //0.1透明度的白色背景
                time: 100000000
            });
            $.ajax({
                type: "POST", dataType: "json", url: url, data: $(body).find("#myform").serialize(),
                success: function (json) {
                    layer.close(loading);
                    if (json.code) {
                        layer.close(index);
                        if (json.data.tourl) {
                            setTimeout("window.location.href = '" + json.data.tourl + "'", 2000);
                        } else {
                            if (rt == "nogo") {

                            } else {
                                setTimeout("window.location.reload(true)", 2000);
                            }
                        }
                        if (json.data.htmlfile) {
                            // 执行生成htmljs
                            $.ajax({
                                type: "GET",
                                url: json.data.htmlfile,
                                dataType: "jsonp",
                                success: function (json) {
                                },
                                error: function () {
                                }
                            });
                        }
                        if (json.data.htmllist) {
                            // 执行生成htmljs
                            $.ajax({
                                type: "GET",
                                url: json.data.htmllist,
                                dataType: "jsonp",
                                success: function (json) {
                                },
                                error: function () {
                                }
                            });
                        }
                        dr_cmf_tips(1, json.msg);
                    } else {
                        $(body).find("#dr_row_" + json.data.field).addClass("has-error");
                        dr_cmf_tips(0, json.msg);
                    }
                    return false;
                },
                error: function (HttpRequest, ajaxOptions, thrownError) {
                    dr_ajax_alert_error(HttpRequest, ajaxOptions, thrownError);
                }
            });
            return false;
        },
        success: function (layero, index) {
            // 主要用于后台权限验证
            var body = layer.getChildFrame("body", index);
            var json = $(body).html();
            if (json.indexOf("\"code\":0") > 0 && json.length < 500) {
                var obj = JSON.parse(json);
                layer.close(index);
                dr_cmf_tips(0, obj.msg);
            }
        },
        content: url + "&is_ajax=1"
    });
}

function performCollectTask(obj, id) {

    let loading = layer.msg('加载中...', {icon: 16, shade: 0.3, time:10*1000});

    //console.log('???');

    let limit = 0;

    $.ajax({
        type: "get",
        url: '/' + SELF +`?s=puyicaiji&c=home&m=run&mode=list&id=${id}`, // 采集列表
        sync: false,
        datatype: "json",
        success: function (result) {
            layer.close(loading);

            result = JSON.parse(result);

            if (result.code == 200) {
                layer.msg(result.msg, function () {

                    layer.msg('正在采集内容中...', function () {

                        layer.open({
                            title: '采集内容反馈,此页面可以关掉',
                            type: 2,
                            area: ['80%', '70%'],
                            fix: false,
                            maxmin: true,
                            content: '/' + SELF + `?s=puyicaiji&home&m=collectFeedback&task_id=${id}&limit=${limit}`,
                            success: function (layero, index) {
                            },
                            end: function () {
                            }

                        })

                    });

                });

            }
            else{
                layer.alert(result.msg);
            }
        },
        error:function () {
            layer.close(loading);
        },

    });

}