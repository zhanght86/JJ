var reptile=require('./part/cheerio-reptile');
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
reptile.fetchPage("http://www.baidu.com", function ($) {
    console.log($);
});
