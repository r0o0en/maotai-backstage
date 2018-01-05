//获取省城市区域列表			
var url_getArea = getAjaxOrigin() + "/api/admin/config/queryArea";
//获取会员等级列表
var url_menberGrade = getAjaxOrigin() + '/api/admin/config/queryMemberLevel';
//获取会员职级列表
var url_MenberPosition = getAjaxOrigin() + '/api/admin/config/queryIdentity';

function getProvince(fun) { //获取省份
	ajax({
		type: 'get',
		info: '获取省份',
		url: url_getArea,
		data: {
			pid: 1,
			level: 2
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getProvinceOption(parent, val) { //设置省
	getProvince(function(data) {
		var str = '<option value="">请选择省份</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function getXCity(pid, fun) { //获取城市
	ajax({
		type: 'get',
		info: '获取城市',
		url: url_getArea,
		data: {
			pid: pid,
			level: 3
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getCityOption(parent, pid, val) { //设置省
	getXCity(pid, function(data) {
		var str = '<option value="">请选择城市</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function getArea(pid, fun) { //获取县区
	ajax({
		type: 'get',
		info: '获取县区',
		url: url_getArea,
		data: {
			pid: pid,
			level: 4
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getAreaOption(parent, pid, val) { //设置县区
	getArea(pid, function(data) {
		var str = '<option value="">请选择城市</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function ProvinceSanAdd(val) { //收货地址 省市三级联动   省、市、区默认值{p:val,c:val,a:val}
	ProvinceSan($.extend(true, {
		pname: 'addProvince',
		cname: 'addCity',
		aname: 'addArea'
	}, val));
}

function ProvinceSan(val) { //省市三级联动   省、市、区默认值{p:val,c:val,a:val}
	//<div class="layui-form-item">
	//			    <label class="layui-form-label"><sup>*</sup>省市区</label>
	//			    <div class="layui-input-inline">
	//			      <select lay-filter="province" class="province" name="province" lay-verify="required">
	//			        <option value="">请选择省</option>
	//			        <option value="2">请选择省</option>
	//			        <option value="3">请选择省</option>
	//			      </select>
	//			    </div>
	//			    <div class="layui-input-inline" >
	//			      <select lay-filter="city" class="city" name="city" lay-verify="required">
	//			        <option value="">请选择市</option>
	//			      </select>
	//			    </div>
	//			    <div class="layui-input-inline" >
	//			      <select lay-filter="area" class="area" name="area" lay-verify="required">
	//			        <option value="">请选择县/区</option>
	//			      </select>
	//			    </div>
	//			</div>
	var val = val || {};
	var pname = val.pname || 'province';
	var cname = val.cname || 'city';
	var aname = val.aname || 'area';

	var p = $('select.' + pname);
	var c = $('select.' + cname);
	var a = $('select.' + aname);
	//	p.each(function (i,e) {
	if(val.p) {
		getProvinceOption(p, val.p);
		if(val.c) {
			getCityOption(c, val.p, val.c);
			if(val.a) {
				getAreaOption(a, val.c, val.a);
			}
		}
	} else {
		getProvinceOption(p);
	}

	//	})
	if(val.noEvent) {
		//不监听事件
		p.attr('disabled', 'disabled');
		c.attr('disabled', 'disabled');
		a.attr('disabled', 'disabled');
		return false;
	}
	//监听select选择
	form.on('select(' + pname + ')', function(data) {
		//	  console.log(data.elem); //得到select原始DOM对象
		//	  console.log(data.value); //得到被选中的值
		//	  console.log(data.othis); //得到美化后的DOM对象
		//	  var c = $(data.elem).parents('.layui-form-item').find('select.city');
		if(c.length > 0) {
			if(data.value) {
				getCityOption(c, data.value);
			} else {
				setOption(c, '<option value="">请选择市</option>');
			}
			setOption(a, '<option value="">请选择县/区</option>');
		}
	});

	form.on('select(' + cname + ')', function(data) {
		//	  var c = $(data.elem).parents('.layui-form-item').find('select.area');
		if(c.length > 0) {
			if(data.value) {
				getAreaOption(a, data.value);
			} else {
				setOption(a, '<option value="">请选择县/区</option>');
			}
		}
	});
}

function getMenberGrade(fun) { //获取会员等级
	ajax({
		type: 'get',
		info: '获取会员等级列表',
		url: url_menberGrade,
		data:{
			methodType:1
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getMenberGradeOption(parent, val) {
	getMenberGrade(function(list) {
		var str = '';
		if(val) {
			$.each(list, function(i, e) {
				str += '<option value="' + i + '" ' + (i == val ? 'selected' : '') + '>' + e + '</option>'
			})
		} else {
			$.each(list, function(i, e) {
				str += '<option value="' + i + '">' + e + '</option>'
			})
		}
		parent.html(str);
		form.render('select');
	});
}

function getMenberPosition(fun) { //获取职级列表
	ajax({
		type: 'get',
		info: '获取会员职级列表',
		url: url_MenberPosition,
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getMenberPositionOption(parent, val) {
	getMenberPosition(function(list) {
		var str = '';
		if(val) {
			$.each(list, function(i, e) {
				str += '<option value="' + i + '" ' + (i == val ? 'selected' : '') + '>' + e + '</option>'
			})
		} else {
			$.each(list, function(i, e) {
				str += '<option value="' + i + '">' + e + '</option>'
			})
		}
		parent.html(str);
		form.render('select');
	});
}

function setOption(parent, str) {
	parent.html(str);
	form.render('select');
}

/*
   获取seek 表单参数
 * */
function getSeekForm(form) {
	var o = {};
	var f = form || $('form').eq(0);
	if(f.Length < 0) {
		return o;
	}
	var keys = $('select[name="seekType"]'),
		vals = $('input[name="seekVal"]')
	if(keys.length > 0) {
		if(vals.length > 0) {
			o[keys.val()] = vals.val();
		} else {
			o[keys.val()] = '';
		}
	}
	f.find('input,select').not(keys).not(vals).each(function(i, e) {
		//		if($(e).attr('name')){
		o[$(e).attr('name')] = $(e).val();
		//		}
	})
	return o;
}

function eachNullEmpty(o) {
	if(!!!o) {
		return false;
	}
	if(typeof o != 'object') {
		return false;
	}
	$.each(o, function(i, e) {
		if(!!!e || i == 'seekVal' || i == 'seekType') {
			delete o[i];
		}
	});
	console.log(o);
}

/*
 录单
 */