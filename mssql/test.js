var db=require('./db');
db.sql('select * from student',function(err,result){
	if(err){
		console.log(err);
		return;
	}
	console.log('学生总数为：',result.length);
});