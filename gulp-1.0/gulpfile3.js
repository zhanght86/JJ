/**
 * Created by panxiong on 2017/3/15.
 */
//var htmlImport = require('gulp-html-import');
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
    babel=require('gulp-babel'),
    autoprefixer=require("gulp-autoprefixer"),
    concat=require('gulp-concat'),
    webpack=require('gulp-webpack');
var del=require('del');  //删除文件插件
var named = require('vinyl-named');
var eslint = require('gulp-eslint');
var gulpSequence=require('gulp-sequence');
var runSequence=require('run-sequence');

var staticConfig=require("./config/html-static.config");
var staticmini=staticConfig.pages;
var commonStatic=staticConfig.common;
var pageTask=[];
gulp.task('allless',function(){
    return gulp.src('src/less/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//
        .pipe(gulpSourceMap.init()) //sourcemaps初始化
        .pipe(gulpless())  //编译
        .pipe(autoprefixer())
        .pipe(gulpSourceMap.write())
        .pipe(gulp.dest('src/css/'));
});
gulp.task('commoncss',function(){
    if(commonStatic.css.length==0){return;}
    return gulp.src(commonStatic.css)
        .pipe(concat("common.css"))
        .pipe(minifycss())  //压缩css
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/css/common/'))
        .pipe(rev.manifest())     //- 生成一个rev-manifest.json
        .pipe(rename({suffix: '.comCss'}))
        .pipe(gulp.dest('./rev'));
});
gulp.task('commonjs',function(){
    if(commonStatic.js.length==0){return;}
    return gulp.src(commonStatic.js)
        /*.pipe(webpack({
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
                ]
            },
            babel: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }))*/
        .pipe(concat("common.js"),{newLine:';;'})
        .pipe(named())
        //.pipe(uglify()) //压缩js
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/js/common/'))
        .pipe(rev.manifest())    //- 生成一个rev-manifest.json
        .pipe(rename({suffix: '.comJs'}))
        .pipe(gulp.dest('./rev'));
});
gulp.task('static',["allless"],function(){
    pageTask=[];
    Object.keys(staticmini).forEach(function(name) {//合并压缩package.json里指定的文件
        console.log(staticmini[name].js);
        pageTask.push('pageJs-'+name);
        pageTask.push('pageCss-'+name);
        addTask("css",staticmini[name].css,name);
        addTask("js",staticmini[name].js,name);
    });
    console.log(pageTask);
});
function addTask(typeName,paths,name){
    console.log(typeName,paths,name);
    if(typeName=='js'){
        gulp.task('pageJs-'+name,function(){
            return gulp.src(paths)
                .pipe(webpack({
                    module: {
                        loaders: [
                            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
                        ]
                    },
                    babel: {
                        presets: ['es2015'],
                        plugins: ['transform-runtime']
                    }
                }))
                .pipe(concat(name+".js"),{newLine:';;'})
                .pipe(named())
                .pipe(uglify()) //压缩js
                .pipe(rev())   //- 文件名加MD5后缀
                .pipe(gulp.dest('static/js/'))
                .pipe(rev.manifest())    //- 生成一个rev-manifest.json
                .pipe(rename({suffix: '.js'}))
                .pipe(gulp.dest('./rev'));
        });
    }else if(typeName=="css"){
        gulp.task('pageCss-'+name,function() {
            return gulp.src(paths)
                .pipe(concat(name+".css"))
                .pipe(minifycss())  //压缩css
                .pipe(rev())   //- 文件名加MD5后缀
                .pipe(gulp.dest('static/css/'))
                .pipe(rev.manifest())     //- 生成一个rev-manifest.json
                .pipe(rename({suffix: '.css'}))
                .pipe(gulp.dest('./rev'));
        });
    }
}
function cssUglify1(paths,name){

}
gulp.task('html',function(){
    return gulp.src(['./rev/*.json', 'views/*.html'])
        .pipe(replace(/\/src\//g,'/static/'))
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))
        //- 执行文件内css名的替换
        .pipe(gulp.dest('web/'));
    //- 替换后的文件输出的目录
});
/*gulp.task('autoTask',["static"],function(){

});*/
gulp.task('dest',["static"],function(){
    runSequence("commoncss","commonjs",pageTask,"html");
});
gulp.task('clean',function(){
    del(['static/css', 'static/js','web','rev']);
});





/*
gulp.task('import', function () {
    gulp.src('./demo/index.html')
        .pipe(gulpImport('./demo/components/'))
        .pipe(gulp.dest('dist'));
})

var minijs=require("./package.json").minijs;
var concat=require("gulp-concat");
Object.keys(minijs).forEach(function(name){//合并压缩package.json里指定的文件
    gulp.task(name+'js', function() {
        return gulp.src(minijs[name])
            .pipe(concat(name+'.js'))
            .pipe(gulp.dest('dist/js'));
    });
});*/
