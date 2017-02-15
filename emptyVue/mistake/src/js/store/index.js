/**
 * Created by pan_xiong on 2017-2-12.
 */
import vue from 'vue';
import vuex from 'vuex';
import Api from './api';
vue.use(vuex);
export default new vuex.Store({
  modules:{
    Api
  }
})

