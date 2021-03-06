/**
 * Created by panxiong on 2017/3/15.
 */
import autoprefixer from  'gulp-autoprefixer';   //less样式转成css的时候，自动补全各浏览器的前缀
import webpack from 'gulp-webpack';
var gulp=require('gulp'),
    gulpless=require('gulp-less'),
    minifycss=require('gulp-minify-css'),//css压缩
    uglify=require('gulp-uglify'),//js压缩
    rename=require('gulp-rename'),  //重命名
    rev=require('gulp-rev'),   //对文件名加MD5后缀
    revCollector=require('gulp-rev-collector'),//路径替换
    replace=require('gulp-replace'),   //内容替换
    gulpSourceMap=require('gulp-sourcemaps'),//便于压缩后代码调试
    //当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    babel=require('gulp-babel');
var del=require('del');  //删除文件插件
//  任务开始
//把所有less文件转成css文件
//当编译less时出现语法错误或者其他异常，会终止watch事件，通常需要查看命令提示符窗口才能知道，这并不是我们所希望的，所以我 们需要处理出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）
gulp.task('allless',function(){
    gulp.src('src/less/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//
        .pipe(gulpSourceMap.init()) //sourcemaps初始化
        .pipe(gulpless())  //编译
        .pipe(autoprefixer())
        .pipe(gulpSourceMap.write())
        .pipe(gulp.dest('src/css/'));
});
//压缩css
gulp.task('css',["allless"],function(){
    gulp.src('src/css/**/*.css')
        //.pipe(gulpSourceMap.init())//sourcemaps
        .pipe(minifycss())  //压缩css
        //.pipe(gulpSourceMap.write())
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/css/'))
        .pipe(rev.manifest())     //- 生成一个rev-manifest.json
        .pipe(rename({suffix: '.css'}))
        .pipe(gulp.dest('./rev'));
});
//压缩js
gulp.task('js',function(){
    gulp.src('src/js/**/*.js')
        //.pipe(babel())
        .pipe(webpack({output:{
            filename:"[name].js"
        }}))
        //.pipe(gulpSourceMap.init())//sourcemaps
        //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        //.pipe(uglify()) //压缩js
        //.pipe(gulpSourceMap.write())
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/js/'))
        .pipe(rev.manifest())    //- 生成一个rev-manifest.json
        .pipe(rename({suffix: '.js'}))
        .pipe(gulp.dest('./rev'));
});
gulp.task('dest',["css","js"],function(){
    setTimeout(function(){
        gulp.start(['html']);
    },1000);//要异步，不然rev-manifest.json生成之前就已经退出了
});
gulp.task('testwatch',function(){
    gulp.watch('src/less/**/*.less',["allless"]);
});
gulp.task('clean',function(){
    del(['static/css', 'static/js','web','rev']);
});
gulp.task('html',function(){
    gulp.src(['./rev/*.json', 'views/*.html'])
        .pipe(replace(/\/src\//g,'/static/'))
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))
        //- 执行文件内css名的替换
        .pipe(gulp.dest('web/'));
    //- 替换后的文件输出的目录
})
gulp.task('default',function(){

});
