var knowledgeobj;
function changeSubject(data){
	knowledgeobj.changeSubject(data);
}
$(function() {
	var knowledge = function () {
		var self = this;
		self.params={
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			subjectName:API.getQueryString('sName'),
			paperResource:API.getQueryString('pr'),
			qidResource:API.getQueryString('qr'),
			level:API.getQueryString('level')||0,
			knowlegeID:API.getQueryString('knowlegeID')||0,
		}
		self.init();
		self.getData();
	}
	knowledge.prototype={
		init:function(){
			var self=this;
			self.jdom={
				subjectDiv:$('.present-subject'),
				subjectName:$(".present-subject .subject-knowledge"),
				allData:$('.allData')
			}
			self.jdom.subjectName.html(self.params.subjectName);
			if(self.params.level==0){
				self.jdom.subjectDiv.removeClass('hide');
			}
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			self.jdom.subjectDiv.click(function(e){
				API.stopPropagation(e);
				var params=API.format('?pr={paperResource}&qr={qidResource}&level={level}&knowlegeID={knowlegeID}',self.params)+'&phaseID={phaseID}&subjectID={subjectID}&sName={subjectName}';
				window.location.href='choosesubject.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});
			self.jdom.allData.on('click','a',function(e){
				var _this=$(this);
				if(_this.attr('isleaf')=='0'){
					window.location.href='knowledge.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&level='+_this.attr('level')+'&knowlegeID='+_this.attr('kid')+'&pr=' + self.params.paperResource + '&qr=' + self.params.qidResource;
				}else{
					layer.open({
						type: 2
						,content: '正在生成试题...'
						,shadeClose:false
					});
					API.ajax('createPaper',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,knowledgeID:_this.attr('kid')},function(result){
						layer.closeAll();
						if(result&&result.status==0) {
							window.location.href='Exercise.html?paperID=' + result.paperID + '&phaseID=' + self.params.phaseID + '&subjectID=' + self.params.subjectID + '&paperResource=' + self.params.paperResource + '&qidResource=' + self.params.qidResource+'&r='+new Date().getTime();
							//window.close();
						}else{
							layer.open({
								content: result.msg
								,btn: '我知道了'
							});
						}
					});
				}
			});
		},
		getData:function(){
			var self=this;
			API.ajax('getKnowlege',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,knowledgeID:self.params.knowlegeID,level:self.params.level},function(result){
				if(result&&result.status==0){
					self.render(result.knowledgeInfo);
				}else{
					layer.open({
						content: '没有获取到数据'
						,btn: '我知道了'
					});
				}
			});
		},
		changeSubject:function(data){
			var self=this;
			if(data.subjectID){
				self.params.phaseID=data.phaseID;
				self.params.subjectID=data.subjectID;
				self.params.subjectName=data.subjectName;
				self.jdom.subjectName.html(data.subjectName);
				self.jdom.allData.empty();
				self.getData();

			}
		},
		render:function(data){
			var self=this, html='';
			for(var i=0,len=data.length;i<len;i++){
				html+=API.format('<a kid="{knowledgeID}" level="{nextLevel}" isleaf="{isLeaf}" href="javascript:;"><div class="time-group"><span class="choose-name">{knowledgeName}</span><span class="choose-icon"></span></div></a>',data[i]);
			}
			self.jdom.allData.html(html);
		}
	}
	knowledgeobj=new knowledge();
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			//如果是竖屏给内容区赋值高度
			var w_w=$(window).width();
			var w_h=$(window).height();
			$('.container').width(w_w);
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			//如果是横屏隐藏讨论区
			var w_w=$(window).width();
			var w_h=$(window).height();
			$('.container').width(w_w*0.66);
			return false;
		}
	}
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
	orient();
});