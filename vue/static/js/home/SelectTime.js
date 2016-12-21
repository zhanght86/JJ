$(function() {
	var seelctTime = function () {
		var self = this;
		self.params={
            url:decodeURIComponent(API.getQueryString('url'))
		}
	    self.init();
		self.getData();
	}
	seelctTime.prototype={
		init:function(){
			var self=this;
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			$('div.choose-time').on('click','a',function(e){
				//e.preventDefault();
				var _this=$(this);
				window.location.href=API.format(self.params.url,{timeID:_this.attr('timeID'),timeName:_this.find('span.choose-name').html()});
				return;
				//if(window.opener) {
					//window.opener.changeTime(_this.attr('timeID'), _this.find('span.choose-name').html());
				//}
				//window.close();
			});
		},
		getData:function(){
			var self=this;
			API.ajax('getTimes',{},function(result){
				if(result&&result.status==0&&result.data.length>0){
					var html='';
					for(var i=0,len=result.data.length;i<len;i++){
						html+='<a timeID="'+result.data[i].timeID+'" href="javascript:;"><div class="time-group"><span class="choose-name">'+result.data[i].name+'</span><span class="choose-icon"></span></div></a>';
					}
					$('div.choose-time').html(html);
				}else{
					layer.open({
						content: '没有获取到数据'
						,btn: '我知道了'
					});
				}
			});
		}
	}
	new seelctTime();
});



