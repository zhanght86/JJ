/**
 * Created by pan_xiong on 2017-1-17.
 */
export default {
  getUrlKey : function (name) {
  return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||'';
}
};



