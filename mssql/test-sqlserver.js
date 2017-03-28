var db=require('./part/db-sqlserver');
db.sql("insert into Ns_student(Name,age) values('aa"+(new Number(Math.random() * 100000).toFixed(0))+"',33);select 1 as 'succ'",function(err,result){
	if(err){
		console.log(err);
		return;
	}
	console.log('结果集：',result);
});
db.sql('select * from dbo.NS_Student',function(err,result){
	if(err){
		console.log(err);
		return;
	}
	console.log('学生总数为：',result.length);
	console.log('结果集：',result);
});
