<template>
    <div id="consolidateexer" class="container">
      <!-- 头部固定切换start -->
      <div v-if="isParent" class="fix-tab cf">
        <span class="textChild">{{name}}</span>
        <a href="tabchild.html" v-show="ismult" class="btnChild">切换</a>
      </div>
      <!-- 头部固定切换end -->
      <div class="consolidateexer-mainbody">
        <statistics :sparams="sparams"></statistics>
        <div class="choose-subject-1">
          <a href="javascript:;">
            <div class="time-group subjectDiv">
              <span class="current-subject">当前学科</span>
              <span class="choose-icon"></span>
              <span class="subject-knowledge">{{subjectName}}</span>
            </div>
          </a>
        </div>
    </div>
    </div>
</template>

<script type="text/javascript">
  import statistics from '../components/statistics'
    export default {
      components:{statistics},
        name: 'consolidateexr',////
      data(){
            return {
              params:null,
              paperResource:'01',
              qidResource:'05'
            }
      },
        created(){
          //console.log(this.API);//
            this.params={phaseID:this.API.getUrlKey('phaseID'),subjectID:this.API.getUrlKey('subjectID'),subjectName:this.API.getUrlKey('subjectName'),timeID:this.API.getUrlKey('timeID'),timeName:this.API.getUrlKey('timeName'),multiChild:this.API.getUrlKey('multiChild'),role:this.API.getUrlKey('role'),name:this.API.getUrlKey('name')}
            if(this.params.phaseID.length==0){
                this.$store.dispatch('getAccessRec',{type:1}).then(res=>{
                    var result=res.data;
                    if(result&&result.status==0){
                        Object.assign(this.params,result.data);
                        //this.params=result.data;
                    }else{
                        console.log('error:'+result?result.msg:'数据未获取到');
                    }
                });
            }
            this.$store.dispatch('getRecommend',{a:1}).then(res=>{console.log(res.data)});
        },
      computed:{
            isParent:function(){
                return this.params.role=='0'?true:false;//
            },
            name:function(){
                return this.params.name;
            },
            ismult:function(){
                return this.params.multiChild=='1'?true:false;
            },
        subjectName:function(){
          return this.params.subjectName;//
        },
        sparams:function(){
            console.log(this.params.phaseID);
            return {phaseID:this.params.phaseID,subjectID:this.params.subjectID,timeID:this.params.timeID};//
        }
      }
    }
</script>

<style>
  @import '../css/reset.css';
  html{
        height:100%;
  }
  body{
        height:100%;
  }
  .container{
        height:100%;
    background: #f8f8f8;
  }
  .consolidateexer-mainbody{
    position: static;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }
  /*头部固定切换start*/
  .fix-tab{
    height: 40px;
    text-align: center;
    background: #54cc79;
    position: relative;
  }
  .fix-tab span{
    display: inline-block;
    max-width: 150px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .fix-tab a{
    position: absolute;
    right: 10px;
    top: 10px;
    display: block;
    float: right;
    width: 50px;
    height: 20px;
    line-height: 20px;
    background: #f2fff6;
    color: #39ba60;
    font-size: 12px;
    border-radius: 20px;
    text-align: center;
  }
  /*头部固定切换end*/
  /*头部题量展示 start*/
  .mymis-nav{
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .mymis-nav li{
    float: left;
    width: 50%;

    text-align: center;

  }
  .mymis-nav li>div{
    margin-top: 30px;
    margin-bottom: 30px;
    border-right: 1px solid #eee;
  }
  .mymis-nav li:last-child div{
    border-right: none;


  }
  .mymis-nav span{
    display: inline-block;
    color: #333;
    font-size: 14px;
  }
  .mymis-nav span.misnum {
    color: #ffa203;
    font-size: 40px;
    line-height: 40px;
  }
  .mymis-nav li>div span:last-child{
    width:100%;
  }
  /*头部题量展示 end*/
  .choose-subject-1{
    padding:1px 0px;
  }
  .choose-subject-1 a{
    display: block;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    margin:12px 0px 14px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background: #fff;
  }
  .choose-subject-1 a:active{
    background: #f3f0f0;
  }
  .choose-subject-2{
    background: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .choose-subject-2 a{
    display: block;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .choose-subject-2 a:active{
    background: #f3f0f0;
  }
  .choose-subject-a{
    border-bottom: 1px solid #eee;
  }
  .choose-subject-3{
    margin-top: 15px;
  }
  .time-group{
    padding:9px 15px 9px 0px;
    margin-left: 15px;
    line-height: 25px;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time-group .current-subject{
    display: inline-block;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    padding-left: 30px;
    background: url(../images/left-icon.png) no-repeat left center;
    background-size: 16px 18px;
  }
  .time-group .current-subject-2{
    background: url(../images/left-icon-2.png) no-repeat left center;
    background-size: 17px 24px;
  }
  .time-group .current-subject-3{
    background: url(../images/left-icon-3.png) no-repeat left center;
    background-size: 17px 24px;
  }
  .time-group .choose-icon{
    float: right;
    display: inline-block;
    width: 8px;
    height: 13px;
    margin-top: 6px;
    background: url(../images/right-icon.png) no-repeat center;
    background-size: 100%;
    vertical-align: middle;
  }
  .time-group .subject-knowledge{
    float: right;
    margin-right: 15px;
    font-size: 16px;
    color: #999;
  }
  .easy-wrong {
    height: 87px;
    padding: 9px 0px 9px 0px;
    margin-left: 15px;
    margin-right: 15px;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #eee;
  }
  .no-easy-wrong{
    border-bottom1: none;
  }
  .easy-wrong .choose-name {
    width: 74%;
    display: inline-block;
    line-height: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .easy-wrong .easy-p {
    font-size: 12px;
    color: #999;
    line-height: 23px;
  }
  .accuracy{
    float: right;
    display: inline-block;
    width: 70px;
    height: 65px;
  }
  .accuracy-red{
    background: url(../images/accuracy-red.png) no-repeat center center;
    background-size: 100%;
  }
  .accuracy-yellow{
    background: url(../images/accuracy-yellow.png) no-repeat center center;
    background-size: 100%;
  }
  .accuracy-green{
    background: url(../images/accuracy-green.png) no-repeat center center;
    background-size: 100%;
  }
  .accuracy-p1{
    margin-top: 30px;
    font-size: 14px;
    color: #de8042;
    text-align: center;
  }
  .accuracy-green .accuracy-p1{
    color: #53b945;
  }
  .accuracy-yellow .accuracy-p1{
    color:#e8894c;
  }
  .accuracy-respondence{
    float: right;
    display: inline-block;
    width: 70px;
    height: 65px;
  }
  .accuracy-span1{
    display: block;
    width: 66px;
    height: 22px;
    line-height: 22px;
    margin-top: 22px;
    border-radius: 11px;
    background: #fda84d;
    color: #fff;
    text-align: center;
    vertical-align: middle;
  }
  /*题目分析底部通栏*/
  .topic-analysis {
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background: #39bb61;
  }
  .topic-analysis  span{
    display: block;
    float: left;
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    width: 50%;
    background: #39ba60;
  }
  .topic-analysis  span:active{
    background: #2eab54;
  }
  .topic-analysis  span:first-child{
    border-right: solid 1px #eee;
  }
  /*巩固练习无数据页面*/
  .no-recommend{
    height: 133px;
    /*padding-top: 33px;*/
    background: url(../images/no-recommend.png) no-repeat center 33px;
    background-size: 35px 43px;
  }
  .no-recommend-tit{
    color: #bbb;
    padding-top: 88px;
    text-align: center;
  }

  /*panx*/
  .topic-analysis{
    position1: fixed;
    width1: 100%;
    bottom1: 0;
  }
  #loading{
    position:fixed;
    bottom:0;
    width:100%;
  }
  .loading {
    display: none;
    opacity: 1;
    color: rgb(255, 155, 155);
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-family: 微软雅黑;
  }
  .allchoose{

  }
  .choose-subject-2 a:last-child div{
    border-bottom: none;
  }
  .choose-subject-2.allchoose{
    border-bottom: none;
  }
  .hide{
    display:none;
  }
</style>
