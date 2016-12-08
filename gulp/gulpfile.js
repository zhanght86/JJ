var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
	rev = require('gulp-rev'),                        //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),          //- 路径替换
	replace=require('gulp-replace'),//内容替换
    del = require('del');

gulp.task('minifycss', function() {
    return gulp.src('src/css/home/*.css')      //压缩的文件
		  .pipe(minifycss())
          .pipe(gulp.dest('static/css/home'))   //输出文件夹
          //.pipe(minifycss());   //执行压缩
});
gulp.task('minifyjs', function() {
    return gulp.src('src/js/home/*.js')
        //.pipe(concat('main.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('minified/js'))    //输出main.js到文件夹
        //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('static/js/home'));  //输出
});
gulp.task('concat', function() {
	//- 创建一个名为 concat 的 task
	gulp.src('src/css/home/*.css')                            
	//- 需要处理的css文件，放到一个字符串数组里
	//.pipe(concat('wrap.min.css'))               //- 合并后的文件名
    .pipe(minifycss())                         //- 压缩处理成一行
    .pipe(rev())                              //- 文件名加MD5后缀
    //.pipe(gulp.dest('./dist/css'))                //- 输出文件本地
    .pipe(rev.manifest())                     //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev'));                  //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('env', function() {
    return gulp.src(['../web/错题本/views/*.html'])                    
    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
	.pipe(replace(/xxdevv/g,'xxpro'))
    .pipe(revCollector({replaceReved:true}))                                   
    //- 执行文件内css名的替换
    .pipe(gulp.dest('../mistakes/trunk/mistakes/web/views'));                                
    //- 替换后的文件输出的目录
});
gulp.task('rev',['concat'], function() {
    return gulp.src(['./rev/*.json', './views/*.html'])                   
    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector({replaceReved:true}))                                   
    //- 执行文件内css名的替换
    .pipe(gulp.dest('./viewss'));                                
    //- 替换后的文件输出的目录
});

//(1)切换环境，主要是改变html中的变量
gulp.task('changeEnv', ['rev']);
////(2)压缩css和js
gulp.task('minify',function(){//压缩css和js
	//del(['static/css', 'static/js']);
	setTimeout(function(){
		gulp.start('minifycss','minifyjs');
	},200);
});
gulp.task('default', function(){
	
}
);
//gulp.task('clean', function(cb) {
    //del(['static/css', 'static/js'], cb)
//});

//JS处理
// gulp.task('minifyjs',function(){
   // return gulp.src(['/static/js/juicer-min.js','/static/js/bootstrap.min.js','/static/js/bootstrap-datetimepicker.min.js','/static/js/order_query.js'])  //选择合并的JS
       // .pipe(concat('order_query.js'))   //合并js
       // .pipe(gulp.dest(''dist/js'))         //输出
       // .pipe(rename({suffix:'.min'}))     //重命名
       // .pipe(uglify())                    //压缩
       // .pipe(gulp.dest('dist/js'))            //输出 
       // .pipe(notify({message:"js task ok"}));    //提示
// });