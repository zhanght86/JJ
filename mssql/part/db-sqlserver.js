//封装连接数据库代码:db.js
//mssql模块简单封装 
var mssql=require('mssql');
var db={};
var config={
	user:'nodesql',
	password:'nodesql',
	server:'192.168.2.207',
	database:'nodejs',
	//port:123,
	options:{
		//encrypt:true
	},
	pool:{
		min:0,max:10, idleTimeoutMillis: 3000
	}
};
db.sql=function(sql,callback){
	var connection=new mssql.Connection(config,function(err){
		if(err){
			console.log(err);
			return;
		}
		var ps=new mssql.PreparedStatement(connection);
		ps.prepare(sql,function(err){
			if(err){
				console.log(err);
				return;
			}
			ps.execute('',function(err,result){
				if(err){
					console.log(err);
					return;
				}
				ps.unprepare(function(err){
					if(err){
						console.log(err);
						callback(err,null);
						return;
					}
					callback(err,result);
				});
			});
		});
	});
};
module.exports=db;