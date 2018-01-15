if(location.host == '192.168.1.188'){/*如果是测试连接*/
	//项目名称
	var workspace= 'maotai-backstage';	
	function getAjaxOrigin(){//返回请求接口的 origin
		return 'http://maotai.hmsh.com';
	};
	console.log(/(index)\.html/ig.test(self.location.pathname),self.location.pathname);
//	function loginPage(){
//		location.href = location.origin +'/'+ workspace +'/login.html'; 
//	}
	if(parent!=self){
		function loginPage(){
			location.href = './login.html'; 
		}
	}else{
		function loginPage(){
			location.href = '../../login.html'; 
		}		
	}
}else{
	var workspace= '';
	function getAjaxOrigin(){//返回请求接口的 origin
		return '';
	};
	function loginPage(){//跳转登录页
		location.href = '/admin/login';
	}
}
function getOrigin() {//返回项目所在的 origin
	return location.origin;
}
/*
 登录验证
 * */
if (!Cookies.enabled) {
	alert('浏览器不支持cookies,请检查是否禁用！');
}
//cookies 参数
var cookiesOptions = { 
	expires: 60*30
};
var tokenname = 'tokenPC';
var tokenAdminName = 'adminNamePC';
var tokenPowerName = 'powerNamePC';
//是否为不需要验证的页面
var isLoginPage = /(login)\.html/ig.test(location.pathname);
//是否存在cookies
var isToken = Cookies.get(tokenname);
judgeLoginType()

function judgeLoginType() { //每次刷新页面 或 ajax操作前执行方法
	if(!isLoginPage ){
		if(isToken){
			delayedToken();
		}else{
			toLoginPage('init');
			return false;
		}
	}
	return true;
}

function toLoginPage(info) {//登录过期，1s自动跳转登录页/按钮立即跳转
//	layer.closeAll();
	layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: '150px;'
        ,shade: 0.8
        ,id: 'logout' //设定一个id，防止重复弹出
        ,btnAlign: 'c'
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="padding: 20px 10px; text-align:center;width:auto;line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;"><i class="layui-icon layui-anim layui-anim-loop" style="font-size: 36px;">&#xe69c;</i><br>登录过期...</div>'
    });
	Cookies.set(tokenname,'',{expires:0});
	setTimeout(function() {
		parent.window.loginPage();
	}, 1000);
	console.log('toLoginPage【yes】：',info);
	toLoginPage = function(info){
		console.log('toLoginPage【no】：',info);
	}
}
function delayedToken(){//延长token
	Cookies.set(tokenname, isToken,cookiesOptions);
	Cookies.set(tokenAdminName, Cookies.get(tokenAdminName),cookiesOptions);
	Cookies.set(tokenPowerName, Cookies.get(tokenPowerName),cookiesOptions);
}
function loginSaveToken(data) {//登录记录token
//	if(/login\.html/ig.test(location.href)){
		//登录页
		Cookies.set(tokenname,data.data.token,cookiesOptions);
		Cookies.set(tokenAdminName,data.data.adminName,cookiesOptions);
		Cookies.set(tokenPowerName,data.data.powerName,cookiesOptions);
//	}
}

//首页导航菜单
var  navs = [
	{
		name:'会员管理',
		childs:[
			{
				name:'注册新会员',
				url:'pages/member/register.html'
			},
//			{
//				name:'等待审核',
//				url:'pages/member/audit-waiting.html'
//			},
			{
				name:'会员列表',
				url:'pages/member/member-list.html'
			},
			{
				name:'会员升级管理',
				url:'pages/member/upgrade-management.html'
			},
			{
				name:'会员晋升明细',
				url:'pages/member/promotion.html'
			}
		]
	},
	{
		name:'财务管理',
		childs:[
			{
				name:'会员充值管理',
				url:'pages/financialManagement/menber-prepaid.html'
			},
			{
				name:'会员提现管理',
				url:'pages/financialManagement/menber-withdrawal.html'
			},
			{
				name:'财务明细管理',
				url:'pages/financialManagement/financial-details.html'
			}
		]
	},
	{
		name:'奖金管理',
		childs:[
			{
				name:'会员奖金明细',
				url:'pages/bonusManagement/member-bonus-details.html'
			},
			{
				name:'会员奖金汇总',
				url:'pages/bonusManagement/member-bonus-summary.html'
			},
//			{
//				name:'奖金总统计',
//				url:'pages/bonusManagement/bonus-total-statistics.html'
//			},
			{
				name:'奖金参数设置',
				url:'pages/bonusManagement/bonus-parameter-settings.html'
			}
		]
	},
	{
		name:'商品管理',
		childs:[
			{
				name:'分类管理',
				url:'pages/goodsManagement/classify-new.html'
			},
			{
				name:'商品列表',
				url:'pages/goodsManagement/goods-list.html'
			},
			{
				name:'新增商品',
				url:'pages/goodsManagement/goods-edit.html'
			},
			{
				name:'订单管理',
				url:'pages/goodsManagement/order-list.html'
			}
		]
	}
]

var  navs_caiwu = [
	{
		name:'财务管理',
		childs:[
			{
				name:'会员充值管理',
				url:'pages/financialManagement/menber-prepaid.html'
			},
			{
				name:'会员提现管理',
				url:'pages/financialManagement/menber-withdrawal.html'
			},
			{
				name:'财务明细管理',
				url:'pages/financialManagement/financial-details.html'
			}
		]
	},
	{
		name:'奖金管理',
		childs:[
			{
				name:'会员奖金明细',
				url:'pages/bonusManagement/member-bonus-details.html'
			},
			{
				name:'会员奖金汇总',
				url:'pages/bonusManagement/member-bonus-summary.html'
			}
		]
	},
	{
		name:'商品管理',
		childs:[
			{
				name:'订单管理',
				url:'pages/goodsManagement/order-list.html'
			}
		]
	}
]


/*
 各种参数
 * */
//支付方式
var arr_pay_type = ['未支付','余额支付', '积分支付','粮票支付'];
arr_pay_type[11]='支付宝';
//发货状态
var shipments_type = ['待付款', '待发货', '待收货', '完成', '订单已取消', '退货'];
//审核状态 
var auditStatus = ["未审核","审核通过","拒绝"];
//是否冻结
var frezzeState =["已冻结","未冻结"]
//充值金额类型
var moneyType = ["余额","积分","粮票"];
//充值类型
var rechargeType = ["系统充值","会员充值","微信充值","支付宝充值"];
//收入支出的类型
var bonusType = []; 
bonusType[0] = '全部';
bonusType[1] = '余额提现';
bonusType[2] = '余额奖金';
bonusType[3] = '余额充值';
bonusType[4] = '余额购物';
bonusType[12] = '积分奖金';
bonusType[13] = '积分充值';
bonusType[14] = '积分购物';
bonusType[20] = '购物赠送粮票';
bonusType[21] = '推荐赠送粮票';
bonusType[23] = '粮票充值';
//是否显示
var isShow = ['隐藏','显示'];
//审核状态
//var status = ["未审核","审核通过","拒绝"];
