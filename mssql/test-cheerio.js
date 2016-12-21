var reptile=require('./part/cheerio-reptile');
var url = "";
var fs = require('fs');
var pathName='forum-143';
var i=1751;
var ii=i;
	// reptile.fetchPage(""+i+".html", function ($) {
      // savedContent($);
// });
var seti=setInterval(function(){
	if(ii>2500){clearInterval(seti);seti=null; return;}
	i++;
	reptile.fetchPage(""+i+".html", function ($) {
		ii++;
       savedContent($);
 });
},3000);




       //该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($) {
	console.log(i,ii);
	if($){
		var arrs='';
		$('.mainbox table tbody[id] tr th span[id] a').each(function (index, item) {
		//$('td.news_list table.box td ul li a').each(function (index, item) {
        var _this=$(this), x = _this.text().trim();  
//console.log(x);		
       //var y = x.substring(0, 2).trim();
        if (x.indexOf('车')>-1||x.indexOf('国产')>-1||x.indexOf('車')>-1) {
        arrs+=ii+x+'   '+''+ _this.attr('href')+ '\r\n';
		//x =ii+x+'   '+''+ _this.attr('href')+ '\r\n';	
		console.log(x);	
    }
    });
	if(arrs.length>0){
		//将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
        fs.appendFile('./data/' +pathName + '5.txt', arrs, 'utf-8', function (err) {
            if (err) {
                console.log('file',err);
            }
        });
	}
	}else{
		//i--;
		console.log('eror');
	}
}
