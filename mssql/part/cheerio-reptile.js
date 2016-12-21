var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var i = 0;
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391"; 
//初始url 

module.exports.fetchPage=function(x,callback) {     //封装了一层函数
    startRequest(x,callback); 
}


function startRequest(x,callback) {
     //采用http模块向服务器发起一次get请求      
    http.get(x, function (res) {     
        var html = [];        //用来存储请求网页的整个html内容
		var len=0;
        var titles = [];        
        //res.setEncoding('gbk'); //防止中文乱码
     //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
           html.push(chunk);
			len += chunk.length;
        });
     //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
			var data;
			data = Buffer.concat(html, len);
		data = iconv.decode(data, 'gb2312');
         var $ = cheerio.load(data); //采用cheerio模块解析html

         var time = $('.article-info a:first-child').next().text().trim();

         var news_item = {
          //获取文章的标题
            title: $('div.article-title a').text().trim(),
         //获取文章发布的时间
            Time: time,   
         //获取当前文章的url
            link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
         //获取供稿单位
            author: $('[title=供稿]').text().trim(),  
        //i是用来判断获取了多少篇文章
            i: i = i + 1   
            };

  var news_title = $('div.article-title a').text().trim();

  //savedContent($,news_title);  //存储每篇文章的内容及文章标题

  //savedImg($,news_title);    //存储每篇文章的图片及图片标题
  if(callback){
	  callback($);
  }
        });

    }).on('error', function (err) {
		//res.abort();
        console.log(err);
		callback();
    }).on('timeout',function(){
		//res.abort();
           console.log('out');
		   callback();
        });;

}
       //该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($, news_title) {
    $('.article-content p').each(function (index, item) {
        var x = $(this).text();       
       var y = x.substring(0, 2).trim();
        if (y == '') {
        x = x + '\n';   
//将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
        fs.appendFile('./data/' + 'sp' + '.txt', x, 'utf-8', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    })
}
//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {
    $('.article-content img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
         img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url

//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
