/**
 * Created by pan_xiong on 2017-1-12.
 * 公共方法
 */
module.exports={
  getUrlKey(name){
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||'';
  }
}

