layui.config({
    base: 'js/',
    version: new Date().getTime()
}).use(['element'],function () {
	var element = layui.element,
		$= layui.jquery;
	
    
//  $('.admin-header-toggle').on('click', function () {
//      var headerHeight = $('#admin-header').height();
//      if (headerHeight === 60) {
//          $('#admin-body').animate({
//              top: '0'
//          });
//          $('#admin-side').animate({
//              top: '0'
//          });
//      } else {
//          $('#admin-body').animate({
//              top: '60px'
//          });
//          $('#admin-side').animate({
//              top: '60px'
//          });
//      }
//  });
    //全屏
    $('.admin-side-full').on('click', function () {
        var docElm = document.documentElement;
        //W3C  
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox  
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等  
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }else{
        	layer.msg('浏览器不支持全屏，sorry!');
        	return false;
        }
        layer.msg('按Esc即可退出全屏');
    });	
	
	
});
