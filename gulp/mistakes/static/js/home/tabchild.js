$(function(){function t(){if(0==window.orientation||180==window.orientation){$("body").attr("class","portrait"),orientation="portrait";var t=$(".container").height(),i=$(".status-fix").height();return $(".tab-child").height(t-i-35),!1}if(90==window.orientation||window.orientation==-90){$("body").attr("class","landscape"),orientation="landscape";var t=$(".container").height(),i=$(".status-fix").height();return $(".tab-child").height(t-i-35),!1}}var i=function(){var t=this;t.params={url:decodeURIComponent(API.getQueryString("url")),type:API.getQueryString("type")||"0"},t.init(),t.getData()};i.prototype={init:function(){var t=this;t.jdom={childUl:$(".tab-child ul")},t.bindUI()},bindUI:function(){var t=this,i=$(".container").height(),n=$(".status-fix").height();$(".tab-child").height(i-n-35),t.jdom.childUl.on("click","li",function(i){if(!t.loading){t.loading=!0;var n=$(this);API.ajax("setChildren",{xuexinID:n.attr("id"),type:t.params.type},function(i){i&&0==i.status?(API.localStorage("defaultTree",""),window.location.href=API.format(t.params.url,i)):layer.open({content:i.msg||"未切换成功",btn:"我知道了"})}),setTimeout(function(){t.loading=!1},2e3)}})},getData:function(){var t=this;API.ajax("getChildren",{},function(i){t.setChildren(i.children)})},setChildren:function(i){var n=this,a="";for(var e in i)1==i[e].current&&$(".currentChild").html(i[e].name),a+='<li id="'+i[e].xuexinID+'"><span></span><p>姓名：'+i[e].name+"</p></li>";n.jdom.childUl.html(a),t()}},new i,$(window).bind("orientationchange",function(i){t()})});