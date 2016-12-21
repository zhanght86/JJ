var consolidateexerobj;
$(function() {
	var consolidateexer = function () {
		var self = this;
		self.init();
		self.params={
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			subjectName:API.getQueryString('subjectName'),
            timeID:API.getQueryString('timeID'),
            timeName:API.getQueryString('timeName'),
            multiChild:API.getQueryString('multiChild'),
            role:API.getQueryString('role'),
            name:API.getQueryString('name')
		}
		self.paperResource='01';
		self.qidResource='05';
		self.getData();
	}
	consolidateexer.prototype={
		init:function(){
			var self=this;
			self.jdom={
				subjectDiv:$('.subjectDiv'),
				subjectName:$(".subjectDiv .subject-knowledge"),
				xxchoose:$(".xxchoose"),
				zschoose:$(".zschoose")
			}
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			self.jdom.xxchoose.on('click','a',function(e){
				self.goto1($(this),'01',self.xxtype);
			});
			self.jdom.zschoose.on('click','a',function(e){
				self.goto1($(this),'05',self.zstype);
			});
			$('.btn-topicAnalysis').click(function(e){
				window.open('knowledge.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&sName='+self.params.subjectName+'&pr='+self.paperResource+'&qr='+self.qidResource,'knowledge');
			});
			self.jdom.subjectDiv.click(function(e){
				API.stopPropagation(e);
				var params='?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}'+API.format('&timeID={timeID}&timeName={timeName}&multiChild={multiChild}&role={role}&name={name}',self.params);
				window.location.href='choosesubject.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});
            $('.btnChild').click(function(){//点击切换孩子按钮
                var params='?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}&timeID={timeID}&timeName={timeName}&multiChild={multiChild}&role={role}&name={name}';
                window.location.href='tabchild.html?type=1&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
            });
            $('.btnMistake').click(function() {//点击跳转到我的错题本
                window.location.href=API.format('Mymistakes.html?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}&timeID={timeID}&timeName={timeName}&multiChild={multiChild}&role={role}&name={name}',self.params);
            });
		},
		goto1:function(_this,qidResource,indexType){
			var self=this;
			if(_this.hasClass('choose-subject-a')){
				window.location.href='consolidateexeall.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&subjectName='+self.params.subjectName+'&paperResource='+self.paperResource+'&qidResource='+qidResource+'&indexType='+indexType;
			}else{
				if(_this.attr('isPractice')=='1'){
					window.open('ExerciseScore.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperID='+_this.attr('paperID')+'&paperResource='+self.paperResource+'&qidResource='+qidResource,'ExerciseScore');
				}else{
					window.open('Exercise.html?paperID='+_this.attr('paperID')+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.paperResource+'&qidResource='+qidResource+'','Exercise');
				}
			}
		},
        getStatistics:function(){
            var self=this;
            API.ajax('getStatistics',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,timeID:self.params.timeID},function(result){
                if(result&&result.status==0){
                    $("span.todayExercise").html(result.todayExercise);
                    $("span.statisticsExercise").html(result.statisticsExercise);
                }
            });
        },
		getData:function(){
			var self=this;
			if(self.params.phaseID.length==0){
                API.ajax('getAccessRec',{type:1},function(result){
                    if(result&&result.status==0){
                        self.setAccessRec(result);
                    }else{
                        layer.open({
                            content: result.msg||'没有获取到数据'
                            ,btn: '我知道了'
                        });
                    }
                });
			}else{
                self.jdom.subjectName.html(self.params.subjectName);
			}
			API.ajax('getRecommend',{phaseID:self.params.phaseID,subjectID:self.params.subjectID},function(result){
				if(result&&result.status==0){
					self.render(result);
				}else{
					layer.open({
						content: result.msg||'没有获取到数据'
						,btn: '我知道了'
					});
				}
			});
            if(self.params.role=='0'){//家长
                $('.textChild').html(self.params.name);
                if(self.params.multiChild=='1'){//多个孩子
                    $('.btnChild').show();
                }else{
                    $('.btnChild').hide();
                }
                $('.changeChild').show();
            }else{
                $('.changeChild').height(0);
            }
            self.getStatistics();
            API.localStorage('defaultTree','');
		},
        setAccessRec:function(data){
			var self=this;
			if(data.subjectID){
				self.params.phaseID=data.phaseID;
				self.params.subjectID=data.subjectID;
				self.params.subjectName=data.subjectName;
                self.params.timeID=data.timeID;
                self.params.timeName=data.timeName;
				self.jdom.subjectName.html(data.subjectName);
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
			if(html.length==0){
				html='<div class="no-recommend autoData"><p class="no-recommend-tit">暂无推荐，去自主练习挑战下吧~</p> </div>';
			}
			return html;
		},
		render:function(data){
			var self=this;
			self.zstype=data.zstype;
			self.xxtype=data.xxtype;
            $('.autoData').remove();
			self.jdom.xxchoose.append(self.createHtml(data.xxdata));
			self.jdom.zschoose.append(self.createHtml(data.zsdata));
		}
	}
	consolidateexerobj=new consolidateexer();
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			//如果是竖屏给内容区赋值高度
            var w_w=$(window).width();
            var w_h=$(window).height();
            $('.container').width(w_w);
            var t_h=$(".topic-analysis").height();
            var fix_h=$('.fix-tab').height();
            $('.consolidateexer-mainbody').height(w_h-t_h-fix_h);
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			//如果是横屏隐藏讨论区
            var w_w=$(window).width();
            var w_h=$(window).height();
            $('.container').width(w_w*0.66);
            var t_h=$(".topic-analysis").height();
            var fix_h=$('.fix-tab').height();
            $('.consolidateexer-mainbody').height(w_h-t_h-fix_h);
			return false;
		}
	}
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
	orient();
});