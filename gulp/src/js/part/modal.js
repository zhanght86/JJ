$(function(){

});
/*模态框组件 start*/
	function modal_show(modal_class){
		if(modal_class == null ){
			modal_class = ".modal";
		}
		$(modal_class).fadeIn().css('display', 'block');
		var w_width=$(window).width();
		var w_height=$(window).height();
		var m_width=$(modal_class).find('.modal-content').width();
		var m_height=$(modal_class).find('.modal-content').height();
		var left_distance=(w_width-m_width)/2;
		var top_distance=parseInt((w_height-m_height)/2+$(document).scrollTop(top_distance))-50;
		console.log(top_distance);
		$(modal_class).find('.modal-content').css({
			'left': left_distance+'px',
			'top':  top_distance+'px'
		});
		 $('body').css('overflow-y', 'hidden');
	}
	function modal_hide(modal_class){
		if(modal_class==null){
			modal_class=".modal"
		}
		$('.modal').fadeIn().css('display', 'none');
		$('body').css('overflow-y', 'auto');
	}
/*模态框组件 end*/