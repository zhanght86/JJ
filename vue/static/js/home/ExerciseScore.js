// 引导页start
$(function(){
	var exerciseScore=function(){
		var self=this;
		self.init();
		self.params={
			paperID:API.getQueryString('paperID'),
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			paperResource:API.getQueryString('paperResource'),
			qidResource:API.getQueryString('qidResource')
		}
		//self.paperResource='02';
		//self.qidResource='05';
		self.getData();
	}
	exerciseScore.prototype={
		init:function(){
			var self=this;
			self.bindUI();
		},
		bindUI:function(){
			var self=this;
			API.localStorage('exerciseScore','1');
			$("#createPaper").click(function(e){
				API.preventDefault(e);
				layer.open({
					type: 2
					,content: '正在生成试卷...'
					,shadeClose:false
				});
				API.ajax('createPaper',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,knowledgeID:self.kid},function(result){
					layer.closeAll();
					if(result&&result.status==0) {
						API.localStorage('exerciseScore','');
						window.open('Exercise.html?paperID='+result.paperID+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.params.paperResource+'&qidResource='+self.params.qidResource+'&r='+new Date().getTime(),'Exercise');
					}else{
						layer.open({
							content: result.msg
							,btn: '我知道了'
						});
					}

				});
			});
			$("#testDetail").click(function(){
				if(self.onQuestion){
					window.open('Testsdetail.html?practiceID='+self.practiceID+'&qid='+self.onQuestion.qid+'&mcsn='+self.onQuestion.mcsn,'testDetail');
				}else{

				}
			});
			$("#goback").click(function(){
				//API.localStorage('exerciseScore','');
				if(API.localStorage('exercise').length>0){
					window.history.go(-2);
				}else{
					window.history.go(-1);
				}
				//API.localStorage('exerciseScore','');
				//var isexercise=API.localStorage('exercise');
				/*API.localStorage('exercise','');
				var backlen=API.localStorage('backlen'),len=Math.abs(window.history.length-parseInt(backlen));
				//alert(window.history.length+';'+backlen);
				var backleng=parseInt(backlen),hlen=window.history.length;
				if(backlen.length>0){
					if(hlen<=backleng){
						window.history.go(-backleng);
					}else{
						window.history.go(-len);
						for(var i=len;i>0;i--)
						{window.history.go(-i);}
					}
				}else{
					window.history.go(-(hlen-1));
				}*/
				// var appurls_=API.localStorage('appurls');
				// if(appurls_.length>0){
				// appurls_=appurls_.split(';');alert(appurls_.length);
				// for(var i=appurls_.length-1;i>=0;i--){
				// var one=appurls_[i];
				// if(one.indexOf('/Exercise')>-1){//[1,2,3,4,5,6,7]
				// appurls_.splice(0,i+1);
				// alert(window.history.length);
				// API.localStorage('appurls',appurls_);
				//alert(API.localStorage('appurls'));
				// if(i>window.history.length){
				// i=window.history.length-1;
				// }else{
				// i=i+1;
				// }
				// if(i==0){
				// i=1;
				// }
				// alert(i);
				// window.history.go(-i);
				// return;
				// }
				// }
				// window.history.go(-1);
				// return;
				// }
				//alert(isexercise);
				// if(isexercise.length==0){
				// window.history.go(-1);
				// }else{
				// window.history.go(-2);
				// }

				// window.close();

			});
			$('.answertable').on('click','li a',function(){
				var _this=$(this);
                 window.open('Testsdetail.html?practiceID='+self.practiceID+'&qid='+_this.attr('qid')+'&mcsn='+_this.html(),'testDetail');
			});
		},
		getData:function(){
			var self=this;
			API.ajax('getPaperScore',{paperID:self.params.paperID,phaseID:self.params.phaseID,subjectID:self.params.subjectID},function(result) {
				if(result&&result.status==0){
					self.render(result);
				}else{
					layer.open({
						content: "没有获取到数据"
						,btn: '我知道了'
					});
				}
			});
		},
		render:function(data){console.log(data);
			var self=this,htmls='',htmla='';
			self.practiceID=data.practiceID;
			self.kid=data.knowledgeID;
			$("#percent").html(data.percent+'%');
			$("#questionNum").html(data.questionNum);
			$("#totalTime").html(data.totalTime);
			$("#everyTime").html(data.everyTime);
			if(data.isXuexin==0){
				$(".palette.palette0").addClass('prac-list');
				$("#createPaper").removeClass('hide');
			}
			var len=data.questions.length;
			if(len>0){
				self.onQuestion={qid:data.questions[0].qid,mcsn:data.questions[0].mcsn};
			}
			for(var i=0;i<len;i++){
				var type='noans';
				switch(data.questions[i].status){
					case 3:
						type='right';
						break;
					case 2:
						type='error';
						break;
				}
				var one='<li><a qid="'+data.questions[i].qid+'" href="javascript:;" class="'+type+'-a">'+data.questions[i].mcsn+'</a></li>';
				if(data.questions[i].type==1){
					htmla+=one;
				}else{
					htmls+=one;
				}
			}
			$("#jtq").html(htmla.length==0? '<div class="no-recommend autoData"><p class="no-recommend-tit">无主观题</p> </div>':htmla);
			$("#selectq").html(htmls.length==0? '<div class="no-recommend autoData"><p class="no-recommend-tit">无客观题</p> </div>':htmls);
			orient();
		}
	}
	//$('.questioniframediv .stem').html('<iframe id="questionIframe" width="100%" height="600px;"></iframe>');
	var exer=new exerciseScore();

	function orient() {
		if (window.orientation == 0 || window.orientation == 180) {
			$("body").attr("class", "portrait");
			orientation = 'portrait';

			//如果是竖屏给内容区赋值高度
			$('.supernat').css('height','211px');
			var w_w=$(window).width();
			var w_h=$(window).height();
			var s_h=$('.palette0').height();
			var t_h=$('.top').height();
			var compre_h =$('.comprehension').height();
			var d_h=$('.topic-analysis').height();
			var sup_h=$('.supernat').height();
			var stem1_h=w_h-t_h-sup_h-20-s_h;
			var top_h=$('.top').height();
			var c_h=w_h-d_h-sup_h;
			var c1_h=w_h-d_h;

			$('.container').width(w_w);
			$('.content1').height(c1_h);
			//$('.content2').height(c_h);
			$('.stem1').height(stem1_h);
			$('.content_s').height(w_h-s_h);
			$('.content').height(w_h-s_h);
			$('.reading_body').find('.stem').height(w_h-sup_h-s_h-top_h-30);
			$(".stem1 iframe").height(w_h-top_h-s_h+50);
			return false;
		}else if (window.orientation == 90 || window.orientation == -90) {
			$("body").attr("class", "landscape");
			orientation = 'landscape';
			//如果是横屏隐藏讨论区
			var w_w=$(window).width();
			var w_h=$(window).height();
			var s_h=$('.palette0').height();
			var t_h=$('.top').height();
			var compre_h =$('.comprehension').height();
			var d_h=$('.topic-analysis').height();
			$('.supernat').css('height','100px');
			var sup_h=$('.supernat').height();
			var stem1_h=w_h-t_h-sup_h-20-s_h;
			var top_h=$('.top').height();
			var c_h=w_h-d_h-sup_h;
			var c1_h=w_h-d_h;
			// alert('w_h='+w_h+'d_h='+d_h+'c1_h='+c1_h);

			$('.container').width(w_w*0.66);
			$('.content1').height(c1_h);
			//$('.content2').height(c_h);
			$('.stem1').height(stem1_h);
			$('.content_s').height(w_h-s_h);
			$('.content').height(w_h-s_h);
			$('.reading_body').find('.stem').height(w_h-sup_h-s_h-top_h-30);
			$(".stem1 iframe").height(w_h-top_h-s_h+100);
			return false;
		}
	}

	//当屏幕方向发生变化时调用
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
	//当页面中所有资源加载完毕时调用
	//$(function(){
	//orient();
	//});
	// 解决页面底部固定问题end
});