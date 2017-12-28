var trueProjectName = getCookie("trueProjectName");//为了解决这个带项目和不带项目，以及通过nginx代理访问造成的问题
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d);
};
function getContextPath() {
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    if("/" != pathName){
        var pos=curWwwPath.indexOf(pathName);
        var localhostPaht=curWwwPath.substring(0,pos);
    }else {
        var localhostPaht=curWwwPath;
    }
    var projectName="";
    if("" == trueProjectName && pathName.endWith("/mobile/login.html") ){
        if( "/" != pathName){
            projectName = pathName.substring(0,pathName.indexOf("/mobile/login.html"));
        }else {
            projectName = "/";
        }
        console.log("在登陆页面,截取项目名"+projectName);
        if(projectName.length > 0){
            trueProjectName = projectName;
            setCookie("trueProjectName",trueProjectName,trueProjectName+"/");
        }
    }
    return localhostPaht + trueProjectName;
}
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
function setCookie(c_name,value,path,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+ ";path="+ path +
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}