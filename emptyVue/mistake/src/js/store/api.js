/**
 * Created by pan_xiong on 2017-2-12.
 */
import Vue from 'vue';
function middler(name){
  return (data)=> Vue.http[API[name].method](API[name].url,Object.assign({},API[name].data||{},data)).catch(()=>{
    console.log('数据异常，请查检请求');
  });
}
var API={
  getRecommend:{
    url:'/api/getRecommend',
    method:"post",
    data:{}
  },
  getAccessRec:{
  url:'/api/getAccessRec',
    method:"post",
    data:{}
},
  getStatistics:{
    url:'/api/getStatistics',
    method:"post",
    data:{}
  },
};
export default {
  actions:{
    getRecommend({},params){
        return middler('getRecommend')(params);
    },
    getAccessRec({},params){
      return middler('getAccessRec')(params);
    },
    getStatistics({},params){
      return middler('getStatistics')(params);
    }
  }
}
