var mistakeobj;
$(function() {
	var mistake = function () {
		var self = this;
		self.subject ={
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			subjectName:API.getQueryString('subjectName')
		};
		self.time={
			timeID:API.getQueryString('timeID'),
			name:API.getQueryString('timeName')
		};
		self.params={
            multiChild:API.getQueryString('multiChild'),
            role:API.getQueryString('role'),
            name:API.getQueryString('name')
		}
		self.paperResource='02';
		self.qidResource='05';
		self.init();
		self.getData();
	}
	mistake.prototype={
		init:function(){
			var self=this;
			self.jdom={
				subject:$("#jsubject"),
				time:$("#jtime"),
				tree_div:$("#treedemo"),
				statisticsError:$("span.statisticsError"),
				//statisticsExercise:$("em.statisticsExercise"),
				todayError:$("span.todayError"),
				//todayExercise:$("em.todayExercise")
			};
			self.bindUI();
		},
		bindUI:function() {
			var self=this;
			self.jdom.subject.click(function(){
                //window.location.href='choosesubject.html?phaseID='+self.subject.phaseID+'&subjectID='+self.subject.subjectID+'&r='+new Date().getTime(),'subject';
                var params='?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}&timeID='+self.time.timeID+'&timeName='+self.time.name+API.format('&multiChild={multiChild}&role={role}&name={name}',self.params);
                if(self.hasData){
                    API.localStorage('defaultTree','-'+self.subject.subjectID+'-'+self.time.timeID+'-'+self.jdom.tree_div.html());
				}else{
                    API.localStorage('defaultTree','');
                }
				window.location.href='choosesubject.html?phaseID='+self.subject.phaseID+'&subjectID='+self.subject.subjectID+'&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});
			self.jdom.time.click(function(){
                var params=API.format('?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}&',self.subject)+'timeID={timeID}&timeName={timeName}'+API.format('&multiChild={multiChild}&role={role}&name={name}',self.params);
                if(self.hasData){
                    API.localStorage('defaultTree','-'+self.subject.subjectID+'-'+self.time.timeID+'-'+self.jdom.tree_div.html());
                }else{
                    API.localStorage('defaultTree','');
				}
				window.location.href='SelectTime.html?url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});
			self.jdom.tree_div.on('click','div.tree_item.tree_has',function(e){
				e.preventDefault();
				var _this=$(this),haveclick=_this.attr('haveclick');
				if (haveclick=='no'){
                    _this.attr('haveclick', 'yes');
                    _this.parent().children('.wtree').slideDown('slow');
                    _this.children('.item-left').css({
                        borderBottom: 'solid 1px #eee'
                    });
                    _this.siblings('.wtree:not(:last-child)').find('.item-left').css({
                        borderBottom: 'solid 1px #eee'
                    });
                    _this.parent('li').children('.wtree:last-child').children('li').children('.tree_item').children('.item-left').css({
                        borderBottom: 'solid 1px #eee'
                    });
                    _this.parents('li').css({
                        borderBottom: '0'
                    });
				}else{
                    _this.attr('haveclick', 'no');
                    _this.parent().children('.wtree').slideUp('slow', function() {
                        /*$(_this).children('.item-left').css({
                            borderBottom: '0'
                        });*/
                        _this.parent('li').children('.wtree:last-child').children('li').children('.tree_item').children('.item-left').css({
                            borderBottom: '0'
                        });
					});
				}
                $('.level4').find('.item-left').css({
                    borderBottom: '0'
                });
			});
			self.jdom.tree_div.on('click','div.scanError ',function(e){
				e.preventDefault();
                if(self.hasData){
                    API.localStorage('defaultTree','-'+self.subject.subjectID+'-'+self.time.timeID+'-'+self.jdom.tree_div.html());
                }else{
                    API.localStorage('defaultTree','');
                }
				window.open('Mistakelist.html?phaseID='+self.subject.phaseID+'&subjectID='+self.subject.subjectID+'&timeID='+self.time.timeID+'&kid='+$(this).closest('div.tree_item').attr('kid'),'scanError');
			});
			self.jdom.tree_div.on('click','a.btn-practice',function(e){
				e.preventDefault();
				layer.open({
					type: 2
					,content: '正在生成试卷...'
					,shadeClose:false
				});
				API.ajax('createPaper',{phaseID:self.subject.phaseID,subjectID:self.subject.subjectID,knowledgeID:$(this).closest('div.tree_item').attr('kid')},function(result){
					layer.closeAll();
					if(result&&result.status==0) {
                        if(self.hasData){
                            API.localStorage('defaultTree','-'+self.subject.subjectID+'-'+self.time.timeID+'-'+self.jdom.tree_div.html());
                        }else{
                            API.localStorage('defaultTree','');
                        }
						window.open('Exercise.html?paperID=' + result.paperID + '&phaseID=' + self.subject.phaseID + '&subjectID=' + self.subject.subjectID + '&paperResource=' + self.paperResource + '&qidResource=' + self.qidResource + '', 'Exercise');
					}else{
						layer.open({
							content: result.msg
							,btn: '我知道了'
						});
					}
				});
			});
			$('.btnChild').click(function(){//点击切换孩子按钮
                var params='?phaseID={phaseID}&subjectID={subjectID}&subjectName={subjectName}&timeID={timeID}&timeName={timeName}&multiChild={multiChild}&role={role}&name={name}';
                if(self.hasData){
                    API.localStorage('defaultTree','-'+self.subject.subjectID+'-'+self.time.timeID+'-'+self.jdom.tree_div.html());
                }else{
                    API.localStorage('defaultTree','');
                }
                window.location.href='tabchild.html?type=2&url='+encodeURIComponent(window.location.href.split('?')[0]+params);
			});
			//去巩固练习
            $('.mainbody').on('click','.btn-practice button',function(){
                window.location.href='consolidateexer.html?'+window.location.href.split('?')[1];
			});
		},
		getData:function(){
			var self=this,param='-'+self.subject.subjectID+'-'+self.time.timeID+'-',defaultTree=API.localStorage('defaultTree');
			if(window.history.length>1&&defaultTree.indexOf(param)==0){
                self.getStatistics();
                $('.hasdata').show();
                self.jdom.tree_div.html(defaultTree.replace(param,''));
                self.hasData=true;
			}else{
                layer.open({
                    type: 2
                    ,content: ''
                    ,shadeClose:false
                });
                self.getStatistics();
                API.localStorage('defaultTree','');
                API.ajax('getErrorKnowlegeTree',{phaseID:self.subject.phaseID,subjectID:self.subject.subjectID,timeID:self.time.timeID},function(result){
                    layer.closeAll();
                    if(result&&result.status==0&&result.data.length>0){
                        $('.hasdata').show();
                        self.jdom.tree_div.html(self.getTreeHtml(result.data));
                        self.hasData=true;
                        $('.level1').children('li').children('.level4:last-child').find('.last-gh').css({
                            borderBottom: '0'
                        });
                    }else{
                        $('.mainbody').append('<div class="no-recommend"><p class="no-recommend-tit">当前条件下暂无错题，去练习一下吧~</p></div><div class="btn-practice"><button>去练习</button></div>');
                        self.hasData=false;
                    }
                });
			}
            self.jdom.subject.find('.jvalue').html(self.subject.subjectName);
            self.jdom.time.find('.jvalue').html(self.time.name);
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
		},
		getStatistics:function(){
			var self=this;
            API.ajax('getStatistics',{phaseID:self.subject.phaseID,subjectID:self.subject.subjectID,timeID:self.time.timeID},function(result){
              if(result&&result.status==0){
                 self.jdom.statisticsError.html(result.statisticsError);
				  self.jdom.todayError.html(result.todayError);
			  }
			});
		},
		createPaper:function(knowlegeID){
			var self=this;
			API.ajax('createPaper',{knowledgeID:knowlegeID,paperSource:self.paperSource,qidSource:self.qidSource},function(result){
				console.log(result);
			});
		},
		getTreeHtml:function(data,level){
			var self=this;
			level=level||1;
			var html1='',lis=[];
			for(var i in data){
				var li='<li>';
				if(data[i].isLeaf==0){
					if(level==3){
                        li+='<div class="tree_item tree_has" level="'+level+'" haveclick="no"><span class="clickicon"></span><div class="cf item-left"><span class="item-tit ellips">'+data[i].knowledgeName+'</span><a class="state-s state-'+(data[i].isPass==0?'p':'e')+' " href="javascript:;"></a></div></div>';
					}else{
                        li+='<div class="tree_item tree_has" level="'+level+'" haveclick="no"><div class="cf item-left"><span class="clickicon"></span><span class="item-tit ellips">'+data[i].knowledgeName+'</span><a class="state-s state-'+(data[i].isPass==0?'p':'e')+' " href="javascript:;"></a></div></div>';
					}
					li+=self.getTreeHtml(data[i].leafKnowledges,level+1);
				}else{
                    /*if(level>17){
                        //level=4;
                        li+='<div kid="'+data[i].knowledgeID+'" class="tree_item" level="4" haveclick="no"><span class="clickicon isleaf"></span><div class="cf item-left"><div class="item-last cf scanError"><span class="item-tit ellips">'+data[i].knowledgeName+'</span><span class="choose-icon"></span></div></div><div class="last-gh cf">'+(data[i].isPass==0?('<p class="thoh-c"><a href="javascript:;" class="go-p"></a>已通过</p>'):('<p class="gon-c"><a href="javascript:;" class="state-e"></a>需巩固</p>'))+'<a href="javascript:;" class="btn-practice">巩固练习</a></div></div>';
					}else{*/
                        li+='<ul class="level4"><li><div kid="'+data[i].knowledgeID+'" class="tree_item" level="4" haveclick="yes"><span class="clickicon isleaf"></span><div class="cf item-left"><div class="item-last cf scanError"><span class="item-tit ellips">'+data[i].knowledgeName+'</span><span class="choose-icon"></span></div></div><div class="last-gh cf">'+(data[i].isPass==0?('<p class="thoh-c"><a href="javascript:;" class="go-p"></a>已通过</p>'):('<p class="gon-c"><a href="javascript:;" class="state-e"></a>需巩固</p>'))+'<a href="javascript:;" class="btn-practice">巩固练习</a></div></div></li></ul>';
					//}
				}
				li+='</li>';
				lis.push(li);
			}
			html1='<ul class="wtree level'+level+'">'+lis.join('');
			html1+='</ul>';
			return html1;
		}
	}
	mistakeobj=new mistake();
	// 横竖屏幕切换标准 start
	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			$("body").attr("class", "portrait");
			orientation = 'portrait';
			//如果是竖屏给内容区赋值高度
			var w_w=$(window).width();
			var w_h=$(window).height();
            var fix_h=$('.fix-tab').height();
            $('.mainbody').height(w_h-fix_h);
            $('.container').width(w_w);
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			//如果是横屏隐藏讨论区
			var w_w=$(window).width();
			var w_h=$(window).height();
            var fix_h=$('.fix-tab').height();
            $('.mainbody').height(w_h-fix_h);
            $('.container').width(w_w*0.66);
			return false;
		}
	}
//当屏幕方向发生变化时调用
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
//当页面中所有资源加载完毕时调用
		$('body').css('background-color','#f8f8f8');
		orient();
	// // 横竖屏幕切换标准 end
});



