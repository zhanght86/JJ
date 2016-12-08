Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
function SetCookie(name, value)
{
    //定义一天
    var days = 1;
    var exp = new Date();
    //定义的失效时间，
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    //写入Cookie  ，toGMTstring将时间转换成字符串。
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString;
}
function getCookie(name)
{   //匹配字段
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
         return (unescape(arr[2]));
    else
           return '';
}
window.API = {
    rootUrl: window.document.location.href.split('/views/')[0]+'/',
    isValid : function (data) {
        if (typeof (data) != "undefined" && data != null && data != 'null' && !(data === '')) {
            return true;
        } else {
            return false;
        }
    },
    getValue : function (data, defaultData) {
        return API.isValid(data) ? data : defaultData;
    },
    isArray : function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';//A instanceof B :检测B.prototype是否存在于参数A的原型链上
    },
    getType: function (x) {
        if (x == null) {
            return "null";
        }
        var t = typeof x;
        if (t != "object" && t != 'Object') {
            return t;
        }
        if (API.isArray(x)) {
            return 'Array';
        }
        var c = Object.prototype.toString.apply(x);
        c = c.substring(8, c.length - 1);
        if (c != "Object") {
            return c;
        }
        if (x.constructor == Object) {
            return c;
        }
        if (x.prototype && "classname" in x.prototype.constructor
                && typeof x.prototype.constructor.classname == "string") {
            return x.constructor.prototype.classname;
        }
        return "ukObject";
    },
    merge : function () {
        var _clone = function (source) {
            switch (API.getType(source)) {
                case 'Object':
                case 'object':
                    return _merge({}, source);
                    break;
                case 'array':
                case 'Array':
                    var aim = [];
                    for (var i in source) {
                        aim.push(_clone(source[i]));
                    }
                    return aim;
                default:
                    return source;
                    break;
            }
        };
        var _merge = function (aim, source) {
            if (!(typeof (source) == 'object' && !API.isArray(source))) { return aim; }
            for (var i in source) {
                if (source[i] != undefined) {
                    if (!API.isValid(aim[i])) {
                        aim[i] = _clone(source[i]);
                    } else {
                        switch (API.getType(aim[i])) {
                            case 'object':
                            case 'Object':
                                _merge(aim[i], source[i]);
                                break;
                            case 'Array':
                                //处理数组
                                var hasmergeIndex = false;
                                for (var i3 = 0, k = source[i][i3]; i3 < source[i].length; i3++, k = source[i][i3]) {
                                    if (typeof (k.mergeIndex) == "number") {
                                        hasmergeIndex = true;
                                        if (aim[i].length < (k.mergeIndex + 1)) {
                                            aim[i].push(k);
                                        } else {
                                            aim[i][i3] = _merge(aim[i][i3], k);
                                        }
                                    } else if (typeof (k.moveIndex) == "number") {
                                        hasmergeIndex = true;
                                        aim[i].splice(k.moveIndex, 0, k);
                                    }
                                }
                                if (!hasmergeIndex) {
                                    aim[i] = _clone(source[i]);
                                }
                                break;
                            default:
                                aim[i] = source[i];
                                break;
                        }
                    }
                }
            }
            return aim;
        };
        var argu = arguments;
        if (argu.length < 2) { return argu[0] ? argu[0] : {} };
        if (argu.length > 0 && true == argu[argu.length - 1]) {
            var _ = argu[0];
            for (var i2 = 1; i2 < argu.length; i2++)
                _ = _merge(_, argu[i2]);
            return _;
        } else {
            var _ = {};
            for (var i2 = 0; i2 < argu.length; i2++)
                _ = _merge(_, argu[i2]);
            return _;
        }
    },
    evalTJson : function (data) {
        //转换表用的
        var _evalTJson = function (_dt) {
            var res = [];
            $(_dt).each(function (i, v) {
                if (0 == i) return;
                var s = {};
                $(v).each(function (q, v2) {
                    s[_dt[0][q]] = v2;
                });
                res[i - 1] = s;
            });
            return res;
        };
        data = data[0];
        var res = [];
        for (var i in data) {
            var v = data[i];
            res[i] = _evalTJson(v);
        };
        return res;
    },
    getRemoteJSON: function (url) {
        var data = { filtURI: function (url) { return url; } };
        if (API.userAgent.ie) {
            //解决IE界面线程停滞，无法显示动画的问题
            window.setTimeout(function () {
                $.getScript(data.filtURI(url), function () { });
            }, 500);
        } else {
            $.getScript(data.filtURI(url), function () { });
        }
    },
    userAgent : {
        ie: false,
        firefox: false,
        chrome: false,
        safari: false,
        opera: false,
        mobile: false,
        pc: false,
        pad: false,
        iphone: false,
        android: false,
        refresh: function () {
            API.userAgent.width = (function () {
                //兼容IOS 与 andriod 但是千万不要设置body的高度为定制 应该为100%
                if (document.body && document.body.clientWidth > 0)
                    return document.body.clientWidth;
                else
                    return document.documentElement.clientWidth;
            })();
            API.userAgent.height = (function () {
                //兼容IOS 与 andriod 但是千万不要设置body的高度为定制 应该为100%
                if (document.body && document.body.clientHeight > 0)
                    return document.body.clientHeight;
                else
                    return document.documentElement.clientHeight;
            })();
        }
    },
    random : function () {
        return parseInt('' + (new Date()).getTime() + parseInt(Math.random() * 10000));
    },
    showException : function (name, e) {
        if (API.isDebug) {
            var content = name;
            if (API.isValid(e)) {
                content += ("\r\nname:" + e.name + "\r\nmessage:" + e.message + (e.stack ? ("\r\nstack:" + e.stack + (e.fileName ? ("\r\nfile:" + e.fileName) : '') + (e.lineNumber ? ("\r\nlineNumber:" + e.lineNumber) : '')) : (API.userAgent.ie ? ("\r\ndescription:" + e.description) : "")));
            }
            console.log('未捕获异常:' + content)
            //throw e;
        }
    },
	addEventListener:function(elem,type,callback){//注册事件，因为浏览器的兼容性考虑，注册事件一般都是注册在事件的冒泡阶段
		if(elem.addEventListener){
			elem.addEventListener(type,callback,false);
		}else if(elem.attachEvent){
			elem.attachEvent('on'+type,callback);
		}else{
			elem['on'+type]=callback;
		}	
	},
	getEvent:function(event){    //获取事件
		return event||window.event;
	},
	getTarget:function(event){     //获取事件的触发目标
		return event.target||event.srcElement;
	},
	preventDefault:function(event){  //阻止事件默认行为
		event.preventDefault?event.preventDefault():event.returnValue=false;
	},
	stopPropagation:function(event){    //阻止事件冒泡
		event.stopPropagation?event.stopPropagation():event.cancelBubble=true;
	},
	removeEventListener:function(elem,type,callback){
		if(elem.removeEventListener){
			elem.removeEventListener(type,callback,false);
		}else if(elem.detachEvent){
			elem.detachEvent('on'+type,callback);
		}else{
			elem['on'+type]=null;
		}
	},
	stopDefaultAndPropagation:function(event){ //同时阻止默认行为和冒泡
		this.preventDefault(event);
		this.stopPropagation(event);
	},
    getQueryString:function (name,url) {
	    url=url||window.location.search.substr(1);
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = decodeURI(url).match(reg);
        if(r!=null){
            var param= unescape(r[2]);
            if(param !=null && param.toString().length>0)
            {
                return param;
            }
        }
        return '';
    },
    formatQ : function(s, o) {
        var reg = /<%=[^(%>)]+%>/gi;
        return s.replace(reg, function(word) {
            var prop = word.replace(/<%=/g, "").replace(/%>/g, "");
            if (API.isValid(o[prop])) {
                return o[prop]
             } else {
            return ""
            }
        })
    },
    formatJ : function(s, o) {
        var reg = /\{[^(})]+\}/gi;
        return s.replace(reg, function(word) {
            var prop = word.replace(/\{/g, "").replace(/\}/g, "");
            if (API.isValid(o[prop])) {
                 return o[prop]
            } else {
                 return ""
            }
        })
    },
    format : function(s, o) {
        if (!s || !o) {
            return API.getValue(s, "")
        }
        if (s.indexOf("<%=" >= 0)) {
            s = API.formatQ(s, o)
        }
        if (s.indexOf("{" >= 0)) {
            s = API.formatJ(s, o)
        }
         return s
    }
};
API.userAgent.refresh();
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d]+)/)) ? API.userAgent.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? API.userAgent.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? API.userAgent.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? API.userAgent.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? API.userAgent.safari = s[1] : 0;
(s = ua.match(/(mobile)/)) ? API.userAgent.mobile = true : false;
(s = ua.match(/(ipad)|(mediapad)/)) ? (API.userAgent.pad = true, API.userAgent.mobile = false) : false;
(s = ua.match(/(android)|(linux)/)) ? (API.userAgent.android = true) : false;
(s = ua.match(/(iphone)|(mac)/)) ? (API.userAgent.iphone = true) : false;
API.userAgent.pc = !(API.userAgent.mobile || API.userAgent.pad);
for (var key in API.userAgent) { if (key != 'pc' && key != 'width' && key != 'height' && key != 'refresh' && API.getValue(API.userAgent[key], false)) { API.userAgent.name = key; } }
console.log("API.userAgent:" + API.userAgent.name);
if (API.getValue(API.userAgent.ie, false)) {
    var ver = API.userAgent.ie;
    eval('API.userAgent.ie' + ver + ' = true;API.userAgent.name=\'ie' + ver + '\';');
}
window.API.localStorage=function(key,value){
    if(arguments.length==1){
        if(window.localStorage){
            return localStorage[key]||'';
        }else{
            return getCookie(key)||'';
        }
    }else{
        if(window.localStorage){
            localStorage[key]=value;
        }else{
            if(key=='defaultTree'){return;}
            SetCookie(key,value);
        }
    }
}
if(API.getQueryString('key').length>0){
    window.API.localStorage('userinfo',API.getQueryString('key'));
}
window.API.ajax=function(action,data,func){
    //action=action+1;
    data.key = window.API.localStorage('userinfo');
   if (API.actions[action]) {//已配制请求路径
        var action=API.merge(API.actions[action],{data:data});
        var funcsucc = API.merge({
            async: true,
            type: "POST",
            dataType: "text",
            cache: false,
            beforeSend: function (request) {
            }, success: function (data, status) {
                try {
                    var hasFalse = false;
                    switch (typeof (data)) {
                        case "string":
                            data = data.replace(/[\r\n]+/g, '');
                            if (data.replace(/^(\[+\]+)/g, '').length === 0) {
                                hasFalse = true;
                            } else {
                                hasFalse = (data.toLowerCase().indexOf('[false') >= 0 ?
                                            (data.toLowerCase().indexOf('[false:') >= 0 ? (function () {
                                                var _data = data.toLowerCase().match(/\[false:[^\]]+\]/g);
                                                if (_data && _data.length > 0) {
                                                    return _data[0].substr(7, _data[0].length - 8);
                                                } else return true;
                                            })() : true) :
                                            false);
                            }
                            if (!hasFalse) {
                                //如何判断tjson
                                try {
                                    data = eval('(' + data.replace(/[\r\n]+/g, '') + ')');
                                } catch (e) { console.log(data); }
                            }
                            break;
                        case "object":
                            if (data) {
                                $(data).each(function (i, v) {
                                    v = v + '';
                                    hasFalse = (hasFalse || v == 'False' || v == 'false');
                                });
                            } else hasFalse = true;
                            break;
                        case 'undefined':
                        default:
                            API.showException('API.ajax success方法 name:typeof错误 type:' + data);
                            hasFalse = true;
                            break;
                    }
                    if (hasFalse) {
                        data = (hasFalse == true ? false : hasFalse);
                    } else {
                        switch (action.dbtype) {
                            case 'tjson':
                                data = API.evalTJson(data);
                                break;
                            case 'json':
                            default:
                                break;
                        }
                    }
                    if (func) {
                        if(data){
                            if(data.success){
                                func(data.result);
                                if(data.result){
                                    window.API.localStorage('userinfo',data.result.key);
                                }
                            }else{
                                if(layer){
                                    layer.closeAll();
                                    layer.open({
                                        content: data.errorCode
                                        ,btn: '我知道了'
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    API.showException('API._ajaxOption success方法', e);
                    //if (func) { func(false); }
                }
            }, error: function (request, status, error) {
                API.showException('API.ajax error方法 status:' + status, error);
            }, complete: function (request, status) {
                //手动回收资源
                request = null;
            }, filtData: function (data) {
                //用来处理数据过滤的
                return API.evalTJson(data)[0][0];
            }, bindData: function (data) {
                //这里使用的是过滤后的数据
            }, noData: function () {
                //这里说明没有获取到数据
            }
        }, action);
        if (action.jsonp) {
            if (!API._ajaxcall) {
                API._ajaxcall = {};
            }
            var random = API.random();
            API._ajaxcall[random] = function (data) {
                delete API._ajaxcall[random];
                funcsucc.success(data, null);
            };
            API.getRemoteJSON(action.url + (action.url.indexOf('?') >= 0 ? '&' : '?') + (action.jsonp == true ? 'callback' : action.jsonp) + '=API._ajaxcall[' + random + ']&' + $.param(action.data));
        } else {
            $.ajax(funcsucc);
        }
    } else {
        console.log('没有配置请求');
        var data=window.API.ldata[action];
        if(data){
            if(data.success){
                setTimeout(function(){
                    func(data.result);
                },500);
                //func(data.result);
                if(data.result){
                    window.API.localStorage('userinfo',data.result.key);
                }
            }else{
                if(layer){
                    layer.open({
                        content: data.errorCode
                        ,btn: '我知道了'
                    });
                }else{
                    console.log(data);
                }
            }
        }
    }
}

//两数的最大公约数,a>=b,都为自然数
window.API.gcd = function (a, b) {
    if (/^(0|([1-9][0-9]*))$/.test(a) && /^(0|([1-9][0-9]*))$/.test(b)) {
        if (a < b) {
            var temp = a;
            a = b;
            b = temp;
        }
        if (b) {
            return window.API.gcd(b,a % b)
        } else {
            return a;
        }

    } else {
        console.log("参数必须是正整数！");
        return -1;
    }
}
//通讯路径，及公参定义在此
window.API.actions = {
    getExericse: { url: window.API.rootUrl + 'expractice/getExericse' },
    submitAnswer: {async:false, url: window.API.rootUrl + 'expractice/submitAnswer' },
    getErrorKnowlegeTree:{ url: window.API.rootUrl + 'questionNote/getErrorKnowledgeTree' },
    getStatistics:{ url: window.API.rootUrl + 'questionNote/getStatistics' },
    createPaper:{async:false, url: window.API.rootUrl + 'expractice/createPaper' },
    getTimes:{ url: window.API.rootUrl + 'expractice/getTimes' },
    getErrorquestions:{ url: window.API.rootUrl + 'questionNote/getErrorquestions' },
    deleteErrorquestions:{ url: window.API.rootUrl + 'questionNote/deleteErrorQuestions' },
    getMistakeDetail:{ url: window.API.rootUrl + 'questionNote/getMistakeDetail' },
    getPaperScore:{ url: window.API.rootUrl + 'expractice/getPaperScore' },
    getQuestionDetail:{ url: window.API.rootUrl + 'expractice/getQuestionDetail' },
    quesNoteStatus:{ url: window.API.rootUrl + 'expractice/quesNoteStatus' },
    getQuestions:{ url: window.API.rootUrl + 'expractice/getQuestions' },
    getsubjects:{ url: window.API.rootUrl + 'expractice/getsubjects' },
    getKnowlege:{ url: window.API.rootUrl + 'expractbyself/getKnowledge' },
    getRecommend:{ url: window.API.rootUrl + 'expractice/getRecommend' },
    getAllRecommend:{ url: window.API.rootUrl + 'expractice/getAllRecommend' },
	getChildren:{url: window.API.rootUrl + 'children/childrenList'},
	setChildren:{url: window.API.rootUrl + 'children/setChildren'},
	getAccessRec:{url: window.API.rootUrl + 'children/getAccessRec'}
};
window.API.userInfo={};
//假数据
window.API.ldata= {}
  switch(window.location.pathname.split('/').pop().toLowerCase()){
      case 'consolidateexeall.html':
      case 'consolidateexer.html':
      case 'mymistakes.html':
          API.localStorage('exerciseScore','');
          API.localStorage('exercise','');
          break;
      case 'mistakelist.html':
      case 'knowledge.html':
          API.localStorage('exerciseScore','');
          API.localStorage('exercise','');
          break;
  }