$(function(){function t(){if(0==window.orientation||180==window.orientation){$("body").attr("class","portrait"),orientation="portrait",$(".supernat").css("height","211px");var t=$(window).width(),e=$(window).height(),n=$(".palette0").height(),a=$(".top").height(),s=($(".comprehension").height(),$(".topic-analysis").height()),r=$(".supernat").height(),o=e-a-r-20-n,c=$(".top").height(),h=e-s;return $(".container").width(t),$(".content1").height(h),$(".stem1").height(o),$(".content_s").height(e-n),$(".content").height(e-n),$(".reading_body").find(".stem").height(e-r-n-c-30),$(".changeanswer").width(t-30),i.changeOrient(),!1}if(90==window.orientation||window.orientation==-90){$("body").attr("class","landscape"),orientation="landscape";var t=$(window).width(),e=$(window).height(),n=$(".palette0").height(),a=$(".top").height(),s=($(".comprehension").height(),$(".topic-analysis").height());$(".supernat").css("height","100px");var r=$(".supernat").height(),o=e-a-r-20-n,c=$(".top").height(),h=e-s;return $(".container").width(.66*t),$(".content1").height(h),$(".stem1").height(o),$(".content_s").height(e-n),$(".content").height(e-n),$(".reading_body").find(".stem").height(e-r-n-c-30),i.changeOrient(),$(".changeanswer").width(.66*t-30),!1}}var e=function(){var t=this;t.init(),t.params={practiceID:API.getQueryString("practiceID"),qid:API.getQueryString("qid"),mcsn:API.getQueryString("mcsn")},t.getData()};e.prototype={init:function(){var t=this;t.jdom={lebalmistake:$(".lebalmistake"),selectq:$("#selectq")},t.bindUI()},bindUI:function(){var t=this;$(".content1").on("click",".bigclick",function(){var t=$(this).find("img.img");if(0!=t.length){$(".topic-analysis").hide();var e=new Image,i=$(".divImg .bigimg "),n=t.attr("src");e.src=n;var a=e.height,s=(window.innerHeight-a)/2,r=window.innerHeight-80,o="40px";s<0&&(s=20),a<r&&(r=a+10,o=s),i.attr("src",n),$(".divImg").css({width:window.innerWidth,height:r}).css("margin-top",o),$(".modalImg").show(),$(".divImg").scrollLeft(0).scrollTop(0)}}),$(".modalImg").click(function(){$(this).hide(),$(".topic-analysis").show()}),$(".topic-analysis").click(function(){var t=$(this),e=$(".changeanswer"),i=t.attr("haveclick");"no"==i?(t.attr("haveclick","yes"),e.slideDown()):(t.attr("haveclick","no"),e.slideUp())}),t.jdom.lebalmistake.click(function(){var e=$(this);e.hasClass("disable")||(e.addClass("disable"),t.quesNoteStatus(),$(this).toggleClass("lebalmistake-yes"))}),t.jdom.selectq.on("click","li a",function(){var e=$(this);window.location.href="Testsdetail.html?practiceID="+t.params.practiceID+"&qid="+e.attr("qid")+"&mcsn="+e.html()})},changeOrient:function(){if("none"!=$(".modalImg").css("display")){var t=new Image,e=$(".divImg .bigimg "),i=e.attr("src");t.src=i;var n=t.height,a=(window.innerHeight-n)/2,s=window.innerHeight-80,r="40px";a<0&&(a=20),n<s&&(s=n+10,r=a),$(".divImg").css({width:window.innerWidth,height:s}).css("margin-top",r)}},getData:function(){var t=this;API.ajax("getQuestionDetail",{questionID:t.params.qid,practiceID:t.params.practiceID,mcsn:t.params.mcsn},function(e){e&&0==e.status?(t.render(e),t.getQuestions()):layer.open({content:"没有获取到数据",btn:"我知道了"})})},quesNoteStatus:function(){var t=this;API.ajax("quesNoteStatus",{type:t.errorType,questionID:t.params.qid,practiceID:t.params.practiceID,mcsn:t.params.mcsn},function(e){t.jdom.lebalmistake.removeClass("disable"),e&&0==e.status?t.errorType=e.type||t.errorType:layer.open({content:e.msg,btn:"我知道了"})})},getQuestions:function(){var t=this;API.ajax("getQuestions",{practiceID:t.params.practiceID},function(t){if(t&&0==t.status){for(var e="",i=0,n=t.questions.length;i<n;i++){var a="noans";switch(t.questions[i].isRight){case 1:a="right";break;case 0:a="error"}e+='<li><a qid="'+t.questions[i].questionID+'" href="javascript:;" class="'+a+'-a">'+t.questions[i].mcsn+"</a></li>"}$("#selectq").html(e)}else layer.open({content:"没有获取到全部数据",btn:"我知道了"})})},render:function(t){console.log(t);var e=this,i="";if($("#name").html(t.name),$(".topNum").html("<span>"+t.curSNS+"</span>/"+t.totalNum),$(".tgIframe").html('<img class="img" src="'+t.url+'">'),$("#analyze").html(0==t.analyze.length?"":'<img class="img" src="'+t.analyze+'">'),$("#point").html(t.point),1==t.type?e.jdom.lebalmistake.addClass("lebalmistake-yes"):e.jdom.lebalmistake.removeClass("lebalmistake-yes"),e.errorType=t.type,1==t.objectiveStem)return $(".anwer-detail").html(0==t.answerUrl.length?"":'<img class="img" src="'+t.answerUrl+'">'),!0;var n=t.answers.length,a="";1==n&&(a="hide");for(var s=0;s<n;s++){var r=t.answers[s].myAnswer==t.answers[s].questionAnswer?"right":"wrong";i+='<div class="sigle-anwer cf"> <em class="'+a+'">'+t.answers[s].subQuestionID+'.</em> <div class="right-anwer cf"> <label > <span>我的答案：</span> <span class="'+r+'-option">'+t.answers[s].myAnswer+'</span> </label><label class="last-label cf"> <span>正确答案：</span> <span class="right-option">'+t.answers[s].questionAnswer+"</span> </label>  </div> </div>"}$(".anwer-detail").html(i)}};var i=new e;$(window).bind("orientationchange",function(e){t()}),t()});