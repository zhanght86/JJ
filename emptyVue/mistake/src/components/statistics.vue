<template>
  <div class="cf nav-div">
    <!-- 头部题量展示 start -->
    <ul class="cf mymis-nav">
      <li>
        <div>
          <span>今日{{name}}（题）</span>
          <span class="misnum cf todayExercise">{{statistics.todayExercise}}</span>
        </div>

      </li>
      <li>
        <div>
          <span>累计{{name}}（题）</span>
          <span class="misnum cf statisticsExercise">{{statistics.statisticsExercise}}</span>
        </div>

      </li>
    </ul>
    <!-- 头部题量展示 end -->
  </div>
</template>

<script type="text/javascript">
    export default {
        props:["sparams"],
        data () {
            return {
                name: this.type==1?"练习":"错题",
                statistics:{todayExercise:0,statisticsExercise:0},

            }
        },
      created(){

      },
      watch:{
        sparams:function(sparams){//
          this.$store.dispatch('getStatistics',sparams).then(res=>{
            var result=res.data;
            if(result&&result.status==0){
              if(this.type!=1){
                result.data.todayExercise=result.data.todayError;
                result.data.statisticsExercise=result.data.todayExercise;
              }
              this.statistics=result.data;
            }else{
              console.log('error:'+result?result.msg:'数据未获取到');
            }
          });
        }
      }
    }
</script>

<style>

</style>
