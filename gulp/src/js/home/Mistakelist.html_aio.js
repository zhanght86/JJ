// 引导页start
$(function(){
	var mistakelist=function(){
		var self=this;
		self.init();
		self.params={
			kid:API.getQueryString('kid'),
			phaseID:API.getQueryString('phaseID'),
			subjectID:API.getQueryString('subjectID'),
			timeID:API.getQueryString('timeID')
		}
		self.paperResource='02';
		self.qidResource='05';
		self.pageCount=10;
		self.pageIndex=0;
		self.totalIndex=1;
		self.getData();
	}
	mistakelist.prototype={
		init:function(){
			var self=this;
			self.jdom={
				span_name:$("#span_name"),
				deleteAll:$("#deleteAll"),
				content_list:$("#content_list"),
				createPaper:$("#createPaper"),
				loading:$('.loading-tip')
			};
			self.bindUI();
		},
		bindUI:function(){
			var self=this;
			self.jdom.deleteAll.click(function(){
				layer.open({
					content: '确定要删除全部错题？'
					,btn: ['确定','取消']
					,btn2:function(index){
						layer.close(index);
					},yes:function(index){
						layer.close(index)
						self.deleteErrorquestions();
					}
				});
			});
			self.jdom.createPaper.click(function(){
				layer.open({
					type: 2
					,content: '正在生成试卷...'
					,shadeClose:false
				});
				API.ajax('createPaper',{phaseID:self.params.phaseID,subjectID:self.params.subjectID,knowledgeID:self.params.kid},function(result){
					layer.closeAll();
					if(result&&result.status==0) {
						window.open('Exercise.html?paperID='+result.paperID+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.paperResource+'&qidResource='+self.qidResource+'','Exercise');
					}else{
						layer.open({
							content: result.msg
							,btn: '我知道了'
						});
					}

				});
			});
			self.jdom.content_list.on('click','.tiganImg',function(){
					window.open('MistakeDetail.html?phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&kid='+self.params.kid+'&qid='+$(this).parent('div.stemDiv').attr('qid'),'errorDetail');
			});
			self.jdom.content_list.on('click','.deleteicon',function(){
				self.deleteErrorquestions($(this).closest('div.stemDiv').attr('qid'));
			});
			$(window).scroll(function() {
				var mayLoadContent = $(window).scrollTop() >= $(document).height() - $(window).height() - 50;
				if (mayLoadContent) {
					self.getData();
				}
			})
		},
		getData:function(){
			var self=this;
			if(self.pageIndex>=self.totalIndex){
				$('#loadover').text('没有更多').css('visibility', 'visible');
				 setTimeout(function(){
					 $('#loadover').css('visibility', 'hidden');
				 },1400);
                  return;
			}else{
				$('#loadover').text('正在加载').css('visibility', 'visible');
			}
			self.pageIndex++;
			API.ajax('getErrorquestions',{subjectID:self.params.subjectID,phaseID:self.params.phaseID,timeID:self.params.timeID,knowledgeID:self.params.kid,pageIndex:self.pageIndex,pageCount:self.pageCount},function(result) {
				$('#loadover').css('visibility', 'hidden');
				if(result&&result.status==0){
					self.jdom.span_name.html(result.name+'('+result.count+'题)');
					self.render(result.data);
					self.totalIndex=result.totalIndex||1;
				}else{
					self.totalIndex=1;
				}
			});
		},
		deleteErrorquestions:function(qid){
			var self=this;
			qid=qid||0;
			API.ajax('deleteErrorquestions',{knowledgeID:self.params.kid,questionID:qid},function(result){
				if(result){
					if(result.status==0){
                        API.localStorage('defaultTree','');
                         if(qid==0){
                         	self.totalIndex=1;
							 self.pageIndex=0;
							 self.jdom.content_list.find('div.stemDiv').remove();
                         	 window.history.go(-1);
						 }else{
						 	self.jdom.content_list.find('div[qid='+qid+'].stemDiv').remove();
							 if(self.jdom.content_list.find('div.stemDiv').length==0){
								 window.history.go(-1);
							 }
						 }
					}else{
						layer.open({
							content: result.msg
							,btn: '我知道了'
						});
					}
				}
			});
		},
		render:function(data){console.log(data);
			var self=this,html='';
            for(var i=0,len=data.length;i<len;i++){
				html+='<div qid="'+data[i].questionID+'" class="stem cf stemDiv"><img class="tiganImg" src="'+data[i].questionTextHTML+'"><div class="handle cf"> <div class="sourse-left cf"> <span>来源：</span> <span class="redundant cf">'+data[i].sourceName+'</span> </div> <a class="deleteicon" href="javascript:;"> </a> </div></div>';
			}
			if(html.length==0){
				html='<div class="mCourseNone cf" style="display: block;"> <span> <img src="http://xuexin-file.oss-cn-hangzhou.aliyuncs.com/xxkt/mCourseNone.png"> </span> <p>暂无错题</p> </div>';
			}
			self.jdom.loading.before(html);
			if(self.pageIndex==1){
				orient();
			}
		}
	}
	//$('.questioniframediv .stem').html('<iframe id="questionIframe" width="100%" height="600px;"></iframe>');
	var exer=new mistakelist();

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