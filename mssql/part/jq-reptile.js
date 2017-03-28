//nodejs+jquery爬虫的简单封装
module.exports.jq = function(){
    var request = require('request');
    var jsdom = require("jsdom");
    var jquery = require('jquery');
    var $ = jquery(jsdom.jsdom().parentWindow);
console.log(2);
    var Iconv = require('iconv').Iconv;
 	
    $.extend({
 
        get: function() {
            var url, charset, callback;
            if (arguments.length == 2) {
                url = arguments[0];
                charset = null;
                callback = arguments[1];
            } else if (arguments.length == 3) {
                url = arguments[0];
                charset = arguments[1];
                callback = arguments[2];
            }
            request({uri: url, encoding: 'binary'}, function(error, response, html) {
                html = new Buffer(html, 'binary');
                if (charset) {
                    charset = {gbk:'gbk'}[charset] || 'gbk';
                    var conv = new Iconv(charset, 'utf8');
                    html = conv.convert(html);
                }
                html = html.toString();
                jsdom.env({
                    html: html,
                    done: function (errors, window) {
                        var result = jquery(window)("html");
                        callback(result);
                    }
                });
            });
        }
 
    });
 
    return $;
};




// module.exports.jq=function(){
	// var request=require('request');
	// var jsdom=require('jsdom');
	// var jquery=require('jquery');
	// var $=require(jsdom.jsdom().parentWindow);
	// var Iconv=require('iconv').Iconv;
	// $.extends({
		// get:function(){
			// var url,charset,callback;
			// if(arguments.length==2){
				// url=arguments[0];
				// charset=null;
				// callback=arguments[1];
			// }else if(arguments.length==3){
				// url=arguments[0];
				// charset=arguments[1];
				// callback=arguments[2];
			// }
			// request({uri:url,encoding:'binary'},function(error,response,html){
				// html=new Buffer(html,'binary');
				// if(charset){
					// charset={gbk:'gbk'}[charset]||'gbk';
					// var conv=new Iconv(charset,'utf8');
					// html=conv.convert(html);
				// }
				// html=html.toString();
				// jsdom.env({html:html,done:function(errors,window){
					// var result=jquery(window)('html');
					// callback(result);
				// }});
			// });
		// }
	// });
	// return $;
// };

