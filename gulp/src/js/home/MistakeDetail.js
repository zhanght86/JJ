// 引导页start
$(function(){
	var mistakeDetail=function(){
		var self=this;
		self.init();
		self.params={
			kid:API.getQueryString('kid'),
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			qid:API.getQueryString('qid')
		}
		self.paperResource='02';
		self.qidResource='05';
		self.getData();
	}
	mistakeDetail.prototype={
		init:function(){
			var self=this;
			self.bindUI();
		},
		bindUI:function(){
			var self=this;
			$("#createPaper").click(function(){
				layer.open({
					type: 2
					,content: '正在生成试卷...'
					,shadeClose:false
				});
				API.ajax('createPaper',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,knowledgeID:self.params.kid},function(result){
					layer.closeAll();
					if(result&&result.status==0){
						window.open('Exercise.html?paperID='+result.paperID+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.paperResource+'&qidResource='+self.qidResource+'','Exercise');
					}else{
						layer.open({
						content: result.msg
						,btn: '我知道了'
						});
					}

				});
			});
			$("#deleteOne").click(function(){
				self.deleteErrorquestions(self.params.qid);
			});
			$('.content').on('click','.bigclick',function(){
				var img=$(this).find('img.img');
				if(img.length==0){return;}
				var originImage=new Image(),bigImg=$('.divImg .bigimg '),path=img.attr('src');
				originImage.src=path;
				var Height = originImage.height;
				var zmtop = (window.innerHeight-Height)/2;
				var height=window.innerHeight-80,top=40+'px';
				if(zmtop<0){
					zmtop=20;
				}
				if(Height<height){
					height=Height+10;
					top=zmtop;
				}
				bigImg.attr('src',path);
				$('.divImg').css({width:window.innerWidth,height:height}).css('margin-top',top);
				$('.modalImg').show();
                $('.divImg').scrollLeft(0).scrollTop(0);
			})
			$('.modalImg').click(function(){
				$(this).hide();
			})
		},
		changeOrient:function(){
			if($('.modalImg').css('display')=='none'){return;}
			var originImage=new Image(),bigImg=$('.divImg .bigimg '),path=bigImg.attr('src');
			originImage.src=path;
			var Height = originImage.height;
			var zmtop = (window.innerHeight-Height)/2;
			var height=window.innerHeight-80,top=40+'px';
			if(zmtop<0){
				zmtop=20;
			}
			if(Height<height){
				height=Height+10;
				top=zmtop;
			}
			$('.divImg').css({width:window.innerWidth,height:height}).css('margin-top',top);
		},
		getData:function(){
			var self=this;
			API.ajax('getMistakeDetail',{questionID:self.params.qid,knowledgeID:self.params.kid},function(result) {
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
		deleteErrorquestions:function(qid){
			var self=this;
			if(!qid){return;}
			API.ajax('deleteErrorquestions',{knowledgeID:self.params.kid,questionID:qid},function(result){
				if(result) {
					if (result.status == 0) {
                        API.localStorage('defaultTree','');
						layer.open({
							content: "操作成功！"
							, btn: '我知道了',
							yes:function(index){
								layer.close(index);
								$("#deleteOne").remove();
								window.history.go(-1);
							}
						});
					} else {
						layer.open({
							content: result.msg
							, btn: '我知道了'
						});
					}
				}
			});
		},
		render:function(data){console.log(data);
			var self=this,html='';
			$("#createTime").html('收集时间 '+data.createTime);
			$("#errorCount").html(data.errorCount);
			$(".tgIframe").html('<img class="img" src="'+data.url+'">');
			$("#analyze").html(data.analyze.length==0?'':'<img class="img" src="'+data.analyze+'">');
			$("#point").html(data.point);
			$("#resource").html(data.resource);
			if(data.objectiveStem==1){
				$(".anwer-detail").html(data.answerUrl.length==0?'':'<img class="img" src="'+data.answerUrl+'">');
				return true;
			}
			var len=data.answers.length,hide='';
			if(len==1){
				hide='hide';
			}
			for(var i=0;i<len;i++){
				var red=(data.answers[i].myAnswer==data.answers[i].questionAnswer?'right':'wrong');
				html+='<div class="sigle-anwer cf"> <em class="'+hide+'">'+data.answers[i].mcsn+'.</em> <div class="right-anwer cf"> <label > <span>我的答案：</span> <span class="'+red+'-option">'+data.answers[i].myAnswer+'</span> </label><label class="last-label cf"> <span>正确答案：</span> <span class="right-option">'+data.answers[i].questionAnswer+'</span> </label>  </div> </div>';

			}
			$(".anwer-detail").append(html);
		}
	}
	//$('.questioniframediv .stem').html('<iframe id="questionIframe" width="100%" height="600px;"></iframe>');
	var exer=new mistakeDetail();

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
			exer.changeOrient();
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
			exer.changeOrient();
			return false;
		}
	}

	//当屏幕方向发生变化时调用
	$(window).bind( 'orientationchange', function(e){
		orient();
	});
	orient();
	//当页面中所有资源加载完毕时调用
	//$(function(){
	//orient();
	//});
	// 解决页面底部固定问题end
});