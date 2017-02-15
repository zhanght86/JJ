/**
 * Created by pan_xiong on 2017-2-12.
 */
import Vue from 'vue';
function middler(name){
  return (data)=> Vue.http[API[name].method](API[name].url,Object.assign({},API[name].data||{},data));
}
var API={
  getRecommend:{
    url:'/api/getRecommend',
    method:"post",
    data:{}
  }
};
export default {
  actions:{
    getRecommend({},params){
        return middler('getRecommend')(params);
    }
  }
}
