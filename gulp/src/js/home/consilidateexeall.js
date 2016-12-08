var consolidateexeallobj;
function changeSubject(data){
	consolidateexeallobj.changeSubject(data);
}
$(function() {
	var consolidateexeall = function () {
		var self = this;
		self.init();
		self.params={
			phaseID:API.getQueryString('phaseID')||3,
			subjectID:API.getQueryString('subjectID')||7,
			subjectName:API.getQueryString('subjectName')||'初中数学',
			paperResource:API.getQueryString('paperResource')||'01',
			qidResource:API.getQueryString('qidResource')||'01',
			indexType:API.getQueryString('indexType')||'01'
		}
		self.pageCount=10;
		self.pageIndex=0;
		self.totalIndex=1;
		self.jdom.subjectName.html(self.params.subjectName);
		self.getData();
	}
	consolidateexeall.prototype={
		init:function(){
			var self=this;
			self.jdom={
				subjectDiv:$('.subjectDiv'),
				subjectName:$(".subjectDiv .subject-knowledge"),
				allchoose:$(".allchoose"),
				loading:$('.loading-tip')
			}
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			self.jdom.allchoose.on('click','a',function(e){
				self.goto1($(this),self.params.qidResource);
			});
			self.jdom.subjectDiv.click(function(e){
				API.stopPropagation(e);
				var params=API.format('?paperResource={paperResource}&qidResource={qidResource}&indexType={indexType}',self.params) +  '&phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}';
				window.location.href='choosesubject.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});

		},
		goto1:function(_this,qidResource){
			var self=this;
				if(_this.attr('isPractice')=='1'){
					window.open('ExerciseScore.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperID='+_this.attr('paperID')+'&paperResource='+self.params.paperResource+'&qidResource='+qidResource,'ExerciseScore');
				}else{
					window.open('Exercise.html?paperID='+_this.attr('paperID')+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.params.paperResource+'&qidResource='+qidResource+'','Exercise');
				}
		},
		getData:function(){
			var self=this;
			if(self.pageIndex>=self.totalIndex){
				$('#loadover').text('没有更多');
			    self.jdom.loading.css('visibility', 'visible');
				setTimeout(function(){
					self.jdom.loading.css('visibility', 'hidden');
				},1400);
				return;
			}else{
				$('#loadover').text('正在加载');
				self.jdom.loading.css('visibility', 'visible');
			}
			self.pageIndex++;
			API.ajax('getAllRecommend',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,indexType:self.params.indexType,pageIndex:self.pageIndex,pageCount:self.pageCount},function(result){
				self.jdom.loading.css('visibility', 'hidden');
				if(result&&result.status==0){
					self.render(result.data);
					self.totalIndex=result.totalIndex||1;
				}else{
					self.totalIndex=1;
				}
			});
			$(window).scroll(function() {
				var mayLoadContent = $(window).scrollTop() >= $(document).height() - $(window).height() - 50;
				if (mayLoadContent) {
					self.getData();
				}
			})
		},
		changeSubject:function(data){
			var self=this;
			self.pageIndex=0;
			self.totalIndex=1;
			if(data.subjectID){
				self.params.phaseID=data.phaseID;
				self.params.subjectID=data.subjectID;
				self.params.subjectName=data.subjectName;
				self.jdom.subjectName.html(data.subjectName);
				self.jdom.allchoose.empty();
				self.getData();

			}
		},
		createHtml:function(data){
			var html='';
			for(var i=0,len=data.length;i<len;i++){
				var color='',one=data[i];
				if(one.isPractice==1){
					one.noeasy='';
					one.accuracy='accuracy accuracy-';
					one.accuracyp='accuracy-p1';

					if(one.percent<60){
						one.accuracy+='red';
					}else if(one.percent<80){
						one.accuracy+='yellow';
					}else{
						one.accuracy+='green';
					}
					one.percent_=one.percent+'%';
				}else{
					one.noeasy='no-easy-wrong';
					one.accuracy='accuracy-respondence';
					one.accuracyp='accuracy-span1';
					one.percent_='去答题';
				}
				html+=API.format('<a paperID="{paperID}" isPractice="{isPractice}" class="autoData" href="javascript:;"> <div class="easy-wrong {noeasy} cf"> <div class="{accuracy}"> <p class="{accuracyp}">{percent_}</p> </div> <span class="choose-name">{paperName}</span> <p class="easy-p"> <span class="easy-date">推荐时间</span> <span class="easy-topic">{recommendDateStr}</span> </p> <p class="easy-p"> <span class="easy-date">题数：</span> <span class="easy-topic">{questionCount}题</span> </p> </div> </a>',one);
			}
			return html;
		},
		render:function(data){
			var self=this,html=self.createHtml(data);
			if(self.totalIndex==1&&html.length==0){
				html='<div class="no-recommend autoData"><p class="no-recommend-tit">暂无推荐，去自主练习挑战下吧~</p> </div>';
			}
			self.jdom.loading.before(html);
			if(self.pageIndex==1){
				orient();
			}
		}
	}
	consolidateexeallobj=new consolidateexeall();
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			//如果是竖屏给内容区赋值高度
			var w_h=$(window).height();
			var t_h=$(".topic-analysis").height();
			$('.consolidateexer-mainbody').height(w_h-t_h);
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			//如果是横屏隐藏讨论区
			var w_h=$(window).height();
			var t_h=$(".topic-analysis").height();
			$('.consolidateexer-mainbody').height(w_h-t_h);
			return false;
		}
	}
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
});