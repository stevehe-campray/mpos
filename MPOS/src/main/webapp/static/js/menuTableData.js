//jquery插件把表单序列化成json格式的数据start 
(function($){
    $.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };  
})(jQuery);
/**
 * 加载数据
 * @returns {String}
 */
function loadAllMenu(){
	var res = "";
	$.ajax({
        "dataType": 'json', 
        "type":'GET',
        "async":false,
        "url": rootURI+"menu/loadMenu?rand="+Math.random(), 
        "success": function(resp,status){
       	 if(status == "success"){  
       		 if(resp.status){
       			 res = resp.menus;
       			 return  res;
				}
			}             	 
        }
      });
	return res;
}
/**
 * 加载下拉框列表
 * @param selectId 下拉框
 */
function loadSelect(select){
	//清空下拉框列表
	select.empty();
	select.append("<option value='0'>[NONE]</option>");
	var menus = loadAllMenu();
	if(menus !=""&&menus.length!=null&&menus.length>0){
		for (var int = 0; int < menus.length; int++) {
			select.append("<option value='"+menus[int].id+"'>"+menus[int].title+"</option>");
		}
	}
}
/**
 * 加载多语言化
 */
var loadLocal = function(menuId){
	var res = "";
	$.ajax({
        "dataType": 'json', 
        "type":'GET',
        "async":false,
        "url": rootURI+"menu/getLocal/"+menuId+"?rand="+Math.random(),
        "success": function(resp,status){
       	 if(status == "success"){  
       		 if(resp.status){
       			 res = resp.localTitles;
				}
			}             	 
        }
      });
	setLocal(res);
}

var setLocal = function(localTitles){
	if(localTitles!=""&&localTitles.length!=null&&localTitles.length>0){
		for (var int = 0; int < localTitles.length; int++) {
			var lan = localTitles[int];
			$("#editMenuForm input[name='localizedFieldFirst["+int+"].localeValue']").val(lan.localeValue);
			$("#editMenuForm input[name='localizedFieldFirst["+int+"].language.id']").val(lan.language.id);
			$("#editMenuForm input[name='localizedFieldFirst["+int+"].tableField']").val(lan.tableField);
			$("#editMenuForm input[name='localizedFieldFirst["+int+"].localeId']").val(lan.localeId);
		}
	}
}
var rootURI="/";
var MenuTable = function () {
	var oTable;
	var handleTable = function () {
		var selected = [];
		var table=$('#menu_table');
		oTable = table.dataTable({
			"lengthChange":false,
        	"filter":true,
        	"sort":false,
        	"info":true,
        	"scrollX":"100%",
        	"scrollXInner":"100%",         	
        	"processing":true,                
            // set the initial value
            "displayLength": 10,
            "dom": "t<'row'<'col-md-6'i><'col-md-6'p>>",
            "columnDefs": [{                    
                    'targets': 0,   
                    'render':function(data,type,row){
                    	return '<div class="checker"><span><input type="checkbox" class="checkboxes"/></span></div>';
                    },
                    //'defaultContent':'<div class="checker"><span><input type="checkbox" class="checkboxes" value="1"/></span></div>'                    
                }
            ],
            "columns": [
               {"orderable": false },
	           { /*title: "ID", */  data: "id"},
	           { /*title: "Name",*/    data: "title" },
	           { /*title: "Sort", */   data: "sort"}
	          ],
	        "serverSide": true,
	        "serverMethod": "GET",
	        "ajaxSource": rootURI+"menu/menuList?rand="+Math.random()

		});		

		//打开删除对话框前判断是否已选择要删除的行
		$("#openDeleteMenuModal").on("click",function(event){
			if(selected.length==0){
				handleAlerts("Please select the rows which you want to delete.","warning","");				
				return false;
			}
		});
		
		//删除操作
		$('#deleteBtn').on('click', function (e) {
			$.ajax( {
             "dataType": 'json', 
             "type": "DELETE", 
             "url": rootURI+"menu/menu/"+selected.join(), 
             "success": function(data,status){
            	 if(status == "success"){					
					 if(data.status){
						 selected=[];
		            	 oTable.api().draw();
		            	 loadSelect($("#edit_select"));
		            	 oTable.$('th span').removeClass();
					 }
					 else{
						 handleAlerts("Failed to delete the data. " +data.info,"danger","");
					 }
				}             	 
             },
             "error":function(XMLHttpRequest, textStatus, errorThrown){
            	 alert(errorThrown);
             }
           });
        });  
		
		$("#openAdd").on("click",function(event){
			loadSelect($("#add_select"));
		});
		
		
		$("#openEditMenuModal").on("click",function(event){
			if(selected.length!=1){
				handleAlerts("One and only one row can be edited.","warning","");		
				return false;				
			}
			else{
				var data = oTable.api().row($("tr input:checked").parents('tr')).data();
				$("tr input:checked").parents('span').removeClass("checked");
				$("tr input:checked").removeAttr("checked");
				var menuId = data.id;
	            var sort  = data.sort;
	            var pid  = data.pid;
	            var title = data.name;
	            var style = data.styleType;
	            
	            $("#editMenuForm :radio").removeAttr("checked");
	            $("#editMenuForm :radio").parents('span').removeClass("checked");
	            
	            $("#editMenuForm option").removeAttr("selected");
	            $("#editMenuForm option[value='"+menuId+"']").remove();
	            
	            $("#editMenuForm select[name='menu.pid']").children("option[value='"+pid+"']").attr("selected","true");
	            $("#editMenuForm input[name='menu.menuId']").val(menuId);
	            
	            $("#editMenuForm :radio[name='menu.styleType']").filter("[value='"+style+"']").attr("checked","true");
	            $("#editMenuForm :radio[name='menu.styleType']").filter("[value='"+style+"']").parents('span').addClass("checked");
	            
	            $("#editMenuForm input[name='menu.title']").val(title);
	            $("#editMenuForm input[name='menu.sort']").val(sort);
	            
	            selected = [];
	            loadLocal(menuId);
			}
		});								
		
		//搜索表单提交操作
		$("#searchForm").on("submit", function(event) {
			event.preventDefault();
			var jsonData=$(this).serializeJson();
			var jsonDataStr=JSON.stringify(jsonData);			
			oTable.fnFilter(jsonDataStr);
			return false;
		});
				
                       
		//全选
        $(".group-checkable").on('change',function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            selected=[];
            if(checked){            	
	            var api=oTable.api();            
	            jQuery(set).each(function () {            	
	            	var data = api.row($(this).parents('tr')).data();
	            	var id = data.id;
	                var index = $.inArray(id, selected);
	                selected.push( id );
                    $(this).attr("checked", true);
                    $(this).parents('tr').addClass("active");
                    $(this).parents('span').addClass("checked");
	            });
            }
            else{
            	jQuery(set).removeAttr("checked");
            	jQuery(set).parents('tr').removeClass("active");
            	jQuery(set).parents('span').removeClass("checked");
            }
            jQuery.uniform.update(set);
        });
        
        //单选
        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");            
            var data = oTable.api().row($(this).parents('tr')).data();
            var id = data.id;
            var index = $.inArray(id, selected);     
            if ( index === -1 ) {
                selected.push( id );
                $(this).parents('span').addClass("checked");
                $(this).attr("checked","checked");
            } else {
                selected.splice( index, 1 );
                $(this).parents('span').removeClass("checked");
                $(this).removeAttr("checked");
            }
        });
                
        /* handle show/hide columns*/
        var tableColumnToggler = $('#column_toggler');		
		$('input[type="checkbox"]', tableColumnToggler).change(function () {
		    /* Get the DataTables object again - this is not a recreation, just a get of the object */
		    var iCol = parseInt($(this).attr("data-column"));
		    var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
		    oTable.fnSetColumnVis(iCol, (bVis ? false : true));
		});
        
        
	};
	
	//添加操作
	var ajaxAddMenu=function(){	
		$.ajax( {
		 "traditional":true,
         "dataType": 'json', 
         "type":'POST', 
         "url": rootURI+"menu/addMenu", 
         "data": $('#addMenuForm').serialize(),
         "success": function(resp,status){
        	 if(status == "success"){  
        		 if(resp.status){						 
	            	 oTable.api().draw();
	            	 $('#addMenuForm')[0].reset();
	            	 $("#add_menu").modal('hide');
	            	 loadSelect($("#edit_select"));
	            	 handleAlerts("Added the data successfully.","success","#addFormMsg");		            	 
				 }
				 else{
					 handleAlerts("Failed to add the data.","danger","#addFormMsg");						 
				 }
			}             	 
         },
         "error":function(XMLHttpRequest, textStatus, errorThrown){
        	 alert(errorThrown);
         }
       });		
    };
    
	//添加操作
	var ajaxEditMenu=function(){
		$.ajax( {
		 "traditional":true,
         "dataType": 'json', 
         "type":'POST', 
         "url": rootURI+"menu/editMenu", 
         "data": $('#editMenuForm').serialize(),
         "success": function(resp,status){
        	 if(status == "success"){  
        		 if(resp.status){						 
	            	 oTable.api().draw();
	            	 $('#editMenuForm')[0].reset();
	            	 $("#edit_menu").modal('hide');
	            	 loadSelect($("#edit_select"));
	            	 handleAlerts("Edit the data successfully.","success","#editFormMsg");		            	 
				 }
				 else{
					 handleAlerts(resp.info,"danger","#editFormMsg");						 
				 }
			}             	 
         },
         "error":function(XMLHttpRequest, textStatus, errorThrown){
        	 alert(errorThrown);
         }
       });		
    };
    
	//提示信息处理方法（是在页面中指定位置显示提示信息的方式）
	var handleAlerts = function(msg,msgType,position) {
		if(position==""){
			position = $("#msg");
		}
        Metronic.alert({
            container: position, // alerts parent container(by default placed after the page breadcrumbs)
            place: "prepent", // append or prepent in container 
            type: msgType,  // alert's type (success, danger, warning, info)
            message: msg,  // alert's message
            close: true, // make alert closable
            reset: true, // close all previouse alerts first
            focus: false, // auto scroll to the alert after shown
            closeInSeconds: 5, // auto close after defined seconds, 0 never close
            icon: "warning" // put icon before the message, use the font Awesone icon (fa-[*])
        });        

    };
    
    //处理表单验证方法
    var addFormValidation = function() {
            var addform = $('#addMenuForm');
            var errorDiv = $('.alert-danger', addform);            

            addform.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input                
                rules: {
                    "title": {
                        minlength: 2,
                        required: true
                    },
                    "pid": {
                        required: true,
                        maxlength:60                        
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit                	
                    errorDiv.show();                    
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                onfocusout: function (element) { // hightlight error inputs
                    $(element).valid();
                },
                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

                submitHandler: function (form) {                	
                    errorDiv.hide();
                    ajaxAddMenu();                    
                }
            });
    };
    
  //处理表单验证方法
    var editFormValidation = function() {
            var addform = $('#editMenuForm');
            var errorDiv = $('.alert-danger', addform);            

            addform.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input                
                rules: {
                    "title": {
                        minlength: 2,
                        required: true
                    },
                    "pid": {
                        required: true,
                        maxlength:60                        
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit                	
                    errorDiv.show();                    
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                onfocusout: function (element) { // hightlight error inputs
                    $(element).valid();
                },
                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

                submitHandler: function (form) {                	
                    errorDiv.hide();
                    ajaxEditMenu();                    
                }
            });
    };
    

    return {
        //main function to initiate the module
        init: function (rootPath) {
        	rootURI=rootPath;
        	handleTable();  
        	addFormValidation();
        	editFormValidation();
        	loadSelect($("#edit_select"));
        }

    };

}();