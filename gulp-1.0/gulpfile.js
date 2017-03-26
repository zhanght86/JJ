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
    gulpOpen = require('gulp-open'),
    fileinclude = require('gulp-file-include'),
    connect = require('gulp-connect'),
    webpack=require('gulp-webpack'),
    cheerio=require('gulp-cheerio');
var del=require('del');  //删除文件插件
var named = require('vinyl-named');
var eslint = require('gulp-eslint');
var runSequence=require('run-sequence');

//dev
var source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream'),
    babelify=require('babelify');

var staticConfig=require("./config/html-static.config");
var staticmini=staticConfig.pages;
var commonStatic=staticConfig.common;
var pageTask=[];
var host = {
    path: 'dev/',
    port: 3000,
    html: 'index.html'
};
var webpackConfig={
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    output1:{
        filename:'[name].js'
    }
};
//mac chrome: "Google chrome",
var browser ="Google chrome"; /*os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));*/

gulp.task('allless',function(){
    return gulp.src('src/less/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//
        .pipe(gulpSourceMap.init()) //sourcemaps初始化
        .pipe(gulpless())  //编译
        .pipe(autoprefixer())
        .pipe(gulpSourceMap.write())
        .pipe(gulp.dest('src/css/'));
});
gulp.task('dev:allless',["dev:css"],function(){
    return gulp.src('src/less/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//
        .pipe(gulpSourceMap.init()) //sourcemaps初始化
        .pipe(gulpless())  //编译
        .pipe(autoprefixer())
        .pipe(gulpSourceMap.write())
        .pipe(gulp.dest('dev/static/css/')).pipe(connect.reload());
});
gulp.task('commoncss',function(){
    if(commonStatic.css.length==0){return;}
    return gulp.src(commonStatic.css)
        .pipe(concat("common.css"))
        .pipe(minifycss())  //压缩css
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/css/common/'))
        .pipe(rev.manifest({
            path: 'rev/rev-manifest-common.json',
            merge: true
        }))     //- 生成一个rev-manifest.json
        //.pipe(rename({suffix: '.common'}))
        .pipe(gulp.dest('./'));
});
gulp.task('dev:css',function(){
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('dev/static/css/'));
});
gulp.task('commonjs',function(){
    if(commonStatic.js.length==0){return;}
    return gulp.src(commonStatic.js)
        /*.pipe(webpack(webpackConfig))*/
        .pipe(concat("common.js"),{newLine:';;'})
        .pipe(named())
        //.pipe(uglify()) //压缩js
        .pipe(rev())   //- 文件名加MD5后缀
        .pipe(gulp.dest('static/js/common/'))
        .pipe(rev.manifest({
            path: 'rev/rev-manifest-common.json',
            merge: true
        }))    //- 生成一个rev-manifest.json
       // .pipe(rename({suffix: '.common'}))
        .pipe(gulp.dest('./'));
});
gulp.task('dev:js',function(done){
    glob("src/js/**/*.js", function(err, files) {
        if(err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] }).transform ( babelify )
                .bundle()
                .pipe(source(entry))
                .pipe(rename(function (path) {
                    path.dirname = path.dirname.replace('src\\js','');
                    path.extname = ".js"
                }))
                .pipe(gulp.dest('dev/static/js/'));
        });
        es.merge(tasks).on('end', done);
    });

   /* return gulp.src("src/js/!**!/!*.js")
        .pipe(babel())
    //.pipe(webpack(webpackConfig))
        .pipe(named())
        .pipe(gulp.dest('dev/static/js/'));*/
});
gulp.task('static',["allless"],function(){
    pageTask=[];
    Object.keys(staticmini).forEach(function(name) {//合并压缩package.json里指定的文件
        pageTask.push('pageJs-'+name);
        pageTask.push('pageCss-'+name);
        addTask("css",staticmini[name].css,name);
        addTask("js",staticmini[name].js,name);
    });
});
function addTask(typeName,paths,name){
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
                        presets: ['es2015','stage-0'],
                        plugins: ['transform-runtime']
                    }
                }))
                .pipe(concat(name+".js"),{newLine:';;'})
                .pipe(named())
                .pipe(uglify()) //压缩js
                .pipe(rev())   //- 文件名加MD5后缀
                .pipe(gulp.dest('static/js/'))
                .pipe(rev.manifest({
                    path: 'rev/rev-manifest.json',
                    //base: './rev/rev-manifest-js.json',
                    merge: true
                }))    //- 生成一个rev-manifest.json
                //.pipe(rename({suffix: '.js'}))
                .pipe(gulp.dest('./'));
        });
    }else if(typeName=="css"){
        gulp.task('pageCss-'+name,function() {
            return gulp.src(paths)
                .pipe(concat(name+".css"))
                .pipe(minifycss())  //压缩css
                .pipe(rev())   //- 文件名加MD5后缀
                .pipe(gulp.dest('static/css/'))
                .pipe(rev.manifest({
                    path: 'rev/rev-manifest.json',
                    merge: true
                }))     //- 生成一个rev-manifest.json
                //.pipe(rename({suffix: '.css'}))
                .pipe(gulp.dest('./'));
        });
    }
}
function cssUglify1(paths,name){

}
gulp.task('revhtml',function(){
    return gulp.src( 'views/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace(/\/src\//g,'/static/'))
        .pipe(cheerio(function ($) {
            $('script[min]').remove();
            $('link[min]').remove();
            $('head').append('<link rel="stylesheet" href="../static/css/common/common.css"><script type="text/javascript" src="../static/js/common/common.js">');
        }))
        .pipe(gulp.dest('web/'));
})
gulp.task('html',["revhtml"],function(){
    return gulp.src(['./rev/*.json', 'web/*.html'])
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))
        //- 执行文件内css名的替换
        .pipe(gulp.dest('web/'));
    //- 替换后的文件输出的目录
});
gulp.task('dev:html',function(){
    return gulp.src('views/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace(/\/src\//g,'/static/'))
        .pipe(gulp.dest('dev/web/'));
});

gulp.task('connect', function () {
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});
gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            web: browser,
            uri: 'http://localhost:3000/web'
        }))
        .on('end', done);
});

//发布
gulp.task('dest',["static"],function(){
    runSequence("commoncss","commonjs",pageTask,"html");
});
//开发
gulp.task('dev',["dev:allless"],function(cb){
    runSequence("dev:js","dev:html",['connect', 'watch', 'open']);
});
gulp.task('reload',["dev:js"],function(){
    gulp.src('').pipe(connect.reload());
});
gulp.task('watch', function (done) {
   /* gulp.watch('src/!**!/!*', ["dev:allless","dev:js",reload])
        .on('end',done);*/
    gulp.watch('src/css/**/*.css', ["dev:allless"]);
    gulp.watch('src/less/**/*.less', ["dev:allless"]);
    gulp.watch('src/js/**/*.js',  ["reload"]);
});
gulp.task('clean',function(){
    del(['static/css', 'static/js','web','rev','dev']);
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


/*
参考资料：
http://www.w2bc.com/article/120144   browserify 之前要用babel转换成es5代码  ,包含设置兼容ie8的情况
*/
