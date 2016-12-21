$(function() {
	var choosesubject = function () {
		var self = this;
		self.init();
		self.params={
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
            url:decodeURIComponent(API.getQueryString('url'))
		}
		self.getData();
	}
	choosesubject.prototype={
		init:function(){
			var self=this;
			self.jdom={
				subjectTab:$("#subjectTab"),
				phaseUl:$(".phaseUl")
			}
			self.icons={'语文':'chinese','数学':'math','英语':'english','历史':'history','政治':'politics','地理':'geography','物理':'physics','化学':'chemistry','生物':'biology','科学':'science','理科综合':'science-synthesis','文科综合':'arts-synthesis','信息技术':'it','通用技术':'general-technique'};
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			self.jdom.subjectTab.on('click','.discipline ul li',function(e){
				var _this=$(this),ul= _this.parent();
				window.location.href=API.format(self.params.url,{subjectID:_this.attr('sid'),phaseID:ul.attr('pid'),subjectName:(ul.attr('pname')+_this.find('a').html())});
				return;
			});
		},
		getData:function(){
			var self=this;
			API.ajax('getsubjects',{},function(result){
				if(result&&result.status==0&&result.phaseData.length>0){
					self.render(result);
				}else{
					layer.open({
						content: '没有获取到数据'
						,btn: '我知道了'
					});
				}
			});
		},
		touchSlide:function(){
			var self=this;
			index=self.index||0;
			//self.jdom.questionIframe.attr('src',self.data.questions[index].url);
			self._touchSlide=new TouchSlide({
				slideCell:"#subjectTab",
				delayTime:600,
				defaultIndex:index,
				startFun:function(i,c){

				}
			});
		},
		changePhase:function(phaseID,subjectID){
            var self=this;
			if(phaseID){
				self.index=self.jdom.phaseUl.find('li[pid='+phaseID+']').attr('index');
			}
			//self.touchSlide(index);
			//self.jdom.phaseUl.find('li[pid='+phaseID+']').addClass('select').siblings().removeClass('select');
			//self.jdom.subject.find('ul[pid='+phaseID+']').addClass('select').siblings().removeClass('select');
			$('.discipline').find('ul[pid='+phaseID+']').find('li[sid='+subjectID+']').addClass('select');
		},
		render:function(data){
			var self=this, phtml='',shtml='';
			for(var i=0,len=data.phaseData.length;i<len;i++){
				phtml+='<li index="'+i+'" pid="'+data.phaseData[i].phaseID+'" class="learning-stage-li"><span class="learning-stage-grade">'+data.phaseData[i].phaseName+'</span></li>';
				var subjects=data.subjectData[''+data.phaseData[i].phaseID],ul='<ul pid="'+data.phaseData[i].phaseID+'" pname="'+data.phaseData[i].phaseName+'" class="discipline-subject cf">';
				for(var j=0,lens=subjects.length;j<lens;j++){
					ul+='<li sid="'+subjects[j].subjectID+'" class="discipline-subject-li '+self.icons[subjects[j].subjectName]+'"><a href="javascript:;">'+subjects[j].subjectName+'</a></li>'
				}
				ul+='</ul>';
				shtml+=ul;
			}
			self.jdom.phaseUl.html(phtml);
			$('.discipline').html(shtml);
			self.changePhase(self.params.phaseID,self.params.subjectID);
            orient();
		}
	}
	var choosesubjectObj= new choosesubject();
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			//竖屏
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			choosesubjectObj.touchSlide();
            // $(".discipline").css("margin-top","15px");
            // 学段个数不同时宽度不同start
            var lis=$('.j-tab1').children('ul').children('li');
            var lilen=lis.length;
            if (lilen==1) {
                lis.css({
                    width: '100%'
                });
            }else if(lilen==2){
                lis.css({
                    width: '50%'
                });
            }else{
                lis.css({
                    width: '33.3333%'
                });
            }
            /*$(lis).each(function() {
                if (lilen==1) {
                    $(this).css({
                        width: '100%'
                    });
                }else if(lilen==2){
                    $(this).css({
                        width: '50%'
                    });
                }else{
                    $(this).css({
                        width: '33.3333%'
                    });
                };
            });*/
            // 学段个数不同时宽度不同end
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			//横屏
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			choosesubjectObj.touchSlide();
            // $(".discipline").css("margin-top","15px");
            // 学段个数不同时宽度不同start
            var lis=$('.j-tab1').children('ul').children('li');
            var lilen=lis.length;
            if (lilen==1) {
                lis.css({
                    width: '100%'
                });
            }else if(lilen==2){
                lis.css({
                    width: '50%'
                });
            }else{
                lis.css({
                    width: '33.3333%'
                });
            }
            // 学段个数不同时宽度不同end
			return false;
		}
	}
//当屏幕方向发生变化时调用
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
//当页面中所有资源加载完毕时调用
		//orient();
});