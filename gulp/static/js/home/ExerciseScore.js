$(function(){function e(){if(0==window.orientation||180==window.orientation){$("body").attr("class","portrait"),orientation="portrait",$(".supernat").css("height","211px");var e=$(window).width(),t=$(window).height(),i=$(".palette0").height(),n=$(".top").height(),a=($(".comprehension").height(),$(".topic-analysis").height()),s=$(".supernat").height(),o=t-n-s-20-i,r=$(".top").height(),c=t-a;return $(".container").width(e),$(".content1").height(c),$(".stem1").height(o),$(".content_s").height(t-i),$(".content").height(t-i),$(".reading_body").find(".stem").height(t-s-i-r-30),$(".stem1 iframe").height(t-r-i+50),!1}if(90==window.orientation||window.orientation==-90){$("body").attr("class","landscape"),orientation="landscape";var e=$(window).width(),t=$(window).height(),i=$(".palette0").height(),n=$(".top").height(),a=($(".comprehension").height(),$(".topic-analysis").height());$(".supernat").css("height","100px");var s=$(".supernat").height(),o=t-n-s-20-i,r=$(".top").height(),c=t-a;return $(".container").width(.66*e),$(".content1").height(c),$(".stem1").height(o),$(".content_s").height(t-i),$(".content").height(t-i),$(".reading_body").find(".stem").height(t-s-i-r-30),$(".stem1 iframe").height(t-r-i+100),!1}}var t=function(){var e=this;e.init(),e.params={paperID:API.getQueryString("paperID"),phaseID:API.getQueryString("phaseID"),subjectID:API.getQueryString("subjectID"),paperResource:API.getQueryString("paperResource"),qidResource:API.getQueryString("qidResource")},e.getData()};t.prototype={init:function(){var e=this;e.bindUI()},bindUI:function(){var e=this;API.localStorage("exerciseScore","1"),$("#createPaper").click(function(t){API.preventDefault(t),layer.open({type:2,content:"正在生成试卷...",shadeClose:!1}),API.ajax("createPaper",{phaseID:e.params.phaseID,subjectID:e.params.subjectID,knowledgeID:e.kid},function(t){layer.closeAll(),t&&0==t.status?(API.localStorage("exerciseScore",""),window.open("Exercise.html?paperID="+t.paperID+"&phaseID="+e.params.phaseID+"&subjectID="+e.params.subjectID+"&paperResource="+e.params.paperResource+"&qidResource="+e.params.qidResource+"&r="+(new Date).getTime(),"Exercise")):layer.open({content:t.msg,btn:"我知道了"})})}),$("#testDetail").click(function(){e.onQuestion&&window.open("Testsdetail.html?practiceID="+e.practiceID+"&qid="+e.onQuestion.qid+"&mcsn="+e.onQuestion.mcsn,"testDetail")}),$("#goback").click(function(){API.localStorage("exercise").length>0?window.history.go(-2):window.history.go(-1)}),$(".answertable").on("click","li a",function(){var t=$(this);window.open("Testsdetail.html?practiceID="+e.practiceID+"&qid="+t.attr("qid")+"&mcsn="+t.html(),"testDetail")})},getData:function(){var e=this;API.ajax("getPaperScore",{paperID:e.params.paperID,phaseID:e.params.phaseID,subjectID:e.params.subjectID},function(t){t&&0==t.status?e.render(t):layer.open({content:"没有获取到数据",btn:"我知道了"})})},render:function(t){console.log(t);var i=this,n="",a="";i.practiceID=t.practiceID,i.kid=t.knowledgeID,$("#percent").html(t.percent+"%"),$("#questionNum").html(t.questionNum),$("#totalTime").html(t.totalTime),$("#everyTime").html(t.everyTime),0==t.isXuexin&&($(".palette.palette0").addClass("prac-list"),$("#createPaper").removeClass("hide"));var s=t.questions.length;s>0&&(i.onQuestion={qid:t.questions[0].qid,mcsn:t.questions[0].mcsn});for(var o=0;o<s;o++){var r="noans";switch(t.questions[o].status){case 3:r="right";break;case 2:r="error"}var c='<li><a qid="'+t.questions[o].qid+'" href="javascript:;" class="'+r+'-a">'+t.questions[o].mcsn+"</a></li>";1==t.questions[o].type?a+=c:n+=c}$("#jtq").html(0==a.length?'<div class="no-recommend autoData"><p class="no-recommend-tit">无主观题</p> </div>':a),$("#selectq").html(0==n.length?'<div class="no-recommend autoData"><p class="no-recommend-tit">无客观题</p> </div>':n),e()}};new t;$(window).bind("orientationchange",function(t){e()})});