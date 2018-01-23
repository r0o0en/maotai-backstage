/*如果是测试连接*/
var isTestLocalhost = location.host == '192.168.1.188';
if(isTestLocalhost) {
	isTestLocalhost = function(fun) {
		if(!fun) {return true;}
		fun();
	};
} else {
	isTestLocalhost = function() {return false;};
};
/* 通配符*/
if(typeof layui == 'object'){
	var $ = layui.jquery,
		form = layui.form,
		table = layui.table,
		element = layui.element,
		laytpl = layui.laytpl,
		upload = layui.upload,
		laydate = layui.laydate;
	table.set({
		
	});
	//自定义验证规则
	form.verify({
		name:function(val){
			console.log(val);
			if(!/[a-zA-Z0-9\u4e00-\u9fa5-_]{2,}/ig.test(val)){
				return '至少输入两位以上的昵称（数字、字母、下划线和中文）'
				console.log(arguments);
			}
		},
		user:function(val){
			if(!/[a-zA-Z0-9\u4e00-\u9fa5_]{2,}/ig.test(val)){
				return '至少输入两位以上的账户（数字、字母、下划线和中文）'
			}
		},
		code: function(val) {
			if(!/^[a-zA-Z0-9]{6}$/ig.test(val)) {
				return '请输入6位书验证码'
			}
		},
		pass: function(val) {
			if(!/^[a-zA-Z0-9]{6,}$/ig.test(val)) {
				return '请输入至少6位的密码'
			}
		},
		goodsClassName:function(val){
			if(!/^[\u4e00-\u9fa5a\s\D\d]+$/ig.test(val)){
				return '商品名称（允许中文、数字、字母、下划线、括号、空格等常用)';
			}
		},
		goodsClassSort:function(val){
			if(parseFloat(val)>100|| parseFloat(val)<0){
				return '排序规则在0-100之间';
			}
		},
		pv:function(val){
			if(parseFloat(val)>100|| parseFloat(val)<0){
				return 'PV在0.00-100.00之间';
			}
		},
		price:function(val,_this){
			if(parseFloat(val)<0){
				return $(_this).attr('placeholdzer')+'不能小于0';
			}else if(!/^\d+(\.\d+)?$/ig.test(val)){
				return $(_this).attr('placeholder') + '只能包含数字和小数点';
			}
		},
		
		
	});
		
}

/*
 iframe 打开页面
 * */
function openPage(name,url,eve) {
	var e = eve || window.event;
	e.preventDefault();
	console.log(name,url,eve);
	if(!!top.indexOpenPage) {
		if(top.indexOpenPage instanceof Function || typeof top.indexOpenPage == 'function') {			
			top.indexOpenPage(name,url);
		}
	} else {
		console.error(url, '没有父级窗口可用,请配置 href=url');
		var topage = getOrigin() + '/' +workspace +'/' + url;
		location.href = topage;
	}
}
if(/\/index\.html$/ig.test(location.pathname) && document.querySelector('#home')) {
	//如果是首页
	
	//递增 新增tab的id，存储tab 列表
	var numb = 0,
		keys = []; //{path:'text.html',id:'iframe' + numb++,url}

	//tab 的 容器
	var ul = $('#navbar-ul'),
		content = $('#navbar-content'),
		tabfilter = "admin-tab";

	window.indexOpenPage = function(name, url) {
		if(!!!url) {
			return false;
		}
		var path = '',
			judge = true;
		if(/\?/g.test(url)) {
			path = url.split(/\?/g)[0];
		} else {
			path = url.match(/[\d\D]+\.html/ig)[0];
		}
		//遍历已打开的页面
		for(var i = 0; i < keys.length; i++) {
			if(keys[i].path == path) {
				judge = false;
				var thispage = keys[i];
				break;
			}
		}
		if(judge) {
			console.log('打开新iframe');
			//已打开的页面中没有
			var thispage = {
				name: name,
				path: path,
				id: 'iframe' + numb++,
				url: url
			};
			keys.push(thispage);
			//新增tab
			layui.element.tabAdd(tabfilter, {
				title: thispage.name
				,content: '<iframe src="' + url + '" id="' + thispage.id + '"></iframe>' //支持传入html
				,id: thispage.id
			});
			ul.children().not('span').last().click();
		} else {
			console.log('切换到已有iframe');
			ul.children().filter('[lay-id="' + thispage.id + '"]').click();
			//一打开的页面中有
			if(thispage.url != url) {
				console.log('替换旧iframe');
				$('#' + thispage.id).attr('src', url);
			}
		}
		console.log(keys);
	}
	window.closeIframe = function(url){
		var iframeid;
		$('iframe').each(function (i,e) {//循环删除选项卡
			if($(e).attr('src') == url){
				iframeid = $(e).attr('id');
				element.tabDelete('' + tabfilter + '',$(e).attr('id'));
			} 
		})
		//循环删除 url 在 keys中的存储
		var path = '';
		if(/\?/g.test(url)) {
			path = url.split(/\?/g)[0];
		} else {
			path = url.match(/[\d\D]+\.html/ig)[0];
		}
		console.log('closeIframe关闭',iframeid,url);
		$.each(keys, function(i,e) {
			if(e.url == url || e.path == path){
				keys.splice(i,1);	
			}
		});
		console.log(keys);
	}
	//监听tab 删除
	layui.element.on('tabDelete(' + tabfilter + ')', function(data) {
		var id = $(this).parent().attr('lay-id');
		console.log('监听关闭iframe id',id);
		for(var i = 0; i < keys.length; i++) {
			if(keys[i].id == id) {
				keys.splice(i, 1);
				break;
			}
		}
		console.log(keys);
	});
}else{
//	window.closeIframe = function(url){};
}

function ajax(opt) {
	if(typeof $ != 'function') {
		console.log('没有jquery');
		return false;
	}
	var ajaxinfotime = 1500;
	//	var alterI ;
	if(!!!opt) {
		layer.alert('ajax()没有参数');
		return false;
	}
	if(typeof opt != 'object' || opt.length < 1) {
		layer.alert('ajax()参数错误');
		return false;
	}
	var o = $.extend(true, {
			type: 'post',
			dataType: 'json',
			infosuccess:false,//显示提示
			errorCallback:false,//返回结果为 code!=200 code ==403 等结果也将执行回调函数 
		}, opt),
		before = $.extend({}, opt);
	//加载遮罩
	var infowp;
	
	//非登录页每次操作判断?延长cookie有效期:跳转登录
	if(!judgeLoginType()){//token无效
		return false;
	}
	//token写入ajax头部
	if(!isLoginPage){
		var token = Cookies.get(tokenname);
		o.headers = $.extend({},{
			token: token
		},o.headers);	
	}
	
	o.beforeSend = function(xhr, settings) {
		if(settings.info) {
//			layer.msg('<i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 36px;">&#xe63d;</i><br/>' + settings.info , {
//				time: 0
//			});
			infowp = layer.load();
		}
		if(before.beforeSend instanceof Function) {
			before.beforeSend(xhr, settings);
		}
	};
	o.success = function(data, status, xhr) {
		if(typeof data == 'undefined' || data == undefined) {
			layer.msg(o.info ? o.info + '获取数据异常' : '获取数据异常');
			return false;
		}
		if(typeof data.code == 'undefined') {
			layer.msg(o.info ? o.info + '获取状态异常' : '获取状态异常');
			return false;
		}
		if(data.code != 200) {
			if(data.code == 403) {
				toLoginPage();
			} else {
				layer.msg(data.msg ? '提示：' + data.msg : '请求失败，稍后重试');
			}
			if(before.errorCallback && before.success instanceof Function ){
				before.success(data, status, xhr);
			}
			return false;
		}
		if(before.success instanceof Function) {
			before.success(data, status, xhr);
			if(o.infosuccess) {
				o.info ? layer.msg(o.info + '成功') : '';
			}
		} else {
			if(o.infosuccess) {
				layer.msg(o.info ? o.info + '成功' : '请求成功');
			}
		}

	};
	o.complete = function(xhr, status) {
		//关闭所有提示
		layer.close(infowp);
		if(status == 'success') {
			return false;
		}
		if(before.complete instanceof Function) {
			before.complete(xhr, status);
		} else {
			layer.alert(o.info ? o.info + status : '请求：' + status, ajaxinfotime);
		}
	};
	return $.ajax(o);
}

function sha256(str) {
	if(!!!str) {
		return false;
	}
	return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

//取Cookie的值  
function getCookie(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while(i < clen) {
		var j = i + alen;
		if(document.cookie.substring(i, j) == arg) return getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if(i == 0) break;
	}
	return null;
}
//写入到Cookie  
//name:cookie名称  value:cookie值   
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	var m = 30; //过期时间 分钟
	exp.setTime(exp.getTime() + m * 60 * 1000); //过期时间 m 分钟  
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookieVal(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if(endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}

/*
new Date(1511228236874).format('yyyy-MM-dd hh:mm:ss')
* */
Date.prototype.format = function(style) {
			var o = {
				"M+" : this.getMonth() + 1, //month
				"d+" : this.getDate(),      //day
				"h+" : this.getHours(),     //hour
				"m+" : this.getMinutes(),   //minute
				"s+" : this.getSeconds(),   //second
				"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
				"q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
				"S"  : this.getMilliseconds() //millisecond
			};
			if (/(y+)/.test(style)) {
				style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for(var k in o){
				if (new RegExp("("+ k +")").test(style)){
					style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return style;
};

var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
          //1.首先动态创建一个容器标签元素，如DIV
          var temp = document.createElement ("div");
          //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
          (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
          //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
          var output = temp.innerHTML;
         temp = null;
         return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
         //1.首先动态创建一个容器标签元素，如DIV
         var temp = document.createElement("div");
         //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
         temp.innerHTML = text;
         //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
         var output = temp.innerText || temp.textContent;
      	temp = null;
      	return output;
    }
};

function getQueryData() { //获取参数
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

//获取imgurl
function getImgurl(str) {
	if(typeof str == 'string' && str.length > 0) {
		var reg = /http:[/]{2}[a-zA-Z0-9.%=/_\-]{1,}[.](jpg|jpeg|png)/ig;
		if(reg.test(str)) {
			return str.match(reg);
		} else {
			return false;
		}
	}
}

function CloseWebPage(){
 if(!!parent.closeIframe){
 	console.log('关闭页面链接',(location.pathname + location.search).replace('/'+workspace+'/',''));
 	parent.closeIframe((location.pathname + location.search).replace('/'+workspace+'/',''));
 	return false;
 }
 if (navigator.userAgent.indexOf("MSIE") > 0) {
  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
   window.opener = null;
   window.close();
  } else {
   window.open('', '_top');
   window.top.close();
  }
 }
 else if (navigator.userAgent.indexOf("Firefox") > 0) {
  window.location.href = 'about:blank ';
 } else {
  window.opener = null;
  window.open('', '_self', '');
  window.close();
 }
}


function parseDate (time) {//解析后台传入的时间戳
	if(!time){
		return '';
	}else{
		return new Date(time*1000).format("yyyy-MM-dd hh:mm:ss");
	}
}

function restoreDate(time) {//将yyyy-mm-ss 解析为秒单位时间戳
	if(!time){
		return '';
	}else{
		var t = time.replace(/\-/ig,'/');
		return Date.parse(new Date(t))/1000;		
	}
}
function restoreDateEnd(time) {//将yyyy-mm-ss 解析为当天最后一秒的时间戳
	if(!time){
		return '';
	}else{
		var da = new Date(time).format("yyyy-MM-dd") + " 23:59:59";
		return Date.parse(new Date(da))/1000;	
	}
}
/*
 表格
 * 
 * */
table.set({
	elem: '#list'
	,method:'get'
	,response: {
		statusCode: 200 //成功的状态码，默认：0
	}
	,page:true
	,request: {
		//pageName: 'pageNow' //页码的参数名称，默认：page
		//,limitName: 'pageSize' //每页数据量的参数名，默认：limit
	}  
});


//监听搜索选项
$('.seek-select-val').attr('name',$('.seek-select-option').val());
form.on('select(seek-select-option)', function(data){
	//console.log(data.elem); //得到select原始DOM对象
	//console.log(data.value); //得到被选中的值
	//console.log(data.othis); //得到美化后的DOM对象
	$('.seek-select-val').attr('name',data.value);
}); 
//监听提交
form.on('submit(seek)', function(data){
	var field = data.field;
	filterSeekData(field);
	return false;
});



function filterSeekData(field) {
	if(!!!field) {
		var field = {};
	}
	if(field.beginTime) {
		//field.beginTime = Date.parse(new Date(field.beginTime));
		field.beginTime = restoreDate(field.beginTime);
	}
	if(field.endTime) {
		//field.endTime = Date.parse(new Date(field.endTime));
		field.endTime = restoreDateEnd(field.endTime);
	}
	
	//拼接相关数据 - 之前搜索的设空
//	$('select[name="seekType"] option').each(function(i, e) {
//		if(!!$(e).attr('value') && $(e).attr('value') != field.seekType) {
//			field[$(e).attr('value')] = '';
//		}
//	})
	//拼接相关数据 -- 当前搜索的参数
//	if(field.seekType) {
//		field[field.seekType] = field.seekVal;
////		delete field.seekType;
////		delete field.seekVal;
//	}
	eachNullEmpty(field);
//	//执行重载
	listTable.reload({
		where: field
		,page: {
		    curr: 1 //重新从第 1 页开始
		}
	});
	return field;
}