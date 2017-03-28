var $=require('./part/jq-reptile').jq();
$.get("http://www.baidu.com", "gbk", function (html) {
    var title = html.find("title").text();
    console.log(title);
});
