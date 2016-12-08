$(function() {
	var tabChild = function () {
		var self = this;
		self.params={
            url:decodeURIComponent(API.getQueryString('url')),
            type:API.getQueryString('type')||'0'
		}
	    self.init();
		self.getData();
	}
	tabChild.prototype={
		init:function(){
			var self=this;
			self.jdom={
				childUl:$('.tab-child ul')
			}
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			var con_h=$('.container').height();
			var stafix_h=$('.status-fix').height();
			$('.tab-child').height(con_h-stafix_h-35);
			self.jdom.childUl.on('click','li',function(e){
				if(self.loading){return;}
				self.loading=true;
				var _this=$(this);
				API.ajax('setChildren',{xuexinID:_this.attr('id'),type:self.params.type},function(result){
					if(result&&result.status==0){
                        API.localStorage('defaultTree','');
                        window.location.href=API.format(self.params.url,result);
					}else{
                        layer.open({
                            content: result.msg||'未切换成功'
                            ,btn: '我知道了'
                        });
					}

				});
				setTimeout(function(){
					self.loading=false;
				},2000);
				return;
				//if(window.opener) {
					//window.opener.changeTime(_this.attr('timeID'), _this.find('span.choose-name').html());
				//}
				//window.close();
			});
		},
		getData:function(){
			var self=this;
			/*layer.open({
				type: 2
				,shadeClose:false
			});*/
			API.ajax('getChildren',{},function(result){
				//layer.closeAll();
				self.setChildren(result.children);
			});
		},
		setChildren:function(data){
			var self=this,html='';
			for(var i in data){
				if(data[i].current==1){
					$('.currentChild').html(data[i].name);
					//document.title=data[i].name;
				}
				html+='<li id="'+data[i].xuexinID+'"><span></span><p>姓名：'+data[i].name+'</p></li>';
			}
			self.jdom.childUl.html(html);
			orient();
		}
	}
	new tabChild();
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			//竖屏
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			// 头部固定start
			var con_h=$('.container').height();
			var stafix_h=$('.status-fix').height();
			$('.tab-child').height(con_h-stafix_h-35);
			// 头部固定end
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			//横屏
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			// 头部固定start
			var con_h=$('.container').height();
			var stafix_h=$('.status-fix').height();
			$('.tab-child').height(con_h-stafix_h-35);
			// 头部固定end
			return false;
		}
	}
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
});



