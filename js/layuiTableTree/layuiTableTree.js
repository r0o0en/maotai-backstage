function MenuTree (data) {
	//对象：可修改默认参数
	this.opt = $.extend({},{
		view:$('#treeMenu'),
		url:'data.json',
		openButton:false, //是否显示新增、编辑、删除按钮
		openSelect:false, //是否启用全选功能
		hasRecordDown:true,//是否记录本地展开收起状态
		nowOpenStatus:[],//数组：保存本地展开收起状态（将展开的目录menuId保存在数组中），以便刷新时判断展开
		clickCallback:function(e,$btn,data,type){//事件委托中执行函数：点击.layui-tree-item触发
			if(type == 'add'){
				console.log('add',$btn,data);
				if(typeof newOrder == 'function'){
					newOrder({
						parentName: data.name,
						parentId: data.menuId,
						type: data.menuId ===0 ? 0:1
					},$btn);		
				}
			}else if(type == 'edit'){
				console.log('edit',$btn,data);
				if(typeof newOrder == 'function'){
					newOrder(data,$btn);				
				}
			}else if(type == 'delete'){
				console.log('delete',$btn,data);
				if(typeof deleteMenu == 'function'){
					deleteMenu(data,$btn);
				}				
			}
		},
		createLi:function(view,data) {
			//console.log('生成：'+data.name,view.get(0),data);
			/* 
			 * 生成单个菜单项<li>的html字符串或Jquery对象，并作为返回值。
			 * 注意:不用创建ul，即使有子菜单
			 * */
			var li = "<li>";
			//1、展开收起箭头
			li += this.createOpenArror(data);
			li += "<a class='layui-tree-item'>";
			//2、文件夹或文件图标
			li += this.createFileIcon(data);
			//3、判断开启全选
			li += this.createSelect(data) ;
			//4、菜单名称
			li += this.createName(data) ;
			//5、判断开启新增、编辑、删除
			li += this.createButton(data) ;
			
			return li + '</a></li>';
		},
		createOpenArror:function createOpen(data){  //展开收起箭头
			if(typeof data.children == 'undefined' || data.children.length<1) {
				//没有子菜单，不显示箭头
				return '<i class="layui-icon layui-tree-spread"></i>';
			} else if( ( typeof data.open != 'undefined' && !!data.open ) || ( !!this.hasRecordDown && this.nowOpenStatus instanceof Array && $.inArray(data.menuId,this.nowOpenStatus)>=0 ) ) {
				//收起：有子菜单，且需要展开(.active)，显示向下箭头
				return '<i class="layui-icon layui-tree-spread active">&#xe625;</i>';
			} else {
				//收起：有子菜单，无需展开，显示向右箭头
				return '<i class="layui-icon layui-tree-spread">&#xe623;</i>'; 
			}
			return '<i class="layui-icon layui-tree-spread"></i>';
		},
		createFileIcon:function (data) { //文件夹或文件图标
			if(data.parentId < 0 || (typeof data.type != 'undefined' && data.type === 0)) { //显示图标-文件夹
				return '<i class="layui-icon layui-tree-branch"></i>';
			} else { //显示图标-文件
				return '<i class="layui-icon ">&#xe621;</i>';
			}
		},
		createName:function (data) { //菜单名称
			if(data.parentId < 0 || (typeof data.type != 'undefined' && data.type === 0)) { //文件夹
				return '<cite>' + data.name + '</cite>';
			} else { //非文件
				if(typeof data.type != 'undefined' && data.type === 1) {
					// type = 1 = '菜单'
					return '<cite title="' + data.url + '" class="link-line">' + data.name + '</cite>';
				} else {
					return '<cite>' + data.name + '</cite>';
				}
			}
		},
		createSelect:function (data){ //全选按钮
			if(typeof this.openSelect == 'boolean' && this.openSelect){
				return '<i class="layui-icon layui-icon-select " title="勾选">&#xe626;</i>';
			}
			return '';
		},
		createButton:function (data){ //编辑、新增、删除按钮
			if( !(typeof this.openButton == 'boolean' && this.openButton) ){
				return '';
			}
			var str = '';
			if(data.parentId === -1 || (typeof data.type != 'undefined' && data.type === 0)) {
				str += '<i class="layui-icon layui-icon-function layui-icon-add" title="新增子级">&#xe654;</i>';
			}
			str += '<i class="layui-icon layui-icon-function layui-icon-edit" title="编辑">&#xe642;</i>';
			str += '<i class="layui-icon layui-icon-function layui-icon-delete" title="删除">&#x1006;</i>';
			return  str;
		},
		alterSelectIcon:function($btn,status){ //['取消选择'，'选择','不完全选择']
			if(typeof $btn != 'object' || $btn.length<0){
				console.error('$btn data types is error!');
				return false;
			}
			$btn.removeClass('active half');
			if(typeof status != 'number' || status === 0){
				//无选择状态
				$btn.html('&#xe626;');
			}else if(status === 1){
				//选择状态
				$btn.addClass('active').html('&#xe627;');
			}else if(status === 2){
				//不完全选择状态
				$btn.addClass('half').html('&#xe626;');
			}
		}
	},data);
	//数组：菜单列表
	this.list = [];
	//数组：层级分明的菜单树,根据 orderNum 大小排序
	this.menu = [];
	//判断传入参数正确性
	typeof this.opt.view == 'object' ? '' : console.error("opt.view not object");
	
}
/*
 * 初始化：
 * 		1、委托事件
 * 		2、刷新所有（请求>排序>htmlView）
 * */
MenuTree.prototype.init = function () {
	var _this = this ;
	this.addEvent();
	this.refresh();
	return this;
}
/*
 * 事件委托汇总：
 * 	1、点击展开收起
 * 	2、全选
 * */
MenuTree.prototype.addEvent = function (fun) {
	//事件委托：展开收起按钮事件
	this.addClickUpDown();
	//事件委托：点击.layui-tree-item 区域 (可以挂载全选、编辑、新增、删除及其他自定义逻辑)
	this.addClickEvent();
}
/*
 * 事件委托：点击.layui-tree-item 区域 (可以挂载全选、编辑、新增、删除及其他自定义逻辑)
 * */
MenuTree.prototype.addClickEvent = function (fun) {
	var _this = this;
	var view = this.opt.view;
	if(view.hasClass('add-event-click-item')){
		//已委托事件
		return this; 
	}
	view.on('click','.layui-tree-item',function (e) {
		var $target = $(e.target || e.toElement || this);
		if(_this.opt.openSelect && $target.length>0 && $target.hasClass('layui-icon-select') ){
			//全选
			$target.hasClass('active') ?  _this.cancelSelect($target): _this.addSelect($target);
			e.stopPropagation();
			e.preventDefault();
		}else if(typeof _this.opt.clickCallback == 'function'){
			var type;
			if(_this.opt.openButton && $target.length>0){
				if($target.hasClass('layui-icon-add') ){
					//新增
					type = 'add';
				}else if($target.hasClass('layui-icon-edit') ){
					//编辑
					type = 'edit';
				}else if($target.hasClass('layui-icon-delete') ){
					//删除
					type = 'delete';					
				}
			}
			//执行回调
			_this.opt.clickCallback.call(this,e,$target,$(this).parent('li').data('data'),type);
		}else{
			e.stopPropagation();
			e.preventDefault();
		}
		$target = null;
		
	}).addClass('add-event-click-item');
	
	view = null;
	return this;
};
/*
 * 事件委托：点击展开收起   
 * */
MenuTree.prototype.addClickUpDown = function (fun) {
	var _this = this;
	var view = this.opt.view;
	if(view.hasClass('add-event-up-down')){
		//已委托事件
		return this; 
	}
	view.on('click','.layui-tree-spread',function (e) {
		//禁止冒泡、默认事件
		e.stopPropagation();
		e.preventDefault();
		var $btn = $(this);
		if($btn.siblings('ul').length<1){return false;}
		var data = $btn.parent('li').data('data');
		if($btn.hasClass('active')){
			$btn.html('&#xe623;');
			$btn.removeClass('active');
			if(_this.opt.hasRecordDown){
				//记录收起
				_this.alterOpenStatus(data);				
			}
		}else{
			$btn.html('&#xe625;');
			$btn.addClass('active');
			if(_this.opt.hasRecordDown){
				//记录展开
				_this.alterOpenStatus(data,true);				
			}
		}
	}).addClass('add-evnet-up-down');
	view = null;
	return this;
};

/*
 * 选择菜单-取消选择状态：
 * */
MenuTree.prototype.cancelSelect = function ($btn,isSon) {
	if( typeof $btn != 'object' || $btn.length<1 ){return this;}
	//1、改变自身状态
	this.opt.alterSelectIcon($btn,0);
	//2、取消所有子级元素的 选中和不完全选中状态，
	//	调用 cancelSelect() 方法时,要传入第二个参数isSon==true，标记是从父级操作子级
	var $son = $btn.parent('a').siblings('ul').children('li').children('a').children('.layui-icon-select');
	this.cancelSelect($son,'isSon');
	if(!!isSon){
		//如果是从父级操作子级，则不对父级操作，避免死循环
		return this;
	}
	//3、判断兄弟元素 （选中的个数/不完全选中的个数）→ 改变父级
	var $parent = $btn.parents('ul').not('.layui-tree').eq(0).siblings('a').children('.layui-icon-select');
	var $brothers = $btn.parents('li').eq(0).siblings().children('a').children('.layui-icon-select').filter('.active,.half');
	if($brothers.length>0){
		// 选中和不完全选中的个数大于0,父级不完全选中
		this.addHalfSelect($parent);
	}else{
		//没有其他选中，父级取消选中
		this.cancelSelect($parent);		
	}
	return this;
}
/*
 * 选择菜单-添加选择状态：
 * */
MenuTree.prototype.addSelect = function ($btn,isSon) {
	if( typeof $btn != 'object' || $btn.length<1 ){return this;}
	//1、改变自身状态
	this.opt.alterSelectIcon($btn,1);
	//2、选中所有的子级元素，
	//	调用 addSelect() 方法时,要传入第二个参数isSon==true，标记是从父级操作子级
	var $son = $btn.parent('a').siblings('ul').children('li').children('a').children('.layui-icon-select');
	this.addSelect($son,'isSon');
	if(!!isSon){
		//如果是从父级操作子级，则不对父级操作，避免死循环
		return this;
	}
	//3、判断兄弟元素 （兄弟元素个数 === 选中的个数）→ 改变父级
	var $parent = $btn.parents('ul').not('.layui-tree').eq(0).siblings('a').children('.layui-icon-select');
	var $brothers = $btn.parents('li').eq(0).siblings().children('a').children('.layui-icon-select');
	if( $brothers.length > 0 ){
		//有至少一个兄弟元素
		if($brothers.length == $brothers.filter('.active').length){
			//兄弟元素个数 == 选中的兄弟元素个数 ，父级添加选中
			this.addSelect($parent);
		}else{
			//兄弟元素个数 ！= 选中的兄弟元素个数 ，父级不完全选中
			this.addHalfSelect($parent);
		}
	}else{
		//没有兄弟元素，父级添加选中
		this.addSelect($parent);
	}
	return this;
}
/*
 * 选择菜单-添加不完全选择状态：
 * */
MenuTree.prototype.addHalfSelect = function ($btn) {
	if( typeof $btn != 'object' || $btn.length<1 ){return this;}
	//1、改变自身状态
	this.opt.alterSelectIcon($btn,2);
	//2、自身不完全选中时，父级元素也为不完全选中
	var $parent = $btn.parents('ul').not('.layui-tree').eq(0).siblings('a').children('.layui-icon-select');
	//给parent添加不完全选中
	this.addHalfSelect($parent);
	return this;
}



/*
 * 刷新所有：重新请求数据，然后排序、生成view
 * */
MenuTree.prototype.refresh = function () {
	var _this = this ;
	this.requireList(function (list) {
		_this.refreshSortAddView();
	});
	return this;
}
/*
 * 刷新数据和视图：手动更新this.list、this.menu 后，重新排序并生成视图
 * */
MenuTree.prototype.refreshSortAddView = function () {
	this.sort();
	this.refreshView();
	return this;
}
/*
 * 刷新视图：重新生成view
 * */
MenuTree.prototype.refreshView = function () {
	this.opt.view.removeClass().addClass('layui-box layui-tree');
	this.createView();
	return this;
}
/*
 * 获取数据： 根据this.opt.url参数,获取菜单总列表 ,列表赋值给 this.list = []
 * */
MenuTree.prototype.requireList = function (fun) {
	var _this = this;
	ajax({
		type:'get',
		info:'获取所有菜单列表',
		url:_this.opt.url,
		data:{
			hash:new Date().getTime()
		},
		success:function(data,status,xhr) {
//			console.log('ajax成功',data);
			_this.emptyData();
			_this.list = data.data;
			if(typeof fun == 'function'){
				fun(_this.list);
			}
		}
	})
	return this;
};

/*
 * 清空数据：清空this.list this.menu
 * */
MenuTree.prototype.emptyData = function (lis,view) {
	this.list = [];
	this.menu = [];
	return this;
}


/*
 * 汇总操作:菜单列表分类排序 
 * */
MenuTree.prototype.sort = function () {
	this.listClassify();
	this.menuSort();
	console.log('排序后 list:',this.list);
	console.log('排序后 menu:',this.menu);
	return this;
};
/*
 * 列表分类：
 * 		1、将列表list根据 parentId 的大小 进行排序
 * 		2、将排序后list根据parentId是否有对应menuId进行层级分类，生成新的对象menu，为更新html元素做准备
 * */
MenuTree.prototype.listClassify = function () {
//	console.log('开始分类 MenuTree.prototype.listClassify()',);
	var _this = this;
	var list  = _this.list,
		menu  = _this.menu = [],
		parent ={};
	//将列表按照.parentId属性的值进行升序排列
	list.sort(function (a,b) {
		if( a.parentId == b.parentId){
			return a.menuId - b.menuId;
		}
		return a.parentId - b.parentId;
	});
	$.each(list,function (i,e) {
//		console.log(i,'========【' + e.name +'】',e);
		//this.menu
		//再次循环 this.list菜单列表 
		//1、先判断 当前项 panrentId 在列表中有没有对应的 menuId ? 子级列表 ： 一级列表 ; 
		var judge = false;
		if(e.children){
			delete e.children;
		}
		$.each(list,function (j,v) {
			if(e.parentId === v.menuId){
				//找到parentId对应的父元素,不允许子菜单的指针直接指向parent，会造成对象的循环引用
				judge = true ;
				parent = v;
				return false; 
			}
		});
//		judge ? console.log(judge,'【'+e.parent.name+'】的子级菜单',e.parent):
//				console.log(judge,'没有父级菜单');
		//2、根据 judge 值 将菜单项存入 this.menu  ; 参数 lv 为菜单等级 
		var lv = 1;
		if(judge){
			//存入对应 parent.children [array]
			e.lv = parent.lv ? parent.lv+1 : lv+1;
			if( parent.children instanceof Array ){
				parent.children.push(e);
			}else{
				parent.children = [e];
			}
		}else{
			//存入一级列表
			e.lv = lv;
			menu.push(e);
		}
	})
	parent = null ;
	list = null ;
	menu = null ;
	return list;
};
/*
 * 列表排序：分类后，对menu中的Array根据 orderNum 的大小 进行排序
 * */
MenuTree.prototype.menuSort = function (arrs) { 
	var _this = this;
	//console.log('开始排序 MenuTree.prototype.menuSort() ',arrs ? arrs.length : arrs,arrs);
	if( !(arrs instanceof Array) ){
		//第一次调用，默认传入的是 this.menu
		var arrs = this.menu;	
	}
	//1、对菜单集合排序
	arrs.sort(function (a,b) {
		if(a.orderNum == b.orderNum){
			return a.menuId - b.menuId;
		}
		return a.orderNum - b.orderNum;
	});
	//1、判断集合中单个菜单是否有自菜单集
	$.each(arrs,function (i,e) {
		//有子菜单，则对子菜单进行排序
		if(e.children instanceof Array){
			_this.menuSort(e.children);
		}
	});
};

/*
 * DOM操作-生成总菜单视图：根据 排序的列表生成html菜单 
 * */
MenuTree.prototype.createView = function () {
	//console.log('开始生成菜单视图	MenuTree.prototype.createView()');
	var _this = this;
	var menu  = _this.menu,
		view  = _this.opt.view.empty();
	_this.createEachMenuLi(view,menu);
	view = null;
	menu = null;
	return this;
};
/*
 * DOM操作-循环生成单个菜单项li 
 * */
MenuTree.prototype.createEachMenuLi = function (view,list) {
	if( !( typeof view == 'object' && view.length>0 && list instanceof Array && list.length>0) ){
		console.warn(' list or view  is not undefined or null ! ');
		return this;
	}
	if( !( view.get(0).tagName == 'ul' || view.get(0).tagName == 'UL' ) ){
		//如果当前view不是ul标签，则在view内部创建一个<ul>作为view
		view.append('<ul></ul>');
		view = view.children('ul').last();
	}
	var _this = this;
	$.each(list, function(i,e) {
		//将单个菜单的数据传个create函数,返回值： 生成的元素的 html字符串或jquery对象
		var li = _this.opt.createLi(view,e);
		if(typeof li == 'string'){
			li = $(li);
		}
		if(typeof li == 'object' && li.length>0 && li.get(0).nodeType === 1 ){
			view.append(li);
			li.data('data',e);
			//如果当前菜单项下有子菜单集
			if(e.children instanceof Array  && e.children.length>0){
				_this.createEachMenuLi(li,e.children);
			}
		}else{
			console.warn(e.name+'返回的<li>不是正确的Html字符串或jQuery对象！');
		}
	});
	_this = null;
	view = null;
	list = null;
	return this;
} 

/*
 * 状态记录：  展开
 * */
MenuTree.prototype.alterOpenStatus = function (data,status) {
	if(typeof data == 'object'){
		var id = data.menuId;
	}else if(typeof data == 'string'){
		var id = data;
	}else{
		console.error('parameter data types is not object or string !');
		return this;
	}
	var arr = this.opt.nowOpenStatus;
	var n = $.inArray(id,arr);
	if(typeof status == 'boolean' && status){
		//记录展开	
		if(n<0){
			arr.push(id);
		}
	}else{
		//记录收起
		if(n>=0){
			arr.splice(n,1);
		}
	}
	//console.log(!!status?'展开':'收起',id,n,arr);
	id = null;
	arr = null;
	n = null;
	return this;
}