$(function(){function e(){if(0==window.orientation||180==window.orientation){$("body").attr("class","portrait"),orientation="portrait",$(".supernat").css("height","211px");var e=$(window).width(),t=$(window).height(),i=$(".palette0").height(),a=$(".top").height(),r=($(".comprehension").height(),$(".topic-analysis").height()),s=$(".supernat").height(),o=t-a-s-20-i,h=$(".top").height(),c=t-r;return $(".container").width(e),$(".content1").height(c),$(".stem1").height(o),$(".content_s").height(t-i),$(".content").height(t-i),$(".reading_body").find(".stem").height(t-s-i-h-30),$(".stem1 iframe").height(t-h-i+50),n.changeOrient(),!1}if(90==window.orientation||window.orientation==-90){$("body").attr("class","landscape"),orientation="landscape";var e=$(window).width(),t=$(window).height(),i=$(".palette0").height(),a=$(".top").height(),r=($(".comprehension").height(),$(".topic-analysis").height());$(".supernat").css("height","100px");var s=$(".supernat").height(),o=t-a-s-20-i,h=$(".top").height(),c=t-r;return $(".container").width(.66*e),$(".content1").height(c),$(".stem1").height(o),$(".content_s").height(t-i),$(".content").height(t-i),$(".reading_body").find(".stem").height(t-s-i-h-30),$(".stem1 iframe").height(t-h-i+100),n.changeOrient(),!1}}var t=function(){var e=this;e.init(),e.params={kid:API.getQueryString("kid"),phaseID:API.getQueryString("phaseID"),subjectID:API.getQueryString("subjectID"),qid:API.getQueryString("qid")},e.paperResource="02",e.qidResource="05",e.getData()};t.prototype={init:function(){var e=this;e.bindUI()},bindUI:function(){var e=this;$("#createPaper").click(function(){layer.open({type:2,content:"正在生成试卷...",shadeClose:!1}),API.ajax("createPaper",{phaseID:e.params.phaseID,subjectID:e.params.subjectID,knowledgeID:e.params.kid},function(t){layer.closeAll(),t&&0==t.status?window.open("Exercise.html?paperID="+t.paperID+"&phaseID="+e.params.phaseID+"&subjectID="+e.params.subjectID+"&paperResource="+e.paperResource+"&qidResource="+e.qidResource,"Exercise"):layer.open({content:t.msg,btn:"我知道了"})})}),$("#deleteOne").click(function(){e.deleteErrorquestions(e.params.qid)}),$(".content").on("click",".bigclick",function(){var e=$(this).find("img.img");if(0!=e.length){var t=new Image,n=$(".divImg .bigimg "),i=e.attr("src");t.src=i;var a=t.height,r=(window.innerHeight-a)/2,s=window.innerHeight-80,o="40px";r<0&&(r=20),a<s&&(s=a+10,o=r),n.attr("src",i),$(".divImg").css({width:window.innerWidth,height:s}).css("margin-top",o),$(".modalImg").show(),$(".divImg").scrollLeft(0).scrollTop(0)}}),$(".modalImg").click(function(){$(this).hide()})},changeOrient:function(){if("none"!=$(".modalImg").css("display")){var e=new Image,t=$(".divImg .bigimg "),n=t.attr("src");e.src=n;var i=e.height,a=(window.innerHeight-i)/2,r=window.innerHeight-80,s="40px";a<0&&(a=20),i<r&&(r=i+10,s=a),$(".divImg").css({width:window.innerWidth,height:r}).css("margin-top",s)}},getData:function(){var e=this;API.ajax("getMistakeDetail",{questionID:e.params.qid,knowledgeID:e.params.kid},function(t){t&&0==t.status?e.render(t):layer.open({content:"没有获取到数据",btn:"我知道了"})})},deleteErrorquestions:function(e){var t=this;e&&API.ajax("deleteErrorquestions",{knowledgeID:t.params.kid,questionID:e},function(e){e&&(0==e.status?(API.localStorage("defaultTree",""),layer.open({content:"操作成功！",btn:"我知道了",yes:function(e){layer.close(e),$("#deleteOne").remove(),window.history.go(-1)}})):layer.open({content:e.msg,btn:"我知道了"}))})},render:function(e){console.log(e);var t="";if($("#createTime").html("收集时间 "+e.createTime),$("#errorCount").html(e.errorCount),$(".tgIframe").html('<img class="img" src="'+e.url+'">'),$("#analyze").html(0==e.analyze.length?"":'<img class="img" src="'+e.analyze+'">'),$("#point").html(e.point),$("#resource").html(e.resource),1==e.objectiveStem)return $(".anwer-detail").html(0==e.answerUrl.length?"":'<img class="img" src="'+e.answerUrl+'">'),!0;var n=e.answers.length,i="";1==n&&(i="hide");for(var a=0;a<n;a++){var r=e.answers[a].myAnswer==e.answers[a].questionAnswer?"right":"wrong";t+='<div class="sigle-anwer cf"> <em class="'+i+'">'+e.answers[a].mcsn+'.</em> <div class="right-anwer cf"> <label > <span>我的答案：</span> <span class="'+r+'-option">'+e.answers[a].myAnswer+'</span> </label><label class="last-label cf"> <span>正确答案：</span> <span class="right-option">'+e.answers[a].questionAnswer+"</span> </label>  </div> </div>"}$(".anwer-detail").append(t)}};var n=new t;$(window).bind("orientationchange",function(t){e()}),e()});