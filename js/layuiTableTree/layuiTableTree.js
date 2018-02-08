var menuTreeManage = {
	view: $('#treeMenu'),
	//url:url_menuSelect,
	createLi: function(i, obj) {
		var li = $('<li></li>');
		var str = '';
		if(typeof obj.children == 'undefined') { //展开收起判断-没有子菜单 
			str += '<i class="layui-icon layui-tree-spread"></i>';
		} else if(typeof obj.open !='undefined' && !!obj.open){
			str += '<i class="layui-icon layui-tree-spread">&#xe625;</i>';
		} else {
			str += '<i class="layui-icon layui-tree-spread">&#xe623;</i>';
		}
		str += '<a>'
		if(obj.parentId === -1 || (typeof obj.type != 'undefined' && obj.type === 0)) {
			str += '<i class="layui-icon layui-tree-branch"></i>';
			str += '<cite>' + obj.name + '</cite>';
			str += '<i class="layui-icon layui-icon-function layui-icon-add" title="新增子级">&#xe654;</i>';
		} else {
			str += '<i class="layui-icon ">&#xe621;</i>';
			if(typeof obj.type != 'undefined' && obj.type === 1) {
				str += '<cite title="' + obj.url + '" class="link-line">' + obj.name + '</cite>';
			} else {
				str += '<cite>' + obj.name + '</cite>';
			}
		}
		str += '<i class="layui-icon layui-icon-function layui-icon-edit" title="编辑">&#xe642;</i>';
		str += '<i class="layui-icon layui-icon-function layui-icon-delete" title="删除">&#x1006;</i>';
		str += '</a>';
		li.html(str);
		return li;
	},
	initCallback:function(_this,view){
		view.on('click','.layui-icon-add',function (e) {
			e.stopPropagation();
			_this.opt.addCallback($(this),$(this).parents('li').data('data'),_this);
			
		});
		view.on('click','.layui-icon-edit',function (e) {
			e.stopPropagation();
			_this.opt.editCallback($(this),$(this).parents('li').data('data'),_this);
			
		});
		view.on('click','.layui-icon-delete',function (e) {
			e.stopPropagation();
			_this.opt.deleteCallback($(this),$(this).parents('li').data('data'),_this);
		});
	},
	addCallback: function(btn, data,_this) {
		console.log('add',btn,data);
		newOrder({
			parentId: data.menuId,
			type: 1
		},btn,_this);
	},
	editCallback: function(btn, data,_this) {
		console.log('edit',btn,data);
		newOrder(data,btn,_this);
	},
	deleteCallback: function(btn, data,_this) {
		console.log('delete',btn,data);
		deleteMenu(data,btn,_this);
	}
}


function MenuTree (data) {
	this.opt = $.extend({
		view:$('#treeMenu'),
		url:'data.json',
		createLi:function(i,obj){
			var li = $('<li></li>');
			var str ='';
			if(typeof obj.children == 'undefined') { //展开收起判断-没有子菜单 
				str += '<i class="layui-icon layui-tree-spread"></i>';
			} else if(typeof obj.open !='undefined' && !!obj.open){
				str += '<i class="layui-icon layui-tree-spread">&#xe625;</i>';
			} else {
				str += '<i class="layui-icon layui-tree-spread">&#xe623;</i>';
			}
			str += '<a>'
			if( obj.parentId === -1 || ( typeof obj.type != 'undefined' && obj.type === 0 ) ){
				str += '<i class="layui-icon layui-tree-branch"></i>';	
				str += '<cite>'+obj.name+'</cite>';
			}else{
				str += '<i class="layui-icon ">&#xe621;</i>';
				if(typeof obj.type != 'undefined' && obj.type === 1){
					str += '<cite title="'+obj.url+'" class="link-line">'+obj.name+'</cite>';					
				}else{			
					str += '<cite>'+obj.name+'</cite>';
				}
			}
			str += '</a>';
			li.html(str);
			return li;
		}
	},data);
	//原始菜单列表 
	this.list = [];
	//将列表按照.parentId属性的值进行升序排列
	this.sortlist = [];
	//存储 menuid
	this.menuid = [];
	//存储根据 parent 分类好的菜单 menu[{name:'一级菜单',children:[{name:'二级菜单',children:[]}]}]
	this.menu = [];
	//按等级分类的菜单 menulv[arr1[{name:'一级菜单'}],arr2[{name:'二级菜单'}],...]
	this.menulv = [];
	//操作展开的，保存以便刷新时判断展开
	this.nowOpen = [];
}
MenuTree.prototype.createLi = function(){
	var _this = this;
	var opt = this.opt;
};
MenuTree.prototype.init = function (fun) {
	var _this = this;
	//挂载基础事件
	var view = this.opt.view; 
	if(!view.hasClass('add-event')){
		view.on('click','.layui-tree-spread',function (e) {
			e.stopPropagation();
			var btn = $(this);
			var data = btn.parent('li').data('data');
			if(btn.hasClass('active')){
				btn.html('&#xe623;');
				btn.removeClass('active');
				_this.nowOpenRemove(data);
			}else{
				btn.html('&#xe625;');
				btn.addClass('active');
				_this.nowOpenAdd(data);
			}
			//$(this).siblings('ul').slideToggle();
			
		}).addClass('layui-box layui-tree add-evnet');
	}
	//ajax获取元素列表  > 列表排序 > 列表分类、分级
	this.getMenuListAll(function(data){
		//console.log('layuiTableTree.js p151 ajax success',data,data.data.length);
		//列表排序
		_this.sortMenuList();
		//视图
		_this.refreshView();
		
		if(typeof _this.opt.initCallback== 'function'){
			_this.opt.initCallback(_this,_this.opt.view);
		}
		if(typeof fun == 'function'){
			fun(_this.opt.view);
		}
	});
	return this;
}
MenuTree.prototype.refresh = function (fun) {
	var _this = this;
	this.getMenuListAll(function(data){
		console.log('layuiTableTree.js p151 ajax success',data,data.data.length);
		//列表排序
		_this.sortMenuList();
		//视图
		_this.refreshView();
		if(typeof _this.opt.refreshCallback== 'function'){
			_this.opt.refreshCallback(_this,_this.opt.view);
		}
		if(typeof fun == 'function'){
			fun(_this,_this.opt.view);
		}
	});
}
MenuTree.prototype.getMenuListAll = function (fun) {
	var _this = this;
	ajax({
		type:'get',
		info:'获取所有菜单列表',
		url:_this.opt.url,
		data:{
			hash:new Date().getTime()
		},
		success:function(data) {
			_this.list = data.data;
			if(typeof fun == 'function'){
				fun(data);
			}
		}
	})
};

MenuTree.prototype.sortMenuList = function () { //对列表进行分类排列
	var _this = this;
	//将列表按照.parentId属性的值进行升序排列
	_this.sortlist = _this.list.sort(function (a,b) {
		//console.log(a.parentId , b.parentId,a.parentId - b.parentId);
		return a.parentId - b.parentId;
	});
	console.log(_this.sortlist);
	//将排序列表分类、分级
	_this.menuClassify();
}

MenuTree.prototype.menuClassify = function () { //将排序列表分类（this.menu）、分级(this.menulv)
	var _this = this;
	//指向排序的菜单列表
	var _sortlist = _this.sortlist;
	//存储 parentID的种类
	var	menuid = _this.menuid =[];
	//存储根据 parent 分类好的菜单
	var menu = _this.menu =[];
	//存储不同等级的 menu
	var menulv =_this.menulv = [];
	
	//开始循环菜单列表,获取menuid 数组
	for (var i = 0 ;i<_sortlist.length;i++) {
		menuid.push(_sortlist[i].menuId);
	}
	
	//开始分级
	for(var i = 0 ; i<_sortlist.length;i++){
		var forobj = _sortlist[i];
		//每次循环获取 目标的pid
		var pid = forobj.parentId;
		//console.log('--- pid = ' ,pid);
		//再次循环 _this.sortlist 列表，对比列表中时候存在 pid === id
		var judge = true;
		for(var j = 0; j < menuid.length ; j ++){
			var id = menuid[j];
			//console.log('  |--- id = ' ,id,pid === id);
			if(pid === id){
				//存在，则当前菜单不是一级菜单
				judge = false;
			}
		}
		//console.log('--- pid = ' ,pid,judge,forobj.menuId);
		//菜单等级
		var lv = 1;
		if(judge){ //循环menuid列表  pid !== id ,则为一级菜单
			forobj.lv = lv;
			typeof menulv[lv-1] == 'object' && menulv[lv-1] instanceof Array ? menulv[lv-1].push(forobj) : menulv[lv-1] = [forobj];
			menu.push(forobj);
		}else{ // 循环menuid列表  pid === id,则为子菜单,
			//循环menulv ,查找匹配id 的父级菜单
			var result = eachMenulvArr(menulv,pid);
			if(result){
				forobj.lv = lv = result.lv;
				typeof menulv[lv-1] == 'object' && menulv[lv-1] instanceof Array ? menulv[lv-1].push(forobj) : menulv[lv-1] = [forobj];
				result.obj.children = typeof result.obj.children == 'undefined' ? [] : result.obj.children;
				result.obj.children.push(forobj);
				result.obj.children.sort(function(a,b){
					return a.orderNum - b.orderNum;
				})
			}else{
				console.log("forobj【menuID="+forobj.menuId+"】 找不到对应的父元素");
			}
		}
		
	}
}
function eachMenulvArr(arr,pid,num) { //循环二维数组 menulv = arr[arr[],arr[],arr[],...],menu[0][0]开始循环，查看是否有 pid指向的父元素
	if(typeof arr == 'undefined' || arr.length<=0 || typeof pid == 'undefined') { return false;}
	var len = arr.length;
	var n = num || 0;
	var a = arr[n];
	var judge = false;
	for(var i = 0; i < a.length;i++){
		if(pid === a[i].menuId){
			judge = a[i];
			break;
		}
	}
	if(judge){
		return {
			lv:n+2,
			obj:judge
		};
	}else{
		if(++n < len){
			return eachMenulvArr(arr,pid,n);
		}else{
			return false;
		}
	}
}

MenuTree.prototype.refreshView = function () {//更新html视图
	if(this.isNullData()){return false;}
	var _this = this;
	_this.opt.view.empty()
	//生成成一级视图
	this.createView();
}
MenuTree.prototype.createView = function (arr,parent) { //一级视图
	if(this.isNullData()){return false;}
	var _this = this;
	if(typeof arr == 'undefined'){
		var arr = this.menu || [];
	}
	if(typeof parent == 'undefined'){
		var parent = this.opt.view;
	}
	$.each(arr, function(i,e) {
		var li = _this.opt.createLi(i,e);
		li.data('data',e);
		parent.append(li);
		//判断是否含有子菜单 ? 有就添加子菜单
		if(typeof e.children == 'object'){
			//判断  是否展开  或者  操作记录展开状态 
			if(typeof e.open != 'undefined' && !!e.open || $.inArray(e.menuId,_this.nowOpen)>=0 ){
				li.children('i').addClass('active');
				li.append('<ul></ul>');
			}else{
				li.append('<ul></ul>');
			}
			_this.createView(e.children,li.children('ul'));
		}
	});
}
MenuTree.prototype.isNullData = function () { //如果分级列表数据为空
	var _this = this;
	if(this.menulv.length<=0 || this.menulv[0].length<=0){
		this.opt.view.html('<li>没有数据</li>');
		return true;
	}else{
		return false;
	}
}

MenuTree.prototype.nowOpenAdd = function (data) {  //记录展开
	if(typeof data == 'undefined'){return false;}
	var _this = this;
	var arr = _this.nowOpen;
	var id =  typeof data == 'object' ? data.menuId : data;
	var n = $.inArray(id,_this.nowOpen);
	console.log('展开',arr,id,n);
	if(n<0){
		arr.push(id);
	}
	console.log(arr);
}
MenuTree.prototype.nowOpenRemove = function (data) {	//记录收起
	if(typeof data == 'undefined'){return false;}
	var _this = this;
	var arr = _this.nowOpen;
	var id =  typeof data == 'object' ? data.menuId : data;
	var n = $.inArray(id,_this.nowOpen);
	console.log('收起',arr,id,n);
	if(n>=0){
		arr.splice(n,1);
	}
	console.log(arr);
}